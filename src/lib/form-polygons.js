import zarr from 'zarr';

/**
 * 
 * @param {*} arr array of forecast data
 * @param {*} nw northwest coords of map area
 * @param {*} se southeast coords of map area
 * @param {*} validTime forecast timestamp
 */


const make_polygons = (data, lon, lat, validTime, height, referenceTime) => {
    // get the desired forecast
    const forecast = data[referenceTime][validTime][height];
    console.log(forecast)

    // init geojson object
    const geo = {
        "type": "FeatureCollection",
        "features": []
    }
    // iterate over coords in zArr
    // first loop is latitude
    for (let long = 0; long < lon.length; long++) {
        //second is longitude
        for (let latit = 0; latit < lat.length; latit++) {
            const lon_start = lon[0] + long;
            const lat_start = lat[0] + latit
            const geometry = {
                "type": "Polygon",
                "coordinates": [[[lon_start, lat_start], [lon_start + 1, lat_start], [lon_start + 1, lat_start + 1], [lon_start, lat_start + 1], [lon_start, lat_start]]]
            }
            let properties = {}
            if (latit < lat.length - 1 && long < lon.length - 1) {
                properties = {
                    "airPressure": ((forecast[latit][long] + forecast[latit + 1][long] + forecast[latit + 1][long + 1] + forecast[latit][long + 1]) / 4)
                }
            }
            else {
                properties = {
                    "airPressure": forecast[latit][long]
                }
            }

            geo.features.push({ "geometry": geometry, "type": "Feature", "properties": properties })
        }
    }

    console.log(geo);
    return geo
}

export const roundToQuarter = (number) => {
    return (Math.round(number * 4) / 4).toFixed(2)
}

export default make_polygons;