<template>
    <div class="greetings">
        <h2>Submit A Complaint</h2>
        <form v-on:submit="submitComplaint">
            <div>Username:</div>
            <input type="text" v-model="myCredentials.username" value="username">
            <div>Password:</div>
            <input type="text" v-model="myCredentials.password" value="password">
            <div>Severity: {{ newComplaint.severity }}</div><select v-model="newComplaint.severity">
                <option disabled value="">Select Severity</option>
                <option>1</option>
                <option>2</option>
                <option>3</option>
                <option>4</option>
                <option>5</option>
                <option>6</option>
                <option>7</option>
                <option>8</option>
                <option>9</option>
                <option>10</option>
            </select>
            <div>Category: {{ newComplaint.category }}</div>
            <select v-model="newComplaint.category">
                <option disabled value="">Define Category</option>
                <option>Street Noise</option>
                <option>Automobile</option>
                <option>Business Noise</option>
            </select>
            <br />
            <span>Location</span>
            <input type="text" v-model="newComplaint.latitude" value="latitude">
            <input type="text" v-model="newComplaint.longitude" value="longitude">
            <br />
            <br />
            <!-- Upload Images -->
            <form enctype="multipart/form-data" novalidate v-if="isInitial || isSaving">
                <div class="dropbox">
                  <span>Image</span>
                  <input type="file" multiple :name="uploadFieldName" :disabled="isSaving" @change="filesChange($event.target.name, $event.target.files); fileCount = $event.target.files.length" accept="image/*" class="input-file">
                  <!--<p v-if="isInitial"> Drag your file(s) here to begin<br> or click to browse </p>-->
                  <!--<p v-if="isSaving"> Uploading {{ fileCount }} files... </p>-->
                </div>
            </form>
            <!-- Upload Audio -->
            <form enctype="multipart/form-data" novalidate v-if="isInitial || isSaving">
                <div class="dropbox">
                  <span>Audio</span>
                  <input type="file" multiple :name="uploadFieldName" :disabled="isSaving" @change="filesChange($event.target.name, $event.target.files); fileCount = $event.target.files.length" accept="audio/*" class="input-file">
                  <!--<p v-if="isInitial"> Drag your file(s) here to begin <br> or click to browse </p>-->
                  <!--<p v-if="isSaving"> Uploading {{ fileCount }} files... </p>-->
                </div>
            </form>
            <br />
            <button v-on:click="submitComplaint(newComplaint)">Submit</button>
        </form>
    </div>
</template>

<script>
const STATUS_INITIAL = 0, STATUS_SAVING = 1, STATUS_SUCCESS = 2, STATUS_FAILED = 3

export default {
  name: 'greetings-page.vue',
  props: {
    username: {
      type: String,
      default: 'mteijiro'
    },
    password: {
      type: String,
      default: 'Temp12345'
    },
    category: {
      type: String,
      default: 'People'
    },
    severity: {
      type: String,
      default: 'Low'
    },
    latitude: {
      type: String,
      default: '0.0'
    },
    longitude: {
      type: String,
      default: '0.0'
    }
  },
  data () {
    return {
      newComplaint: {},
      myCredentials: {},
      uploadedFiles: [],
      uploadError: null,
      currentStatus: null,
      uploadFieldName: 'photos'
    }
  },
  computed: {
    isInitial () {
      return this.currentStatus === STATUS_INITIAL
    },
    isSaving () {
      return this.currentStatus === STATUS_SAVING
    },
    isSuccess () {
      return this.currentStatus === STATUS_SUCCESS
    },
    isFailed () {
      return this.currentStatus === STATUS_FAILED
    }
  },
  methods: {
    submitComplaint: function (myCredentials, newComplaint) {
      var response = fetch('http://localhost:8000/get-token/', {
        body: JSON.stringify(myCredentials),
        method: 'POST'
      }).then(response => response.json())
      // console.log(JSON.stringify(newComplaint));
      // alert(JSON.stringify(newComplaint));
      fetch('http://localhost:8000/complaints/', {
        body: JSON.stringify(newComplaint),
        headers: response,
        method: 'POST'
      })
        .then(() => {
          alert('Your complaint has been submitted!')
        })
    },
    reset () {
      // reset form to initial state
      this.currentStatus = STATUS_INITIAL
      this.uploadedFiles = []
      this.uploadError = null
    },
    save (formData) {
      // upload data to the server
      this.currentStatus = STATUS_SAVING
      upload(formData)
        .then(x => {
          this.uploadedFiles = [].concat(x)
          this.currentStatus = STATUS_SUCCESS
        })
        .catch(err => {
          this.uploadError = err.response
          this.currentStatus = STATUS_FAILED
        })
    },
    filesChange (fieldName, fileList) {
      // handle file changes
      const formData = new FormData()
      if (!fileList.length) return
      // append the files to FormData
      Array
        .from(Array(fileList.length).keys())
        .map(x => {
          formData.append(fieldName, fileList[x], fileList[x].name)
        })
      // save it
      this.save(formData)
    }
  },
  mounted () {
    this.reset()
  },
  created: function () {

  }
}
</script>

<style scoped>

</style>
