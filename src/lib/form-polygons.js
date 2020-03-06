

/**
 *
 * @param {*} arr array of forecast data
 * @param {*} nw northwest coords of map area
 * @param {*} se southeast coords of map area
 * @param {*} validTime forecast timestamp
 */


const make_polygons = (data, lon, lat, validTime, height, referenceTime) => {
    // get the desired forecast
    //referenceTime = referenceTime < 0 ?  0 : referenceTime
    console.log(`reference: ${referenceTime}, validTime: ${validTime}`)
    const tempForecast = data['T']['data'][referenceTime][validTime][height];
    const uForecast = data['U']['data'][referenceTime][validTime][height];
    const vForecast = data['V']['data'][referenceTime][validTime][height];
    // init geojson object
    const geo = {
        "type": "FeatureCollection",
        "features": []
    }
    // iterate over coords in data
    // first loop is latitude
    for (let long = 0; long < lon.length - 1; long++) {
        //second is longitude
        for (let latit = 0; latit < lat.length - 1; latit++) {
            //console.log(lat_start)
            const geometry = {
                "type": "Polygon",
                "coordinates": [[[lon[long], lat[latit]], [lon[long+ 1], lat[latit]], [lon[long + 1], lat[latit + 1]], [lon[long], lat[latit + 1]], [lon[long], lat[latit]]]]
            }
            let properties = {}
            if (latit < lat.length - 1 && long < lon.length - 1) {
                properties = {
                    "temperature": ((tempForecast[latit][long] + tempForecast[latit + 1][long] + tempForecast[latit + 1][long + 1] + tempForecast[latit][long + 1]) / 4),
                    "windspeed": Math.sqrt(Math.pow(uForecast[latit][long], 2) + Math.pow(vForecast[latit][long], 2))
                }

            }
            else {
                properties = {
                    "temperature": tempForecast[latit][long],
                    "windspeed" : Math.sqrt(Math.pow(uForecast[latit][long], 2) + Math.pow(vForecast[latit][long], 2))
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
