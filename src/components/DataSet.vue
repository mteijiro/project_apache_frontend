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

    <md-button class="md-raised md-primary" v-on:click="onResetClicked()">Reset</md-button>
    <md-button class="md-raised md-primary" v-on:click="onDownloadClicked()">Download CSV</md-button>
  </div>
</template>

<script>
/* eslint-disable */
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
      // Turns provided address and range into lat/long pairs
      convertLocation(location, range) {

        // TODO Pull this in from OpenStreetMaps
        var longitude = 0.0
        var latitude = 0.0

        var m_per_deg_lat = 111132.92 -
          (559.822 * Math.cos( 2 * latMid )) +
          (1.175 * Math.cos( 4 * latMid )) -
          (0.0023 * Math.cos( 6 * latMid ))
        var m_per_deg_lon = 111412.84 * Math.cos( latMid ) -
          93.5 * Math.cos( 3 * longMid ) +
          118 * Math.cos( 5 * longMid )

        var deg_lat_per_m = range / 111111 // Deviation in degrees
        var deg_long_per_m = range / (111111 * Math.cos(latitude)) // Deviation in degrees

        var locationArray = [latitude - deg_lat_per_m, latitude + deg_lat_per_m,
          longitude - deg_long_per_m, longitude + deg_long_per_m]

        return locationArray
      },

      // Builds the string query
      buildQuery(category, sub_category, lat_low, lat_high, long_low, long_high, startDatetime, endDatetime) {
        var queryString = "/complaints/?category=" + category + "&sub_category=" + sub_category +
          "&timestamp_0=" + startDatetime + "&timestamp_1=" + endDatetime +
          "latitude_0=" + lat_low + "&latitude_1=" + lat_high + "&longitude_0=" + long_low + "&longitude_1=" + long_high

        return queryString
      },

      // Converts query's returned JSON to CSV
      jsonToCSV(json) {
        const items = json.items
        const replacer = (key, value) => value === null ? '' : value // specify how you want to handle null values here
        const header = Object.keys(items[0])
        let csv = items.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','))
        csv.unshift(header.join(','))
        csv = csv.join('\r\n')

        return csv
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

      // Query DB and download CSV
      onDownloadClicked() {

        var startDateTime = this.querySet.startDatetime.getFullYear() + "-" +
          this.querySet.startDatetime.getMonth() + "-" +
          this.querySet.startDatetime.getDate() + "+00:00:00"
        var endDateTime = this.querySet.endDatetime.getFullYear() + "-" +
          this.querySet.endDatetime.getMonth() + "-" +
          this.querySet.endDatetime.getDate() + "+23:59:59"

        var locationArray = convertLocation(this.querySet.location, this.querySet.range)

        var queryString = buildQuery(this.querySet.category, this.querySet.sub_category,
          locationArray[0], locationArray[1], locationArray[2], locationArray[3],
          startDateTime, endDateTime)

        // Reset form
        onResetClicked()

        // TODO Perform query here
        var json

        // Take query, convert to CSV
        var csv = jsonToCSV(json)

        // Return CSV
        var encodedUri = encodeURI(csv)
        var link = document.createElement("a")
        link.setAttribute("href", encodedUri)
        link.setAttribute("download", "customers.csv")
        document.body.appendChild(link) // Required for FF
        link.click()
        document.body.removeChild(link)
      }
    }
  }
</script>

<style scoped>

</style>
