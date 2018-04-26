<template>
  <div>
    <template v-if="!(tokenExists)">
      <h2>{{$lang.SubmitAComplaintLang.logged_in_warn2}}</h2>
      <router-link to="Login">{{$lang.SubmitAComplaintLang.log_in_here}}</router-link>
    </template>
    <template v-if="(tokenExists)">
      <h2>{{$lang.SubmitAComplaintLang.logged_in_as}} {{ myCredentials.username }}</h2>
    </template>
    <md-field>
      <label>Category:</label>
      <md-select id="categoryBox" v-model="querySet.category">
        <md-option disabled value="">Select Category</md-option>
        <md-option v-for="category in categories" v-bind:key="category.key" v-bind:value="category.value">
          {{ category.value }}
        </md-option>
      </md-select>
    </md-field>
    <md-field>
      <label>Sub-Category:</label>
      <md-select id="subCategoryBox" v-model="querySet.sub_category">
        <md-option disabled value="">Select Sub-Category</md-option>
        <md-option v-for="sub_category in sub_categories" v-bind:key="sub_category.key"
                   v-bind:value="sub_category.value">
          {{ sub_category.value }}
        </md-option>
      </md-select>
    </md-field>
    <md-field>
      <label>Datetime Start: </label>
      <md-datepicker id="datetimeStartBox" v-model="querySet.startDatetime" :md-open-on-focus="false"/>
    </md-field>
    <md-field>
      <label>Datetime End: </label>
      <md-datepicker id="datetimeEndBox" v-model="querySet.endDatetime" :md-open-on-focus="false"/>
    </md-field>
    <md-field>
      <label>Location (Search by Address):</label>
      <md-input id="addressBox" v-model="querySet.location"></md-input>
      <span class="md-helper-text">e.g. Regnbuepladsen 7</span>
    </md-field>
    <md-field>
      <label>Range (meters):</label>
      <md-input id="rangeBox" v-model="querySet.range"></md-input>
      <span class="md-helper-text">e.g. 500</span>
    </md-field>
    <p>Latitude: {{coords.latitude}}</p>
    <p>Longitude: {{coords.longitude}}</p>
    <md-button class="md-raised" v-on:click="searchAddressOnMap(querySet.location)">{{$lang.SubmitAComplaintLang.search}}</md-button>
    <md-button class="md-raised" v-on:click="resetMarker()">{{$lang.SubmitAComplaintLang.reset}}</md-button>
    <leaflet-map id="myMap"
                 v-bind:newCoords="{latitude : coords.latitude, longitude : coords.longitude, range : querySet.range}"
                 v-on:coordsChanged="onDragMapCoords"></leaflet-map>
    <br />
    <md-button class="md-raised md-primary" v-on:click="onResetClicked()">Reset Filter</md-button>
    <md-button class="md-raised md-primary" v-on:click="allStuff()">Filtered Download</md-button>
    <md-button class="md-raised md-primary" v-on:click="downloadAll()">Download Everything</md-button>
    <p class="errorMsg" v-if="invalidCoords">Error: Please insure your coordinates are in Copenhagen and your range is greater than 0</p>
    <p class="errorMsg" v-if="invalidDate">You did not select date and time. Will not filter by time</p>
  </div>
</template>

