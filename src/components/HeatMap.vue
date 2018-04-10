<!--This was a test component to see if I could get leaflet.heat to work, it does not right now-->

<head></head>
<template>
  <div>
    <md-field>
      <label>Username:</label>
      <md-input v-model="myCredentials.username"></md-input>
    </md-field>
    <md-field>
      <label>Password:</label>
      <md-input type="password" v-model="myCredentials.password"></md-input>
    </md-field>
    <md-button class="md-raised" v-on:click="heatTest()">Generate Heatmap</md-button>
    <br />
    <div>
      <div id="heatMapId" v-bind="mymap" ></div>
    </div>
  </div>
</template>

<script>
import L from 'leaflet'
import 'leaflet.heat'

export default {
  name: 'HeatMap',
  data () {
    return {
      myCredentials: {
        username: '',
        password: '',
        token: ''
      },
      coordsArray: [],
      mymap: {}
    }
  },
  methods: {
    generateHeatmap () {
      this.justDoEverything()
    },
    // Compile credentials into a formData object for a post submission
    compileCredentials (myCredentials) {
      const credentialsForm = new FormData()
      credentialsForm.append('username', myCredentials.username)
      credentialsForm.append('password', myCredentials.password)
      return credentialsForm
    },
    login () {
      var credentialsForm = this.compileCredentials(this.myCredentials)
      fetch(this.$api + '/get-token/', {
        mode: 'cors',
        body: credentialsForm,
        method: 'POST'
      }).then(response => response.json()) // Convert the token response into a JSON object
        .then(JSONresponse => JSON.stringify(JSONresponse.token)) // Select the token string from the object.
        .then(token => { this.myCredentials.token = token })
    },
    getData (token) {
      alert(token)
      fetch(this.$api + '/complaints/', {
        mode: 'cors',
        headers: {
          'Authorization': 'Token ' + token
        },
        method: 'GET'
      }).then(response => response.json()) // Convert the token response into a JSON object
        .then(JSONresponse => { this.addToCoordinateArray(JSONresponse) }) // Select the token string from the object.
    },
    addToCoordinateArray (JSONresponse) {
      var len = JSONresponse.length
      for (var i = 0; i < len; i++) {
        var coordsObject = {
          lat: JSONresponse[i].latitude,
          long: JSONresponse[i].longitude
        }
        this.coordsArray.push(coordsObject)
      }
      console.log(this.coordsArray)
    },
    justDoEverything () {
      var credentialsForm = this.compileCredentials(this.myCredentials)
      fetch(this.$api + '/get-token/', {
        mode: 'cors',
        body: credentialsForm,
        method: 'POST'
      }).then(response => response.json()) // Convert the token response into a JSON object
        .then(JSONresponse => JSON.stringify(JSONresponse.token)) // Select the token string from the object.
        .then(token => this.getData(JSON.parse(token)))
    },
    heatTest () {
      L.heatLayer([
        [55.69, 12.585, 1], // lat, lng, intensity
        [55.6974086, 12.585190600000033, 1]
      ], {radius: 50}).addTo(this.mymap)
    }
  },
  created: function () {
  },
  mounted: function () {
    var mymap = L.map('heatMapId', {
      minZoom: 13,
      maxZoom: 18,
      maxBounds: [[55.71, 12.50], [55.65, 12.66]]
    }).setView([55.6974086, 12.585190600000033], 13)
    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
      attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
      '<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
      'Imagery © <a href="http://mapbox.com">Mapbox</a>',
      id: 'mapbox.streets'
    }).addTo(mymap)
    console.log(L)
    L.heatLayer([
      [55.69, 12.585, 1], // lat, lng, intensity
      [55.6974086, 12.585190600000033, 1]
    ], {
      radius: 50,
      max: 1.0,
      blur: 15,
      gradient: {
        0.0: 'green',
        0.5: 'yellow',
        1.0: 'red'
      },
      minOpacity: 0.7
    }).addTo(mymap)
    // var draw = true
    //
    // mymap.on({
    //   movestart: function () { draw = false },
    //   moveend: function () { draw = true },
    //   mousemove: function (e) {
    //     if (draw) {
    //       heat.addLatLng(e.latlng)
    //     }
    //   }
    // })

    this.mymap = mymap
  }
}
</script>

<style scoped>
  #heatMapId { display: block; margin-left: auto; margin-right: auto; width: 40vw; height: 50vh;}
</style>
