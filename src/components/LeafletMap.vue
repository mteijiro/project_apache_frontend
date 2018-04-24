<head>
</head>

<template>
  <div>
    <div id="mapid" v-bind="mymap" width="100%"></div>
  </div>
</template>

<script>
import L from 'leaflet'
import cheapRuler from 'cheap-ruler'

export default {
  name: 'leaflet-map',
  props: {
    newCoords: {
      latitude: {
        type: Number,
        default: 0.0
      },
      longitude: {
        type: Number,
        default: 0.0
      },
      range: {
        type: Number,
        default: 0.0
      }
    }
  },
  data () {
    return {
      mymap: {
      },
      myMarker: {
      },
      curCoords: {
        latCoord: {
          type: Number,
          default: 0.0
        },
        longCoord: {
          type: Number,
          default: 0.0
        },
        range: {
          type: Number,
          default: 0.0
        }
      }
    }
  },
  mounted () {
    this.ruler = cheapRuler(55.681078, 'meters')
    var mymap = L.map('mapid', {
      minZoom: 13,
      maxZoom: 18,
      maxBounds: [[55.71, 12.50], [55.65, 12.66]]
    }).setView([55.681078, 12.565966], 13)
    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
      attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
      '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
      'Imagery © <a href="http://mapbox.com">Mapbox</a>',
      id: 'mapbox.streets'
    }).addTo(mymap)

    this.myMarker = L.marker([55.681078, 12.565966], {draggable: true}).addTo(mymap)
    this.myRangeMarker = undefined

    // .bindPopup('<b>Location</b><br />Drag me to your location.').openPopup()
    var outer = this
    this.myMarker.on('dragend', function (e) {
      outer.curCoords.latCoord = this.getLatLng().lat
      outer.curCoords.longCoord = this.getLatLng().lng
      outer.$emit('coordsChanged', outer.curCoords)
    })
    this.mymap = mymap
  },
  methods: {
    // Update the map with new coordinates.
    updateCoords () {
      this.curCoords.latCoord = this.newCoords.latitude
      this.curCoords.longCoord = this.newCoords.longitude
      this.curCoords.range = this.newCoords.range
      this.mymap.setView([this.curCoords.latCoord, this.curCoords.longCoord], this.mymap.getZoom())
      this.myMarker.setLatLng([this.curCoords.latCoord, this.curCoords.longCoord]).update()
      if (this.myRangeMarker !== undefined) {
        this.mymap.removeLayer(this.myRangeMarker)
      }
      if (this.curCoords.range > 0.0) {
        this.myRangeMarker = L.circle([this.curCoords.latCoord, this.curCoords.longCoord], {
          color: 'red',
          fillColor: '#f03',
          fillOpacity: 0.5,
          radius: this.curCoords.range
        }).addTo(this.mymap)
      }
      //   var halfRange = this.curCoords.range / 2
      //   halfRange = Math.sqrt((halfRange * halfRange) + (halfRange * halfRange))
      //   console.log(halfRange)
      //   // 315, 135
      //
      //   var topLat = this.ruler.destination([this.curCoords.latCoord, this.curCoords.longCoord], halfRange, 90)[0]
      //   var bottomLat = this.ruler.destination([this.curCoords.latCoord, this.curCoords.longCoord], halfRange, 270)[0]
      //   var leftLong = this.ruler.destination([this.curCoords.latCoord, this.curCoords.longCoord], halfRange, 180)[1]
      //   var rightLong = this.ruler.destination([this.curCoords.latCoord, this.curCoords.longCoord], halfRange, 0)[1]
      //
      //   var pt1 = [topLat, rightLong]
      //   var pt2 = [bottomLat, leftLong]
      //   console.log(pt1 + ', ' + pt2)
      //   var bounds = [pt1, pt2]
      //
      //   this.myRangeMarker = L.rectangle(bounds, {color: 'red', weight: 1}).addTo(this.mymap)
      // }
    }
  },
  watch: {
    // Check when the newCoords prop is updated so that leaflet can update the map
    newCoords: {
      handler: function (val, oldVal) {
        this.updateCoords()
      }
    }
  }
}
</script>

<style scoped>
  #mapid { display: block; margin-left: auto; margin-right: auto; width: 100vh; height: 50vh;}
</style>
