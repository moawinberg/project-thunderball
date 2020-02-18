import zarr from 'zarr';

/**
 * 
 * @param {*} arr zArray of forecast data
 * @param {*} nw northwest coords of map area
 * @param {*} se southeast coords of map area
 * @param {*} validTime forecast timestamp
 */
const make_polygon = (arr, ne, sw, validTime) => {
    const forecast = arr[validTime, null, null] // get all datapoints for desired forecast

    // init geojson object
    const geo = {
        type: "FeatureCollection",
        features: []
    }

    // iterate over coords in zArr
    // first loop is latitude
    for (let la = roundToQuarter(sw.lat); la <= roundToQuarter(ne.lat); la += 0.25) {
        //second is longitude
        for (let lon = roundToQuarter(sw.lng); lon <= roundToQuarter(ne.lng); lon += 0.25) {
            const geometry = {
                "type": "Polygon",
                "coordinates": [[la, lon], [la + 0.25, lon], [la + 0.25, lon + 0.25], [la, lon + 0.25]]
            }

            const properties = {
                "airPressure":forecast[la, lon]
            }

            geo.features.push({ "geometry": geometry, type: "Feature", properties: properties })
        }
    }
    return geo
}

const roundToQuarter = (number) => {
    return (Math.round(number * 4) / 4).toFixed(2)
}

export default make_polygon;