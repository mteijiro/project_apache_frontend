<template>
    <div class="greetings">
        <h2>Submit A Complaint</h2>
        <form>
          <template v-if="formIndex === 0">
            <md-field>
              <label>Username:</label>
              <md-input v-model="myCredentials.username"></md-input>
            </md-field>

            <md-field>
              <label>Password:</label>
              <md-input type="password" v-model="myCredentials.password"></md-input>
            </md-field>
          </template>
          <template v-if="formIndex === 1">

            <md-field>
              <label for="severity">Severity</label>
              <md-select v-model="severity" name="severity" id="severity">
                <md-option disabled value="">Select Severity</md-option>
                <md-option value="1">1</md-option>
                <md-option value="2">2</md-option>
                <md-option value="3">3</md-option>
                <md-option value="4">4</md-option>
                <md-option value="5">5</md-option>
              </md-select>
            </md-field>

            <md-field>
              <label for="category">Category</label>
              <md-select v-model="category" name="category" id="category">
                <md-option disabled value="">Select Category</md-option>
                <md-option value="Business Venue">Business Venue</md-option>
                <md-option value="Construction">Construction</md-option>
                <md-option value="Traffic">Traffic</md-option>
                <md-option value="Street Noise">Street Noise</md-option>
                <md-option value="Private Party">Private Party</md-option>
                <md-option value="Other">Other</md-option>
              </md-select>
            </md-field>

            <!--<div>Severity: {{ newComplaint.severity }}</div>-->
            <!--<select v-model="newComplaint.severity">-->
              <!--<option disabled value="">Select Severity</option>-->
              <!--<option v-for="severityRating in severityRatings" v-bind:key="severityRating.key">-->
                <!--{{ severityRating.value }}</option>-->
            <!--</select>-->
            <!--<br />-->
            <!--<div>Category: {{ newComplaint.category }}</div>-->
            <!--<select v-model="newComplaint.category">-->
              <!--<option disabled value="">Define Category</option>-->
              <!--<option v-for="category in categories" v-bind:key="category.key">-->
                <!--{{ category.value }}</option>-->
            <!--</select>-->
            <!--<br />-->
          </template>
          <template v-if="formIndex === 2">
            <span>Location</span>
            <br />
            <md-field>
              <label>Latitude:</label>
              <md-input v-model="newComplaint.latitude"></md-input>
            </md-field>
            <md-field>
              <label>Longitude:</label>
              <md-input v-model="newComplaint.longitude"></md-input>
            </md-field>
            <md-button class="md-raised" v-on:click="getUserLocation(this)">Auto Detect My Location</md-button>
            <md-field>
              <label>Search by Address:</label>
              <md-input id="addressBox"></md-input>
            </md-field>
            <md-button class="md-raised" v-on:click="searchAddress(lookupAddress)">Search</md-button>
            <p id="locationDisplay">Please drag the arrow to your location.</p>
            <leaflet-map id="myMap" v-bind:newCoords="{latitude : newComplaint.latitude, longitude : newComplaint.longitude}" v-on:coordsChanged="onDragMapCoords"> </leaflet-map>
          </template>
          <template v-if="formIndex === 3">
            <md-field>
              <label>Comments:</label>
              <md-textarea v-model="newComplaint.comments"></md-textarea>
            </md-field>
            <md-field>
              <label>Image</label>
              <md-file @change="onImageSelected" accept="image/*" placeholder="Upload image file..." />
            </md-field>
            <md-field>
              <label>Audio</label>
              <md-file @change="onAudioSelected" accept="audio/*" placeholder="Upload audio file..." />
            </md-field>
          </template>
          <template v-if="formIndex === endFormIndex">
            <h3>Thank you</h3>
            <p>Your complaint has been submitted</p>
          </template>
          <br />
          <div>
            <template v-if="formIndex > 0 && formIndex < endFormIndex">
              <md-button class="md-raised md-primary" v-on:click="backButtonPressed()">Back</md-button>
            </template>
            <template v-if="formIndex < endFormIndex - 1">
              <md-button class="md-raised md-primary" v-on:click="nextButtonPressed()">Next</md-button>
            </template>
            <template v-if="formIndex === endFormIndex - 1">
              <md-button class="md-raised md-primary" v-on:click="submitComplaint(myCredentials, newComplaint)">Submit</md-button>
            </template>
          </div>
        </form>
    </div>
