<template>
  <div class="greetings">
    <h1>Submit A Complaint</h1>
    <form>
      <md-steppers v-bind:md-active-step="formSteps[formIndex]" md-linear>
        <md-step v-bind:id="formSteps[0]" v-on:click="formIndex=0" v-bind:md-description="formIndex[0]"
                 v-bind:md-label="formIndex[0]" v-bind:md-done="formIndex > 0">
          <template v-if="formIndex === 0">
            <!--<md-field>-->
            <!--<label>Username:</label>-->
            <!--<md-input v-model="myCredentials.username"></md-input>-->
            <!--</md-field>-->

            <!--<md-field>-->
            <!--<label>Password:</label>-->
            <!--<md-input type="password" v-model="myCredentials.password"></md-input>-->
            <!--</md-field>-->
            <h2>You must be logged in to submit a complaint.</h2>
            <router-link to="Login">You can log in here</router-link>
            <p>If your username does not appear below then you are not logged in</p>
            <h3>You are currently logged in as: {{ getCookie ('username') }}</h3>
          </template>
        </md-step>
        <md-step v-bind:id="formSteps[1]" v-on:click="formIndex=1" v-bind:md-label="formIndex[1]"
                 v-bind:md-done="newComplaint.category.length > 1">
          <template v-if="formIndex === 1">
            <md-field>
              <label>Category</label>
              <md-select v-model="newComplaint.category" name="category" id="category">
                <md-option disabled value="">Select Category</md-option>
                <md-option v-for="category in categories" v-bind:key="category.key" v-bind:value="category.value">
                  {{ category.value }}
                </md-option>
              </md-select>
            </md-field>
          </template>
        </md-step>
        <md-step v-bind:id="formSteps[2]" v-on:click="formIndex=2" v-bind:md-label="formIndex[2]"
                 v-bind:md-done="newComplaint.latitude !== 0.0 && newComplaint.longitude !== 0.0">
          <template v-if="formIndex === 2">
            <br/>
            <!--<md-field>-->
            <!--<label>Latitude:</label>-->
            <!--<md-input v-model="newComplaint.latitude"></md-input>-->
            <!--</md-field>-->
            <!--<md-field>-->
            <!--<label>Longitude:</label>-->
            <!--<md-input v-model="newComplaint.longitude"></md-input>-->
            <!--</md-field>-->
            <!--<md-button class="md-raised" v-on:click="getUserLocation(this)">Auto Detect My Location</md-button>-->
            <md-field>
              <label>Location (Search by Address):</label>
              <md-input id="addressBox"></md-input>
              <span class="md-helper-text">e.g. Regnbuepladsen 7</span>
            </md-field>
            <md-button class="md-raised" v-on:click="searchAddress(lookupAddress)">Search</md-button>
            <p id="locationDisplay">Please drag the arrow to your location.</p>
            <leaflet-map id="myMap"
                         v-bind:newCoords="{latitude : newComplaint.latitude, longitude : newComplaint.longitude}"
                         v-on:coordsChanged="onDragMapCoords"></leaflet-map>
          </template>
        </md-step>
        <md-step v-bind:id="formSteps[3]" v-on:click="formIndex=3" v-bind:md-label="formIndex[3]"
                 v-bind:md-done="formIndex > 3">
          <template v-if="formIndex === 3">
            <md-field>
              <label>Comments:</label>
              <md-textarea v-model="newComplaint.comments"></md-textarea>
            </md-field>
            <md-field>
              <label>Image</label>
              <md-file @change="onImageSelected" accept="image/*" placeholder="Upload image file..."/>
            </md-field>
            <md-field>
              <label>Audio</label>
              <md-file @change="onAudioSelected" accept="audio/*" placeholder="Upload audio file..."/>
            </md-field>
          </template>
        </md-step>
        <md-step v-bind:id="formSteps[4]" v-on:click="formIndex=4" v-bind:md-label="formIndex[4]">
          <template v-if="formIndex === endFormIndex && returnParty === 'Police'">
            <h3>Thank you</h3>
            <p>Your complaint has been submitted</p>
            <P>If you require immediate action, please call the police at 114.</P>
          </template>
          <template v-if="formIndex === endFormIndex && returnParty === 'Noise Guard'">
            <h3>Thank you</h3>
            <p>Thank you for your complaint, however we do not accept complaints related to:</p>
            <ul>
              <li>Musical noise from event (no restorations)</li>
              <li>Music noise from restaurants</li>
              <li>Music noise due to open doors / windows</li>
              <li>Noise from construction site (not Metro)</li>
              <li>Noise from facade renovation</li>
              <li>Noise from supply (construction site)</li>
              <li>Noise from Goods Delivery (Retail)</li>
              <li>Noise from ventilation or similar</li>
              <li>Noisy work outside allowed time (Construction site)...</li>
              <li>Other Noise Generations (No Construction Site)</li>
            </ul>

            <p>If you would like to submit a complaint about noise being generated by one of these sources, please visit
              the København Kommune’s noise complaint form via this link:
               <a href="https://www.kk.dk/støj">https://www.kk.dk/støj</a>
            </p>
            <p>If you would like to submit a complaint about noise generated by cafes, restaurants, events or other
              venues, please contact the Noise Unit or Noise Guard.</p>
            <p>Noise Unit: Man-Tors 9:00-15:00. Tel. 26 86 58 27</p>
            <p>Noise Guard: Tors 19:00-01:00, Fre-Lør 21:00-03:00. Tel. 33 66 25 85</p>
          </template>
        </md-step>
      </md-steppers>
      <br/>
      <div>
        <template v-if="formIndex > 0 && formIndex < endFormIndex">
          <md-button class="md-raised md-primary" v-on:click="backButtonPressed()">Back</md-button>
        </template>
        <template v-if="formIndex < endFormIndex - 1 && (getCookie('username')).length > 0">
          <md-button class="md-raised md-primary" v-on:click="nextButtonPressed()">Next</md-button>
        </template>
        <template v-if="formIndex === endFormIndex - 1">
          <md-button class="md-raised md-primary" v-on:click="submitComplaint(myCredentials, newComplaint)">Submit
          </md-button>
        </template>
      </div>
    </form>
  </div>
