# backend/utils/routing.py
import httpx

async def get_route(origin: dict, dest: dict) -> dict:
    """
    Call OSRM to get a driving route from origin to dest.
    origin/dest are dicts with 'lat' and 'lon'.
    """
    base = "https://router.project-osrm.org/route/v1/driving"
    coords = f"{origin['lon']},{origin['lat']};{dest['lon']},{dest['lat']}"
    params = {"overview": "full", "geometries": "geojson"}
    url = f"{base}/{coords}"
    async with httpx.AsyncClient() as client:
        resp = await client.get(url, params=params)
        resp.raise_for_status()
        data = resp.json()
    route = data["routes"][0]
    return {
        "geometry": route["geometry"],
        "distance": route["distance"],
        "duration": route["duration"]
    }
