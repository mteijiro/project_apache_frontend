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
    var mymap = L.map('mapid').setView([55.679479, 12.569470], 13)
    this.mymap = mymap
    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
      maxZoom: 18,
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

    // .bindPopup('<b>Hello world!</b><br />I am a popup.').openPopup()
    //
    // L.circle([51.508, -0.11], 500, {
    //   color: 'red',
    //   fillColor: '#f03',
    //   fillOpacity: 0.5
    // }).addTo(mymap).bindPopup('I am a circle.')
    //
    // L.polygon([
    //   [51.509, -0.08],
    //   [51.503, -0.06],
    //   [51.51, -0.047]
    // ]).addTo(mymap).bindPopup('I am a polygon.')
    //
    //
    // var popup = L.popup()

    // function getClickCoords (e) {
    //   this.latCoord = e.latlng.lat
    //   this.longCoord = e.latlng.lng
    //   console.log('lat coord is : ' + this.latCoord + 'long coord is :' + this.longCoord)
    // }

    // function moveToCoords (lat, long) {
    //   mymap.setView([lat, long], 13)
    //   this.latCoord = lat
    //   this.longCoord = long
    // }

    // function onMapClick (e) {
    //   popup
    //     .setLatLng(e.latlng)
    //     .setContent('You clicked the map at ' + e.latlng.toString())
    //     .openOn(mymap)
    // }
    // mymap.on('click', onMapClick)
    // mymap.on('click', getClickCoords)
  },
  methods: {
    updateCoords () {
      this.curCoords.latCoord = this.newCoords.latitude
      this.curCoords.longCoord = this.newCoords.longitude
      this.mymap.setView([this.curCoords.latCoord, this.curCoords.longCoord], this.mymap.getZoom())
      this.myMarker.setLatLng([this.curCoords.latCoord, this.curCoords.longCoord]).update()
    }
  },
  watch: {
    newCoords: {
      handler: function (val, oldVal) {
        this.updateCoords()
      }
    }
  }
}
</script>

<style scoped>
  #mapid { display: block; margin-left: auto; margin-right: auto; width: 50vw; height: 50vh;}
</style>
