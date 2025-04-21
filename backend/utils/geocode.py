# backend/utils/geocode.py
import httpx

async def geocode_location(address: str) -> dict:
    """Use Nominatim to convert an address string into lat/lon."""
    url = "https://nominatim.openstreetmap.org/search"
    params = {
        "q": address,
        "format": "json",
        "limit": 1
    }
    async with httpx.AsyncClient() as client:
        resp = await client.get(url, params=params, headers={"User-Agent": "RescuePathApp/1.0"})
        resp.raise_for_status()
        data = resp.json()
    if not data:
        raise ValueError("Location not found")
    return {
        "lat": float(data[0]["lat"]),
        "lon": float(data[0]["lon"])
    }