</template>

<script>

// imports
import LeafletMap from './LeafletMap.vue'
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
        comments: '',
        imageUP: null,
        audioUP: null
      },
      lookupAddress: '',
      provider: null,
      formIndex: 0,
      endFormIndex: 4,
      myCredentials: {},
      imageUpload: null,
      audioUpload: null,
      categories: [
        {
          key: 1,
          value: 'Street Noise'
        },
        {
          key: 2,
          value: 'Automobile'
        },
        {
          key: 3,
          value: 'Business Noise'
        }],
      severityRatings: [{key: 1, value: '1'}, {key: 2, value: '2'}, {key: 3, value: '3'}, {key: 4, value: '4'},
        {key: 5, value: '5'}, {key: 6, value: '6'}, {key: 7, value: '7'}, {key: 8, value: '8'}, {key: 9, value: '9'},
        {key: 10, value: '10'}]
    }
  },
  methods: {
    // Search the given address using the provider defined (Google, OpenStreetmaps, etc.)
    async searchAddress () {
      // search
      const address = document.getElementById('addressBox').value
      const results = await this.provider.search({ query: address })
      this.newComplaint.longitude = results[0].x
      this.newComplaint.latitude = results[0].y
    },
    // Get the location of the user using the HTML5 getCurrentPosition function.
    getUserLocation () {
      var me = this

      function getLocation (callback) {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(callback)
        } else {
          callback(null)
        }
      }
      // Update the coordinates on this vue object with the new coordinates passed in
      // Used as a callback for the getLocation function above
      getLocation(function (pos) {
        // do stuff
        if (pos != null) {
          me.newComplaint.latitude = pos.coords.latitude
          me.newComplaint.longitude = pos.coords.longitude
        }
      })
    },
    // Decrement the index to tell vue to go to the previous page.
    backButtonPressed () {
      if (this.formIndex > 0) {
        this.formIndex = this.formIndex - 1
      }
    },
    // Decrement the index to tell vue to go to the previous page.
    nextButtonPressed () {
      if (this.formIndex < this.endFormIndex - 1) {
        this.formIndex = this.formIndex + 1
      }
    },
    // Update the latitude and longitude values on this vue object based off of the values passed in
    // Used specifically for the map object.
    onDragMapCoords: function (newCoords) {
      this.newComplaint.latitude = newCoords.latCoord
      this.newComplaint.longitude = newCoords.longCoord
    },
    // Prepare image file for submission
    onImageSelected (event) {
      this.imageUpload = event.target.files[0]
      this.newComplaint.imageUP = this.imageUpload
    },
    // Prepare audio file for submission
    onAudioSelected (event) {
      this.audioUpload = event.target.files[0]
      this.newComplaint.audioUP = this.audioUpload
    },
    // Advance the page or submit the form
    submitComplaint: function (myCredentials, newComplaint) {
      if (this.formIndex === this.endFormIndex - 1) {
        this.sendToDatabase(myCredentials, newComplaint)
        this.formIndex = this.formIndex + 1
      }
    },
    // Compile credentials into a formData object for a post submission
    compileCredentials (myCredentials) {
      const credentialsForm = new FormData()
      credentialsForm.append('username', myCredentials.username)
      credentialsForm.append('password', myCredentials.password)
      return credentialsForm
    },
    // Compile a complaint into a formData object for a post submission
    compileComplaint (newComplaint) {
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
      return complaintForm
    },
    sendToDatabase (myCredentials, newComplaint) {
      const credentialsForm = this.compileCredentials(myCredentials)
      const complaintForm = this.compileComplaint(newComplaint)
      fetch('http://18.197.28.234:8000/get-token/', {
        mode: 'cors',
        body: credentialsForm,
        method: 'POST'
      }).then(response => response.json()) // Convert the token response into a JSON object
        .then(JSONresponse => JSON.stringify(JSONresponse.token)) // Select the token string from the object.
        .then(tokenString => 'Token ' + JSON.parse(tokenString)) // Remove string quotations and concatenate with authorization syntax
        .then(resp4 => {
          // alert(resp4) // (For debugging purposes) print out the token.
          fetch('http://18.197.28.234:8000/complaints/', {
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
