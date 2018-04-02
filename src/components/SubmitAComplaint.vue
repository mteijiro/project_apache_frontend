<template>
    <div class="greetings">
        <h2>Submit A Complaint</h2>
        <form>
          <template v-if="formIndex === 0">
            <div>Username:</div>
            <input type="text" v-model="myCredentials.username" value="username">
            <div>Password:</div>
            <input type="text" v-model="myCredentials.password" value="password">
          </template>
          <template v-if="formIndex === 1">
            <div>Severity: {{ newComplaint.severity }}</div>
            <select v-model="newComplaint.severity">
              <option disabled value="">Select Severity</option>
              <option v-for="severityRating in severityRatings" v-bind:key="severityRating.key">
                {{ severityRating.value }}</option>
            </select>
            <br />
            <div>Category: {{ newComplaint.category }}</div>
            <select v-model="newComplaint.category">
              <option disabled value="">Define Category</option>
              <option v-for="category in categories" v-bind:key="category.key">
                {{ category.value }}</option>
            </select>
            <br />
          </template>
          <template v-if="formIndex === 2">
            <span>Location</span>
            <br />
            <input type="text" v-model="newComplaint.latitude" value="latitude">
            <input type="text" v-model="newComplaint.longitude" value="longitude">
            <br />
            <input type="button" v-on:click="getUserLocation(this)" value="Auto Detect My Location">
            <br />
            <input type="text" id="addressBox" value="Search by Address">
            <button type="button" v-on:click="searchAddress(lookupAddress)">Search</button>
            <p id="locationDisplay">Please drag the arrow to your location.</p>
            <leaflet-map id="myMap" v-bind:newCoords="{latitude : newComplaint.latitude, longitude : newComplaint.longitude}" v-on:coordsChanged="onDragMapCoords"> </leaflet-map>
          </template>
          <template v-if="formIndex === 3">
            <div>Comments:</div>
            <input type="text" v-model="newComplaint.comments" value="comments">
            <br />
            <span>Image</span>
            <input type="file" @change="onImageSelected" accept="image/*">
            <br />
            <span>Audio</span>
            <input type="file" @change="onAudioSelected" accept="audio/*">
            <br />
          </template>
          <br />
          <template>
            <button type="button" value="back" v-on:click="backButtonPressed()">Back</button>
            <button type="button" value="submit" v-on:click="submitComplaint(myCredentials, newComplaint)">{{ submitOrNext() }}</button>
          </template>
        </form>
    </div>
</template>

<script>

import LeafletMap from './LeafletMap.vue'
// import
import { OpenStreetMapProvider } from 'leaflet-geosearch'

export default {
  name: 'SubmitAComplaint',
  props: {},
  components: {
    'leaflet-map': LeafletMap
  },
  data () {
    return {
      newComplaint: {
        username: 'invalid',
        password: 'noPassword',
        category: 'Street Noise',
        severity: '1',
        latitude: 0.0,
        longitude: 0.0,
        comments: 'no comments',
        imageUP: null,
        audioUP: null
      },
      lookupAddress: '',
      provider: null,
      formIndex: 0,
      endFormIndex: 3,
      myCredentials: {},
      imageUpload: null,
      audioUpload: null,
      categories: [{key: 1, value: 'Street Noise'}, {key: 2, value: 'Automobile'}, {key: 3, value: 'Business Noise'}],
      severityRatings: [{key: 1, value: '1'}, {key: 2, value: '2'}, {key: 3, value: '3'}, {key: 4, value: '4'},
        {key: 5, value: '5'}, {key: 6, value: '6'}, {key: 7, value: '7'}, {key: 8, value: '8'}, {key: 9, value: '9'},
        {key: 10, value: '10'}]
    }
  },
  methods: {
    async searchAddress () {
      // search
      const address = document.getElementById('addressBox').value
      console.log('Your Address: ' + address)
      const results = await this.provider.search({ query: address })
      console.log(results)
      this.newComplaint.longitude = results[0].x
      this.newComplaint.latitude = results[0].y
    },
    getUserLocation (complaint) {
      var me = this

      function getLocation (callback) {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(callback)
        } else {
          callback(null)
        }
      }

      getLocation(function (pos) {
        // do stuff
        if (pos != null) {
          me.newComplaint.latitude = pos.coords.latitude
          me.newComplaint.longitude = pos.coords.longitude
        }
      })
    },
    submitOrNext () {
      if (this.formIndex < this.endFormIndex) {
        return 'Next'
      } else {
        return 'Submit'
      }
    },
    onDragMapCoords: function (newCoords) {
      this.newComplaint.latitude = newCoords.latCoord
      this.newComplaint.longitude = newCoords.longCoord
    },
    onImageSelected (event) {
      console.log(event)
      this.imageUpload = event.target.files[0]
      this.newComplaint.imageUP = this.imageUpload
    },
    onAudioSelected (event) {
      console.log(event)
      this.audioUpload = event.target.files[0]
      this.newComplaint.audioUP = this.audioUpload
    },
    backButtonPressed () {
      if (this.formIndex > 0) {
        this.formIndex = this.formIndex - 1
      }
    },
    submitComplaint: function (myCredentials, newComplaint) {
      if (this.formIndex < this.endFormIndex) {
        this.formIndex = this.formIndex + 1
      } else {
        this.sendToDatabase(myCredentials, newComplaint)
      }
    },
    sendToDatabase (myCredentials, newComplaint) {
      const credentialsForm = new FormData()
      credentialsForm.append('username', myCredentials.username)
      credentialsForm.append('password', myCredentials.password)
      const complaintForm = new FormData()
      complaintForm.append('severity', newComplaint.severity)
      complaintForm.append('category', newComplaint.category)
      complaintForm.append('latitude', String(newComplaint.latitude))
      complaintForm.append('longitude', String(newComplaint.longitude))
      complaintForm.append('comments', newComplaint.comments)
      if (newComplaint.imageUP != null) {
        complaintForm.append('image', newComplaint.imageUP, newComplaint.imageUP.name)
      }
      if (newComplaint.audioUP != null) {
        complaintForm.append('audio', newComplaint.audioUP, newComplaint.audioUP.name)
      }
      fetch('http://18.197.8.126:8000/get-token/', {
        mode: 'cors',
        body: credentialsForm,
        method: 'POST'
      }).then(response => response.json()) // Convert the token response into a JSON object
        .then(JSONresponse => JSON.stringify(JSONresponse.token)) // Select the token string from the object.
        .then(tokenString => 'Token ' + JSON.parse(tokenString)) // Remove string quotations and concatenate with authorization syntax
        .then(resp4 => {
          // alert(resp4) // (For debugging purposes) print out the token.
          fetch('http://18.197.8.126:8000/complaints/', {
            mode: 'cors',
            headers: {
              'Authorization': resp4
            },
            body: complaintForm,
            method: 'POST'
          })
            .then((resp) => {
              alert('Your complaint has been submitted!')
              alert('Complaint Data: ' + JSON.stringify(resp))
            })
        })
      this.formIndex = 0
    }
  },
  created: function () {
  },
  mounted: function () {
    // setup
    this.provider = new OpenStreetMapProvider()
  }
}
</script>

<style scoped>
</style>
