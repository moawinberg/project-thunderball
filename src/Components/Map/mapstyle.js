export const dataLayer = {
    id: 'data',
    type: 'fill',
    paint: {
        'fill-color': {
          property: 'airPressure',
          stops: [
            [1000, '#3288bd'],
            [1100, '#66c2a5'],
            
          ],
        },
        'fill-opacity': 0.8
      }
}