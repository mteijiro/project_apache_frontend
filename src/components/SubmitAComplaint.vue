<template>
  <div class="greetings">
    <h1>Submit A Complaint</h1>
    <md-steppers v-bind:md-active-step="formSteps[formIndex]" md-linear>
      <md-step v-bind:id="formSteps[0]" v-on:click="formIndex=0" v-bind:md-description="formIndex[0]"
               v-bind:md-label="formIndex[0]" v-bind:md-done="myCredentials.token.length > 0">
        <!--<template v-if="formIndex === 0">-->
          <template v-if="!checkForToken()">
            <h2>You must be logged in to submit a complaint.</h2>
            <router-link to="Login">You can log in here</router-link>
          </template>
          <template v-if="checkForToken()">
            <h2>You are currently logged in as: {{ getCookie ('username') }}</h2>
            <span style="text-align: center;">Press next to continue</span>
          </template>
        <!--</template>-->
      </md-step>
      <md-step v-bind:id="formSteps[1]" v-on:click="formIndex=1" v-bind:md-label="formIndex[1]"
               v-bind:md-done="newComplaint.category.length > 1">
        <!--<template v-if="formIndex === 1">-->
          <h2 align="left"><u>Category</u></h2>
          <md-field>
            <label>Category</label>
            <md-select v-model="newComplaint.category" name="category" id="category">
              <md-option disabled value="">Select Category</md-option>
              <md-option v-for="category in categories" v-bind:key="category.key" v-bind:value="category.value">
                {{ category.value }}
              </md-option>
            </md-select>
          </md-field>
          <h2 align="left"><u>Sub Category</u></h2>
          <md-field>
            <label>Sub-category</label>
            <md-select v-model="newComplaint.sub_category" name="category" id="category">
              <md-option disabled value="">Select Noise Type</md-option>
              <md-option v-for="sub_category in sub_categories" v-bind:key="sub_category.key" v-bind:value="sub_category.value">
                {{ sub_category.value }}
              </md-option>
            </md-select>
          </md-field>
        <!--</template>-->
      </md-step>
      <md-step v-bind:id="formSteps[2]" v-on:click="formIndex=2" v-bind:md-label="formIndex[2]"
               v-bind:md-done="mapInteracted === true">
        <!--<template v-if="formIndex === 2">-->
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
          <md-button class="md-raised" v-on:click="resetMarker()">Reset</md-button>
          <br/>
          <span style="text-align: center;" id="locationDisplay">Please drag the arrow to your location.</span>
          <leaflet-map id="myMap"
                       v-bind:newCoords="{latitude : newComplaint.latitude, longitude : newComplaint.longitude}"
                       v-on:coordsChanged="onDragMapCoords"></leaflet-map>
        <!--</template>-->
      </md-step>
      <md-step v-bind:id="formSteps[3]" v-on:click="formIndex=3" v-bind:md-label="formIndex[3]"
               v-bind:md-done="formIndex > 3">
        <!--<template v-if="formIndex === 3">-->
          <md-field>
            <label>Comments:</label>
            <md-textarea v-model="newComplaint.comments"></md-textarea>
          </md-field>
          <!--<md-field>-->
            <!--<label>Image</label>-->
            <!--<md-file @change="onImageSelected" accept="image/*" placeholder="Upload image file..."/>-->
          <!--</md-field>-->
          <!--<md-field>-->
            <!--<label>Audio</label>-->
            <!--<md-file @change="onAudioSelected" accept="audio/*" placeholder="Upload audio file..."/>-->
          <!--</md-field>-->
        <!--</template>-->
      </md-step>
      <md-step v-bind:id="formSteps[4]" v-on:click="formIndex=4" v-bind:md-label="formIndex[4]">
        <template v-if="formIndex === endFormIndex && returnParty === 'Police'">
          <h2>Thank you</h2>
          <p>Your complaint has been submitted</p>
          <P>If you require immediate action, please call the police at 114.</P>
        </template>
        <template v-if="formIndex === endFormIndex && returnParty === 'Noise Guard'">
          <template v-if="formIndex === endFormIndex && returnParty === 'Noise Guard'">
            <h2>Please contact another authority!</h2>
            <p>We are currently only accepting complaints from the following categories:</p>
            <ul id="NGlist">
              <li>Street Noise</li>
              <li>Private Celebrations</li>
            </ul>

            <p>If you would like to submit a complaint about anything else, please visit the København Kommune’s noise
              complaint form via this link:
              <a href="https://www.kk.dk/støj">https://www.kk.dk/støj</a>
            </p>
            <p>If you would like to submit a complaint about noise generated by cafes, restaurants,
              events or other venues, please contact the Noise Unit during the day or the Noise Guard at night.</p>
            <p>Noise Unit: Man-Tors 9:00-15:00. Tel. 26 86 58 27</p>
            <p>Noise Guard: Tors 19:00-01:00, Fre-Lør 21:00-03:00. Tel. 33 66 25 85</p>
          </template>

        </template>
      </md-step>
    </md-steppers>
    <br/>
    <div>
      <template v-if="formIndex > 0 && formIndex < endFormIndex">
        <md-button class="md-raised md-primary" v-on:click="backButtonPressed()">Back</md-button>
      </template>
      <template v-if="formIndex < endFormIndex - 1 && (getCookie('username')).length > 0">
        <md-button id="nextButton" class="md-raised md-primary" v-on:click="nextButtonPressed()">Next</md-button>
      </template>
      <template v-if="formIndex === endFormIndex - 1">
        <md-button class="md-raised md-primary" v-on:click="submitComplaint(myCredentials, newComplaint)">Submit
        </md-button>
        <template v-if="this.invalidComplaint">
          <h2 class="err">Invalid Complaint</h2>
          <p class="err">Please insure that your complaint has a category, subcategory, and location selected before submitting</p>
        </template>

      </template>
    </div>
  </div>
