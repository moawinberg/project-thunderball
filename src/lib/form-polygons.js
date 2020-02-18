import zarr from 'zarr';

/**
 * 
 * @param {*} arr zArray of forecast data
 * @param {*} nw northwest coords of map area
 * @param {*} se southeast coords of map area
 * @param {*} validTime forecast timestamp
 */


const make_polygons = ( ne, sw, validTime) => {
    //const forecast = arr[validTime, null, null] // get all datapoints for desired forecast

    // init geojson object
    const geo = {
        "type": "FeatureCollection",
        "features": []
    }
    // iterate over coords in zArr
    // first loop is latitude
    for (let la = (sw.lat); la <= ne.lat; la += 1) {
        //second is longitude
        for (let lon = sw.lng; lon <= ne.lng; lon +=1) {
            //console.log(lon)
            //console.log(la)
            const geometry = {
                "type": "Polygon",
                "coordinates": [[[lon, la], [lon + 1, la], [lon + 1, la + 1], [lon, la + 1], [lon, la]]]
            }

            const properties = {
                "airPressure":1000 + Math.round(Math.random()*25)
            }

            geo.features.push({ "geometry": geometry, "type": "Feature", "properties": properties })
        }
    }
    return geo
}

export const roundToQuarter = (number) => {
    return (Math.round(number * 4) / 4).toFixed(2)
}

export default make_polygons;