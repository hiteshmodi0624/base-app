export const locations = {
  Irvington: [-73.89002, 41.047358],
  Montauk: [-71.938137, 41.079225],
  Stamford: [-73.534828, 41.027845],
  "NY Harbor": [-74.037766, 40.5956],
  Kansas: [-98.377714, 38.700216],
  "Barnegat Bay": [-74.13792, 39.82164],
  "Added Waypoint": [-72.79, 41.083],
  "George Washington Bridge": [-73.951939, 40.851086],
  "Old Point Comfort Light": [-76.311826, 36.987005],
};
export const getLatLng = (lat : number, lng : number ) => {
  return {
    lat,
    lng,
    latitude: lat,
    longitude: lng,
    Latitude: lat,
    Longitude: lng,
  };
};
export const barnegatBayMarkers = [getLatLng(39.79786, -74.14532), getLatLng(39.76343, -74.16012), getLatLng(39.73213, -74.0421)];

export const testRoutes = {
  "NY To Montauk": [
    [40.67846, -74.03732],
    [41.06279, -71.92672],
  ],
  "Montauk To Block Island": [
    [41.19553, -71.58516],
    [41.0858, -71.93552],
  ],
  "Long Island Sound": [
    [41.12409, -71.80974],
    [41.2347, -72.00745],
  ],
  "Four Banger": [
    [41.27387, -71.72328],
    [41.03718, -71.71346],
    [41.10599, -72.47072],
    [40.74555, -73.96979],
  ],
  "Four Banger Moved": [
    [41.27969, -71.6904],
    [41.04306, -71.69122],
    [41.14716, -72.37058],
    [40.77757, -73.93682],
  ],
  "Land Route": [
    [40.43962, -73.81596],
    [40.73684, -73.61634],
  ],
};