</template>

<script>
// imports
import LeafletMap from './LeafletMap.vue'
import {OpenStreetMapProvider} from 'leaflet-geosearch'
import { dbInteract } from '../../src/mixins/dbInteract'

export default {
  name: 'SubmitAComplaint',
  props: {},
  mixins: [dbInteract],
  components: {
    'leaflet-map': LeafletMap
  },
  data () {
    return {
      newComplaint: {
        username: '',
        password: '',
        category: '',
        sub_category: '',
        latitude: 55.681078,
        longitude: 12.565966,
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
        password: '',
        token: ''
      },
      mapInteracted: false,
      imageUpload: null,
      audioUpload: null,
      invalidComplaint: false,
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
      sub_categories: [
        {
          key: 1,
          value: 'Loud Music/Party'
        },
        {
          key: 2,
          value: 'Loud Talking/Shouting'
        },
        {
          key: 3,
          value: 'Banging/Pounding'
        }
      ],
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
      this.mapInteracted = true
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
          me.mapInteracted = true
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
        if (this.returnParty === 'Noise Guard' && this.formIndex >= 1) {
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
      this.mapInteracted = true
    },
    // Update the latitude and longitude values on this vue object based off of the values passed in
    // Used specifically for the map object.
    resetMarker: function () {
      this.newComplaint.latitude = 55.681078
      this.newComplaint.longitude = 12.565966
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
        if (this.checkComplaint(newComplaint)) {
          this.invalidComplaint = false
          this.sendToDatabase(myCredentials, newComplaint)
          this.formIndex = this.formIndex + 1
        } else {
          this.invalidComplaint = true
        }
      }
    },
    checkComplaint (myComplaint) {
      if (myComplaint.category.length > 0 && myComplaint.sub_category.length > 0 && myComplaint.latitude > 55.65 && myComplaint.latitude < 55.71 && myComplaint.longitude < 12.66 && myComplaint.longitude > 12.50) {
        return true
      } else {
        return false
      }
    },
    sendToDatabase (myCredentials, newComplaint) {
      const onSucc = function (response, parScope) {
        console.log('Complaint Success')
      }
      const onFail = function (error, parScope) {
        console.log(error)
      }
      dbInteract.methods.postToComplaints(this.$api, newComplaint, onSucc, onFail, this)
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
    },
    checkForToken () {
      // this.getCookie('username')
      this.myCredentials.token = this.getCookie('token')
      if (this.myCredentials.token.length > 0) {
        return true
      } else {
        return false
      }
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
  #NGlist {
    margin-left: 0;
  }
  .err {
    color:darkred;
  }
</style>
