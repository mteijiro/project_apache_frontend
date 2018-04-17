<template>
  <div class="greetings">
    <h1>{{$lang.SubmitAComplaintLang.submit_a_complaint}}</h1>
    <md-steppers v-bind:md-active-step="formSteps[formIndex]" md-linear>
      <md-step v-bind:id="formSteps[0]" v-on:click="formIndex=0" v-bind:md-description="formIndex[0]"
               v-bind:md-label="formIndex[0]" v-bind:md-done="myCredentials.token.length > 0">
        <!--<template v-if="formIndex === 0">-->
          <template v-if="!checkForToken()">
            <h2>{{$lang.SubmitAComplaintLang.logged_in_warn}}</h2>
            <router-link to="Login">{{$lang.SubmitAComplaintLang.log_in_here}}</router-link>
          </template>
          <template v-if="checkForToken()">
            <h2>{{$lang.SubmitAComplaintLang.logged_in_as}} {{ getCookie ('username') }}</h2>
            <span style="text-align: center;">{{$lang.SubmitAComplaintLang.press_next}}</span>
          </template>
        <!--</template>-->
      </md-step>
      <md-step v-bind:id="formSteps[1]" v-on:click="formIndex=1" v-bind:md-label="formIndex[1]"
               v-bind:md-done="newComplaint.category.length > 1">
        <!--<template v-if="formIndex === 1">-->
          <h2 align="left"><u>{{$lang.SubmitAComplaintLang.category}}</u></h2>
          <md-field>
            <label>{{$lang.SubmitAComplaintLang.category}}</label>
            <md-select v-model="newComplaint.category" name="category" id="category">
              <md-option disabled value="">{{$lang.SubmitAComplaintLang.select_category}}</md-option>
              <md-option v-for="category in categories" v-bind:key="category.key" v-bind:value="category.value">
                {{ category.visible }}
              </md-option>
            </md-select>
          </md-field>
          <h2 align="left"><u>{{$lang.SubmitAComplaintLang.sub_category}}</u></h2>
          <md-field>
            <label>{{$lang.SubmitAComplaintLang.sub_category}}</label>
            <md-select v-model="newComplaint.sub_category" name="category" id="category">
              <md-option disabled value="">{{$lang.SubmitAComplaintLang.select_noise}}</md-option>
              <md-option v-for="sub_category in sub_categories" v-bind:key="sub_category.key" v-bind:value="sub_category.value">
                {{ sub_category.visible }}
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
            <label>{{$lang.SubmitAComplaintLang.location_address}}</label>
            <md-input id="addressBox"></md-input>
            <span class="md-helper-text">e.g. Regnbuepladsen 7</span>
          </md-field>
          <md-button class="md-raised" v-on:click="searchAddress(lookupAddress)">{{$lang.SubmitAComplaintLang.search}}</md-button>
          <md-button class="md-raised" v-on:click="resetMarker()">{{$lang.SubmitAComplaintLang.reset}}</md-button>
          <br/>
          <span style="text-align: center;" id="locationDisplay">{{$lang.SubmitAComplaintLang.drag_pin}}</span>
          <leaflet-map id="myMap"
                       v-bind:newCoords="{latitude : newComplaint.latitude, longitude : newComplaint.longitude}"
                       v-on:coordsChanged="onDragMapCoords"></leaflet-map>
        <!--</template>-->
      </md-step>
      <md-step v-bind:id="formSteps[3]" v-on:click="formIndex=3" v-bind:md-label="formIndex[3]"
               v-bind:md-done="formIndex > 3">
        <!--<template v-if="formIndex === 3">-->
          <md-field>
            <label>{{$lang.SubmitAComplaintLang.comments}}</label>
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
          <h2>{{$lang.SubmitAComplaintLang.thank_you}}</h2>
          <p>{{$lang.SubmitAComplaintLang.complaint_submitted}}</p>
          <P>{{$lang.SubmitAComplaintLang.immediate_action}}</P>
        </template>
        <template v-if="formIndex === endFormIndex && returnParty === 'Noise Guard'">
          <template v-if="formIndex === endFormIndex && returnParty === 'Noise Guard'">
            <h2>{{$lang.SubmitAComplaintLang.redirect_heading}}</h2>
            <p>{{$lang.SubmitAComplaintLang.only_accepting_for}}</p>
            <ul id="NGlist">
              <li>{{$lang.SubmitAComplaintLang.street_noise}}</li>
              <li>{{$lang.SubmitAComplaintLang.private_celebrations}}</li>
            </ul>

            <p>{{$lang.SubmitAComplaintLang.kkdkredirect}}
              <a target="_blank" href="https://www.kk.dk/støj">https://www.kk.dk/støj</a>
            </p>
            <p>{{$lang.SubmitAComplaintLang.noise_authority_redirect}}</p>
            <p>{{$lang.SubmitAComplaintLang.noise_unit_hours}}</p>
            <p>{{$lang.SubmitAComplaintLang.noise_guard_hours}}</p>
          </template>

        </template>
      </md-step>
    </md-steppers>
    <br/>
    <div>
      <template v-if="formIndex > 0 && formIndex < endFormIndex">
        <md-button class="md-raised md-primary" v-on:click="backButtonPressed()">{{$lang.SubmitAComplaintLang.back}}</md-button>
      </template>
      <template v-if="formIndex < endFormIndex - 1 && (getCookie('username')).length > 0">
        <md-button id="nextButton" class="md-raised md-primary" v-on:click="nextButtonPressed()">{{$lang.SubmitAComplaintLang.next}}</md-button>
      </template>
      <template v-if="formIndex === endFormIndex - 1">
        <md-button class="md-raised md-primary" v-on:click="submitComplaint(myCredentials, newComplaint)">{{$lang.SubmitAComplaintLang.submit}}
        </md-button>
        <template v-if="this.invalidComplaint">
          <h2 class="err">{{$lang.SubmitAComplaintLang.invalid_complaint}}</h2>
          <p class="err">{{$lang.SubmitAComplaintLang.invalid_complaint_desc}}</p>
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
          visible: this.$lang.SubmitAComplaintLang.street_noise,
          value: 'Street Noise'
        },
        {
          key: 2,
          visible: this.$lang.SubmitAComplaintLang.private_celebration,
          value: 'Private Celebration'
        },
        {
          key: 3,
          visible: this.$lang.SubmitAComplaintLang.bar_restaurant,
          value: 'Bar/Restaurant'
        },
        {
          key: 4,
          visible: this.$lang.SubmitAComplaintLang.construction,
          value: 'Construction'
        }],
      sub_categories: [
        {
          key: 1,
          visible: this.$lang.SubmitAComplaintLang.loud_music_party,
          value: 'Loud Music/Party'
        },
        {
          key: 2,
          visible: this.$lang.SubmitAComplaintLang.loud_talking_shouting,
          value: 'Loud Talking/Shouting'
        },
        {
          key: 3,
          visible: this.$lang.SubmitAComplaintLang.banging_pounding,
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
    },
    // Refresh the toolbar header names on the toolbar to reflect the detected language
    refreshCategoryNames () {
      this.categories[1].visible = this.$lang.SubmitAComplaint.street_noise
      this.categories[2].visible = this.$lang.SubmitAComplaint.private_celebration
      this.categories[3].visible = this.$lang.SubmitAComplaint.bar_restaurant
      this.categories[4].visible = this.$lang.SubmitAComplaint.construction
      this.sub_categories[1].visible = this.$lang.SubmitAComplaint.loud_music_party
      this.sub_categories[2].visible = this.$lang.SubmitAComplaint.loud_talking_shouting
      this.sub_categories[3].visible = this.$lang.SubmitAComplaint.banging_pounding
    }
  },
  created: function () {
  },
  beforeMount: function () {
    this.refreshCategoryNames()
  },
  mounted: function () {
    // setup
    this.provider = new OpenStreetMapProvider()
    this.refreshCategoryNames()
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