</template>

<script>
// imports
import LeafletMap from './LeafletMap.vue'
import {OpenStreetMapProvider} from 'leaflet-geosearch'

export default {
  name: 'SubmitAComplaint',
  props: {},
  components: {
    'leaflet-map': LeafletMap
  },
  data () {
    return {
      newComplaint: {
        username: '',
        password: '',
        category: '',
        severity: '',
        latitude: 0.0,
        longitude: 0.0,
        comments: '',
        imageUP: null,
        audioUP: null
      },
      returnParty: 'Police',
      lookupAddress: '',
      provider: null,
      formIndex: 0,
      endFormIndex: 4,
      myCredentials: {
        username: '',
        password: ''
      },
      imageUpload: null,
      audioUpload: null,
      formSteps: ['login', 'category', 'location', 'submit', 'done'],
      categories: [
        {
          key: 1,
          value: 'Street Noise'
        },
        {
          key: 2,
          value: 'Private Celebration'
        },
        {
          key: 3,
          value: 'Bar/Restaurant'
        },
        {
          key: 4,
          value: 'Construction'
        }],
      noiseGuardCategories: ['Bar/Restaurant', 'Construction']
    }
  },
  methods: {
    // Search the given address using the provider defined (Google, OpenStreetmaps, etc.)
    async searchAddress () {
      // search
      const address = document.getElementById('addressBox').value
      const results = await this.provider.search({query: address})
      this.newComplaint.longitude = results[0].x
      this.newComplaint.latitude = results[0].y
    },
    // If the category is dealt with by the noise guard, returns true, else returns false
    isNoiseGuard (category) {
      var ngc = this.noiseGuardCategories
      for (var i = 0; i < ngc.length; i++) {
        if (category === ngc[i]) {
          return true
        }
      }
      return false
    },
    // Function that runs after the next button is pressed when a noise guard item is selected
    onNoiseGuardSelected () {
      if (this.isNoiseGuard(this.newComplaint.category)) {
        this.returnParty = 'Noise Guard'
      } else {
        this.returnParty = 'Police'
      }
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
        this.onNoiseGuardSelected()
        if (this.returnParty === 'Noise Guard') {
          this.formIndex = 4
        } else {
          this.formIndex = this.formIndex + 1
        }
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
      // const credentialsForm = this.compileCredentials(myCredentials)
      const complaintForm = this.compileComplaint(newComplaint)
      // fetch(this.$api + '/get-token/', {
      //   mode: 'cors',
      //   body: credentialsForm,
      //   method: 'POST'
      // }).then(response => response.json()) // Convert the token response into a JSON object
      //   .then(JSONresponse => JSON.stringify(JSONresponse.token)) // Select the token string from the object.
      //   .then(tokenString => 'Token ' + JSON.parse(tokenString)) // Remove string quotations and concatenate with authorization syntax
      //   .then(resp4 => {
      // alert(resp4) // (For debugging purposes) print out the token.
      var myAuth = 'Token ' + JSON.parse(this.getCookie('token'))
      fetch(this.$api + '/complaints/', {
        mode: 'cors',
        headers: {
          'Authorization': myAuth
        },
        body: complaintForm,
        method: 'POST'
      }).then(this.handleErrors)
        .then(response => {
          console.log('Complaint Success')
        })
        .catch(error => {
          console.log(error)
        })
      // })
    },
    handleErrors (response) {
      if (!response.ok) {
        throw Error(response.statusText)
      }
      return response
    },
    getCookie (cname) {
      var name = cname + '='
      var decodedCookie = decodeURIComponent(document.cookie)
      var ca = decodedCookie.split(';')
      for (var i = 0; i < ca.length; i++) {
        var c = ca[i]
        while (c.charAt(0) === ' ') {
          c = c.substring(1)
        }
        if (c.indexOf(name) === 0) {
          console.log(c.substring(name.length, c.length))
          return c.substring(name.length, c.length)
        }
      }
      return ''
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
  .md-steppers-navigation {
    box-shadow: none!important;
  }
</style>
