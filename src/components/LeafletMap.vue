<head>
</head>

<template>
  <div>
    <div id="mapid" v-bind="mymap" ></div>
  </div>
</template>

<script>
import L from 'leaflet'

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
        }
      }
    }
  },
  mounted () {
    var mymap = L.map('mapid', {
      minZoom: 13,
      maxZoom: 18,
      maxBounds: [[55.71, 12.50], [55.65, 12.66]]
    }).setView([55.679479, 12.569470], 13)
    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
      attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
      '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
      'Imagery © <a href="http://mapbox.com">Mapbox</a>',
      id: 'mapbox.streets'
    }).addTo(mymap)

    this.myMarker = L.marker([55.679479, 12.569470], {draggable: true}).addTo(mymap)
      .bindPopup('<b>Location</b><br />Drag me to your location.').openPopup()
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
      this.mymap.setView([this.curCoords.latCoord, this.curCoords.longCoord], this.mymap.getZoom())
      this.myMarker.setLatLng([this.curCoords.latCoord, this.curCoords.longCoord]).update()
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
  #mapid { display: block; margin-left: auto; margin-right: auto; width: 40vw; height: 50vh;}
</style>