<script>
/* eslint-disable */
  import {OpenStreetMapProvider} from 'leaflet-geosearch'
  import { dbInteract } from '../../src/mixins/dbInteract'
  import {cookies} from '../mixins/cookies'
  import LeafletMap from './LeafletMap.vue'

  export default {
    name: "DataSet",
    mixins: [dbInteract, cookies],
    components: {
      'leaflet-map': LeafletMap
    },
    data() {
      return {
        myCredentials: { // User credential data used for authentication and sending to the server
          username: 'anonymous',
          password: 'placeholder',
          token: ''
        },
        querySet: {
          category: '',
          sub_category: '',
          location: '',
          range: 0.0,
          startDatetime: null,
          endDatetime: null
        },
        coords: {
          latitude: 55.681078,
          longitude: 12.565966,
        },
        tokenExists: false, // Indicatees whether or not a credential cookie was found.
        mapInteracted: false,
        myJSONResponse: null,
        invalidCoords: false,
        invalidDate: false,
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
            value: 'N/A'
          },
          {
            key: 2,
            value: 'Loud Music/Party'
          },
          {
            key: 3,
            value: 'Loud Talking/Shouting'
          },
          {
            key: 4,
            value: 'Banging/Pounding'
          }]
      }
    },
    methods: {

      downloadAll () {
        function onPrepareClicked3 (parScope, onSucc) {
          // Reset form
          parScope.onResetClicked()
          // TODO Perform query here
          parScope.getData2(cookies.methods.getCookie('token'), '/complaints/', parScope, onSucc)
        }
        function doStuff3 (json, parScope) {
          parScope.onDownloadClicked2(json)
        }
        onPrepareClicked3(this, doStuff3)
      },
      allStuff () {
        function doStuff (callback, myQuery, parScope) {
          // parScope.searchAddress2(myQuery.location, parScope)
          //   .then(newCoords =>
            parScope.onPrepareClicked2(myQuery, parScope.coords, parScope, callback)
          // .then(returnCoords => callback(returnCoords, parScope))
        }
        function doStuff2 (json, parScope) {
          parScope.onDownloadClicked2(json)
        }
        var newQuery = this.querySet
        doStuff(doStuff2, newQuery, this)
      },

      onDragMapCoords: function (newCoords) {
        this.coords.latitude = newCoords.latCoord
        this.coords.longitude = newCoords.longCoord
        this.mapInteracted = true
      },

      async searchAddressOnMap (address) {
        const results = await this.provider.search({query: address})
        if (results !== undefined) {
          this.coords.latitude = results[0].y
          this.coords.longitude = results[0].x
        }
        // return {
        //   long: results[0].x,
        //   lat: results[0].y
        // }
      },
      // Update the latitude and longitude values on this vue object based off of the values passed in
      // Used specifically for the map object.
      resetMarker: function () {
        this.coords.latitude = 55.681078
        this.coords.longitude = 12.565966
      },
      async searchAddress2 (address, parScope) {
        // search
        // const address = document.getElementById('addressBox').value
        const results = await parScope.provider.search({query: address})
        if (results[0] !== undefined) {
          return {
            long: results[0].x,
            lat: results[0].y
          }
        } else {
          // alert('Couldn\'t find that address!')
          return {
            long: parScope.coords.longitude,
            lat: parScope.coords.latitude
          }
        }
      },
      // Turns provided address and range into lat/long pairs
      convertLocation2 (coords, range) {
        // TODO Pull this in from OpenStreetMaps
        // const coords = this.searchAddress(location)
        var longitude = coords.longitude
        var latitude = coords.latitude
        var degLatPerM = range / 111111 // Deviation in degrees
        var degLongPerM = range / (111111 * Math.cos(latitude)) // Deviation in degrees
        console.log(longitude)
        console.log(latitude)
        console.log(degLatPerM)
        console.log(degLongPerM)
        var locationArray = [+latitude - +degLatPerM, +latitude + +degLatPerM,
          +longitude - +degLongPerM, +longitude + +degLongPerM]

        console.log(locationArray)
        return locationArray
      },

      onPrepareClicked2 (myQuery, coords, parScope, onSucc) {
        console.log(coords)
        if (myQuery.range > 0 && coords.latitude > 55.65 && coords.latitude < 55.71 && coords.longitude < 12.66 && coords.longitude > 12.50) {
          parScope.invalidCoords = false
          var queryString = ''
          // Create an array with the 4 corner coordinates
          var locationArray = parScope.convertLocation2(coords, myQuery.range)
          if (myQuery.startDatetime !== null && myQuery.endDatetime !== null) {
            parScope.invalidDate = false
              // Add 1 to the month because it uses 0 based indexing
              const monthIndex1 = myQuery.startDatetime.getMonth() + 1
              const monthIndex2 = myQuery.endDatetime.getMonth() + 1
              // Compile the date strings
              var startDateTime = myQuery.startDatetime.getFullYear() + '-' +
                monthIndex1 + '-' +
                myQuery.startDatetime.getDate() + '+00:00:00'
              var endDateTime = myQuery.endDatetime.getFullYear() + '-' +
                monthIndex2 + '-' +
                myQuery.endDatetime.getDate() + '+23:59:59'
            // Compile the query string
            queryString = parScope.buildQuery(myQuery.category, myQuery.sub_category,
                locationArray[0], locationArray[1], locationArray[2], locationArray[3],
                startDateTime, endDateTime)

          } else {
            parScope.invalidDate = true
            // Compile the query string
            queryString = parScope.buildQuery(myQuery.category, myQuery.sub_category,
              locationArray[0], locationArray[1], locationArray[2], locationArray[3],
              '', '')
          }
          console.log(locationArray)

          // Reset form
          parScope.onResetClicked()
          // TODO Perform query here
          console.log(queryString)
          parScope.getData2(cookies.methods.getCookie('token'), queryString, parScope, onSucc)
        } else {
          parScope.invalidCoords = true
        }
      },
      getData2 (token, queryString, parScope) {
        fetch(parScope.$api + /* '/complaints/' */ queryString, {
          mode: 'cors',
          headers: {
            'Authorization': 'Token ' + JSON.parse(token)
          },
          method: 'GET'
        }).then(response => response.json()) // Convert the token response into a JSON object
          .then(JSONresponse => {
            console.log(parScope)
            parScope.onDownloadClicked2(JSONresponse, parScope)
            // parScope.myJSONResponse = JSONresponse
          }) // Select the token string from the object.
      },

      convertToCSV2 (objArray) {
        var array = typeof objArray !== 'object' ? JSON.parse(objArray) : objArray
        var str = ''

        for (var i = 0; i < array.length; i++) {
          var line = ''
          for (var index in array[i]) {
            if (line !== '') line += ','
            line += array[i][index]
          }

          str += line + '\r\n'
        }

        return str
      },
      exportCSVFile2 (headers, items, fileTitle, parScope) {
        console.log(parScope)
        if (headers) {
          items.unshift(headers)
        }

        // Convert Object to JSON
        var jsonObject = JSON.stringify(items)

        var csv = parScope.convertToCSV2(jsonObject)

        var exportedFilename = fileTitle + '.csv' || 'export.csv'

        var blob = new Blob([csv], {type: 'text/csv;charset=utf-8;'})
        if (navigator.msSaveBlob) { // IE 10+
          navigator.msSaveBlob(blob, exportedFilename)
        } else {
          var link = document.createElement('a')
          if (link.download !== undefined) { // feature detection
            // Browsers that support HTML5 download attribute
            var url = URL.createObjectURL(blob)
            link.setAttribute('href', url)
            link.setAttribute('download', exportedFilename)
            link.style.visibility = 'hidden'
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
          }
        }
      },
      // Query DB and download CSV
      onDownloadClicked2 (json, parScope) {
        // Take query, convert to CSV

        var fileTitle = 'data'

        var headers = {
          id: 'Complaint #',
          timestamp: 'Date/Time',
          owner: 'User',
          comments: 'Comments',
          category: 'Category',
          sub_category: 'Sub-Category',
          latitude: 'Latitude',
          longitude: 'Longitude',
          image: 'Image',
          audio: 'Audio'
        }

        this.exportCSVFile2(headers, json, fileTitle, parScope)
      },

      // Builds the string query
      buildQuery(category, sub_category, lat_low, lat_high, long_low, long_high, startDatetime, endDatetime) {
        if (category === 'Street Noise') {
          category = 'Street%20Noise'
        }
        if (category === 'Private Celebration') {
          category = 'Private%20Celebration'
        }
        if (sub_category === 'Loud Music/Party') {
          sub_category = 'Loud%20Music/Party'
        }
        if (sub_category === 'Loud Talking/Shouting') {
          sub_category = 'Loud%20Talking/Shouting'
        }
        var catString = "category=" + category
        var sub_catString = "&sub_category=" + sub_category
        if (category === '') {
          catString = ''
        }
        if (sub_category === '') {
          sub_catString = ''
        }
        var startDateString = "&timestamp_0=" + startDatetime
        var endDateString = "&timestamp_1=" + endDatetime
        if (startDatetime === '') {
          startDateString = ''
          endDateString = ''
        }
        if (endDatetime === '') {
          startDateString = ''
          endDateString = ''
        }
        var queryString = "/complaints/?" + catString + sub_catString +
          startDateString + endDateString +
          "&latitude_0=" + lat_low + "&latitude_1=" + lat_high + "&longitude_0=" + long_low + "&longitude_1=" + long_high
        return queryString
      },
      // Reset the form
      onResetClicked() {
        this.querySet.category = ""
        this.querySet.sub_category = ""
        this.querySet.location = ""
        this.querySet.range = 0.0
        this.querySet.startDatetime = null
        this.querySet.endDatetime = null
      },

      getCoords() {
        this.searchAddress(this.querySet.location)
      },
      // Search the given address using the provider defined (Google, OpenStreetmaps, etc.)
      async searchAddress(address) {
        // search
        // const address = document.getElementById('addressBox').value
        const results = await this.provider.search({query: address})
        this.coords.longitude = results[0].x
        this.coords.latitude = results[0].y
        // const coords = {
        //   longitude: results[0].x,
        //   latitude: results[0].y
        // }
      },
      // Turns provided address and range into lat/long pairs
      convertLocation(location, range) {
        // TODO Pull this in from OpenStreetMaps
        // const coords = this.searchAddress(location)
        var longitude = this.coords.longitude
        var latitude = this.coords.latitude
        var deg_lat_per_m = range / 111111 // Deviation in degrees
        var deg_long_per_m = range / (111111 * Math.cos(latitude)) // Deviation in degrees
        var locationArray = [+latitude - +deg_lat_per_m, +latitude + +deg_lat_per_m,
          +longitude - +deg_long_per_m, +longitude + +deg_long_per_m]
        console.log(locationArray)
        return locationArray
      },
      onPrepareClicked() {
        var startDateTime = this.querySet.startDatetime.getFullYear() + "-" +
          this.querySet.startDatetime.getMonth() + "-" +
          this.querySet.startDatetime.getDate() + "+00:00:00"
        var endDateTime = this.querySet.endDatetime.getFullYear() + "-" +
          this.querySet.endDatetime.getMonth() + "-" +
          this.querySet.endDatetime.getDate() + "+23:59:59"
        var locationArray = this.convertLocation(this.querySet.location, this.querySet.range)
        var queryString = this.buildQuery(this.querySet.category, this.querySet.sub_category,
          locationArray[0], locationArray[1], locationArray[2], locationArray[3],
          startDateTime, endDateTime)
        // Reset form
        this.onResetClicked()
        // TODO Perform query here
        var json = this.getData(cookies.methods.getCookie('token'), queryString, this)
        console.log(queryString)
      },
      convertToCSV(objArray) {
        var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
        var str = '';
        for (var i = 0; i < array.length; i++) {
          var line = '';
          for (var index in array[i]) {
            if (line != '') line += ','
            line += array[i][index];
          }
          str += line + '\r\n';
        }
        return str;
      },
      exportCSVFile(headers, items, fileTitle) {
        if (headers) {
          items.unshift(headers);
        }
        // Convert Object to JSON
        var jsonObject = JSON.stringify(items);
        var csv = this.convertToCSV(jsonObject);
        var exportedFilename = fileTitle + '.csv' || 'export.csv';
        var blob = new Blob([csv], {type: 'text/csv;charset=utf-8;'});
        if (navigator.msSaveBlob) { // IE 10+
          navigator.msSaveBlob(blob, exportedFilename);
        } else {
          var link = document.createElement("a");
          if (link.download !== undefined) { // feature detection
            // Browsers that support HTML5 download attribute
            var url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", exportedFilename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }
        }
      },
      // Query DB and download CSV
      onDownloadClicked(json) {
        // Take query, convert to CSV
        var fileTitle = 'data';
        var headers = {
          id: 'Complaint #',
          timestamp: "Date/Time",
          owner: "User",
          comments: "Comments",
          category: "Category",
          sub_category: "Sub-Category",
          latitude: "Latitude",
          longitude: "Longitude",
          image: "Image",
          audio: "Audio"
        };
        this.exportCSVFile(headers, json, fileTitle);
      },
      getData(token, queryString, parScope) {
        alert(token)
        fetch(this.$api + /*'/complaints/'*/ queryString, {
          mode: 'cors',
          headers: {
            'Authorization': 'Token ' + JSON.parse(token)
          },
          method: 'GET'
        }).then(response => response.json()) // Convert the token response into a JSON object
          .then(JSONresponse => {
            parScope.myJSONResponse = JSONresponse
          }) // Select the token string from the object.
      },
    },
    updated: function () {
      this.tokenExists = cookies.methods.checkForToken(this)
      if (this.tokenExists) {
        this.myCredentials.username = cookies.methods.getCookie('username')
        this.myCredentials.token = cookies.methods.getCookie('token')
      }
    },
    mounted: function () {
      // setup
      this.provider = new OpenStreetMapProvider()
      this.tokenExists = cookies.methods.checkForToken(this)
      if (this.tokenExists) {
        this.myCredentials.username = cookies.methods.getCookie('username')
        this.myCredentials.token = cookies.methods.getCookie('token')
      } else {
        var onSucc = function (token, parScope) {
          parScope.myCredentials.token = JSON.parse(token)
        }
        var onFail = function (token, parScope) {
          alert('Error: Could not validate user')
        }
        dbInteract.methods.postToGetToken(this.$api, this.myCredentials, onSucc, onFail, this, false)
      }

    }
  }
</script>

<style scoped>
  .errorMsg {
    color: red;
  }
</style>
