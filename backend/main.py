from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from utils.geocode import geocode_location
from utils.overpass_query import find_nearest_open_space
from utils.routing import get_route

app = FastAPI(title="RescuePath Escape Route API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, set this to your frontend's URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/get-escape-route")
async def escape_route(location: str = Query(...), calamity: str = Query(...)):
    print(f"[API CALL] Received request - Location: {location}, Calamity: {calamity}")

    if calamity.lower() != "earthquake":
        raise HTTPException(400, "Only 'earthquake' is supported for now")

    try:
        origin = await geocode_location(location)
        print(f"[GEOCODE] Origin coordinates: {origin}")
    except Exception as e:
        print(f"[ERROR] Geocoding failed: {e}")
        raise HTTPException(400, f"Geocoding failed: {e}")

    try:
        dest = await find_nearest_open_space(origin["lat"], origin["lon"])
        print(f"[DESTINATION] Nearest open space: {dest}")
    except Exception as e:
        print(f"[ERROR] Finding nearest open space failed: {e}")
        raise HTTPException(404, f"No safe zone found: {e}")

    try:
        route = await get_route(origin, dest)
        print(f"[ROUTE] Route data length: {len(route)} steps")
    except Exception as e:
        print(f"[ERROR] Route calculation failed: {e}")
        raise HTTPException(500, f"Routing failed: {e}")

    return {
        "origin": origin,
        "destination": {
            "name": dest["name"],
            "lat": dest["lat"],
            "lon": dest["lon"]
        },
        "route": route
    }
