<template>
  <div>
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
      <label>Location (Search by Address):</label>
      <md-input id="addressBox" v-model="querySet.location"></md-input>
      <span class="md-helper-text">e.g. Regnbuepladsen 7</span>
    </md-field>
    <md-field>
      <label>Range (meters):</label>
      <md-input id="rangeBox" v-model="querySet.range"></md-input>
      <span class="md-helper-text">e.g. 500</span>
    </md-field>
    <md-field>
      <label>Datetime Start: </label>
      <md-datepicker id="datetimeStartBox" v-model="querySet.startDatetime" :md-open-on-focus="false"/>
    </md-field>
    <md-field>
      <label>Datetime End: </label>
      <md-datepicker id="datetimeEndBox" v-model="querySet.endDatetime" :md-open-on-focus="false"/>
    </md-field>
    <p>Lat: {{coords.latitude}}</p>
    <p>Long: {{coords.longitude}}</p>
    <md-button class="md-raised md-primary" v-on:click="getCoords()">Get Coords</md-button>
    <md-button class="md-raised md-primary" v-on:click="onResetClicked()">Reset</md-button>
    <md-button class="md-raised md-primary" v-on:click="onPrepareClicked()">Prepare Download</md-button>
    <md-button class="md-raised md-primary" v-on:click="onDownloadClicked(myJSONResponse)">Download CSV</md-button>
    <p>JSON: {{myJSONResponse}}</p>
  </div>
</template>

<script>
/* eslint-disable */
  import {OpenStreetMapProvider} from 'leaflet-geosearch'

  export default {
    name: "DataSet",
    data() {
      return {
        querySet: {
          category: '',
          sub_category: '',
          location: '',
          range: 0.0,
          startDatetime: null,
          endDatetime: null
        },
        coords: {
          latitude: 0.0,
          longitude: 0.0
        },
        myJSONResponse: null,
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

      // Builds the string query
      buildQuery(category, sub_category, lat_low, lat_high, long_low, long_high, startDatetime, endDatetime) {
        if (category === 'Street Noise') {
          category = 'Street%20Noise'
        }
        if (sub_category === 'Loud Music/Party') {
          sub_category = 'Loud%20Music/Party'
        }
        var queryString = "/complaints/?category=" + category + "&sub_category=" + sub_category +
          "&timestamp_0=" + startDatetime + "&timestamp_1=" + endDatetime +
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
        var json = this.getData(this.getCookie('token'), queryString, this)

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
      getCookie(cname) {
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
    mounted: function () {
      // setup
      this.provider = new OpenStreetMapProvider()
    }
  }
</script>

<style scoped>

</style>
