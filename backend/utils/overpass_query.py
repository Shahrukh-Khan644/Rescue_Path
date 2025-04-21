# backend/utils/overpass_query.py
import httpx
import math

# Tags to search for open spaces
OSM_TAG_QUERIES = [
    'node["leisure"="park"]',
    'way["leisure"="park"]',
    'node["landuse"="recreation_ground"]',
    'way["landuse"="recreation_ground"]',
    'node["leisure"="playground"]',
    'way["leisure"="playground"]',
    'node["leisure"="pitch"]',
    'way["leisure"="pitch"]',
    'node["amenity"="school"]',
    'way["amenity"="school"]',
    'node["leisure"="stadium"]',
    'way["leisure"="stadium"]'
]

async def find_nearest_open_space(lat: float, lon: float, radius: int = 5000) -> dict:
    """Query Overpass for features within radius and return the nearest one."""
    # Build Overpass QL
    query = (
        f"[out:json][timeout:25];"
        f"("
        + "".join([f'{tag}(around:{radius},{lat},{lon});' for tag in OSM_TAG_QUERIES])
        + ");out center;"
    )
    url = "https://overpass-api.de/api/interpreter"
    async with httpx.AsyncClient() as client:
        resp = await client.post(url, data={"data": query})
        resp.raise_for_status()
        data = resp.json()

    # Compute distance
    def dist(a, b):
        # Haversine
        R = 6371000
        φ1, λ1 = math.radians(a["lat"]), math.radians(a["lon"])
        φ2, λ2 = math.radians(b["lat"]), math.radians(b["lon"])
        dφ = φ2 - φ1
        dλ = λ2 - λ1
        h = math.sin(dφ/2)**2 + math.cos(φ1)*math.cos(φ2)*math.sin(dλ/2)**2
        return 2*R*math.asin(math.sqrt(h))

    candidates = []
    for el in data.get("elements", []):
        # Node vs Way: node has lat/lon, way has center
        if el["type"] == "node":
            point = {"lat": el["lat"], "lon": el["lon"]}
        else:
            center = el.get("center")
            if not center:
                continue
            point = {"lat": center["lat"], "lon": center["lon"]}
        point["name"] = el.get("tags", {}).get("name", "Open Space")
        point["dist"] = dist({"lat": lat, "lon": lon}, point)
        candidates.append(point)

    if not candidates:
        raise ValueError("No open spaces found within radius")

    # Return the nearest
    return min(candidates, key=lambda p: p["dist"])
