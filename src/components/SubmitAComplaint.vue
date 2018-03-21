<template>
    <div class="greetings">
        <h2>Submit A Complaint</h2>
        <form v-on:submit="submitComplaint(myCredentials, newComplaint)">
            <div>Username:</div>
            <input type="text" v-model="myCredentials.username" value="username">
            <div>Password:</div>
            <input type="text" v-model="myCredentials.password" value="password">
            <div>Comments:</div>
            <input type="text" v-model="newComplaint.comments" value="password">
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
            <!--&lt;!&ndash; Upload Images &ndash;&gt;-->
            <!--<form enctype="multipart/form-data" novalidate v-if="isInitial || isSaving">-->
                <!--<div class="dropbox">-->
                  <!--<span>Image</span>-->
                  <!--<input type="file" multiple :name="uploadFieldName" :disabled="isSaving" @change="filesChange($event.target.name, $event.target.files); fileCount = $event.target.files.length" accept="image/*" class="input-file">-->
                  <!--&lt;!&ndash;<p v-if="isInitial"> Drag your file(s) here to begin<br> or click to browse </p>&ndash;&gt;-->
                  <!--&lt;!&ndash;<p v-if="isSaving"> Uploading {{ fileCount }} files... </p>&ndash;&gt;-->
                <!--</div>-->
            <!--</form>-->
            <!--&lt;!&ndash; Upload Audio &ndash;&gt;-->
            <!--<form enctype="multipart/form-data" novalidate v-if="isInitial || isSaving">-->
                <!--<div class="dropbox">-->
                  <!--<span>Audio</span>-->
                  <!--<input type="file" multiple :name="uploadFieldName" :disabled="isSaving" @change="filesChange($event.target.name, $event.target.files); fileCount = $event.target.files.length" accept="audio/*" class="input-file">-->
                  <!--&lt;!&ndash;<p v-if="isInitial"> Drag your file(s) here to begin <br> or click to browse </p>&ndash;&gt;-->
                  <!--&lt;!&ndash;<p v-if="isSaving"> Uploading {{ fileCount }} files... </p>&ndash;&gt;-->
                <!--</div>-->
            <!--</form>-->
            <br />
            <button>Submit</button>
        </form>
    </div>
</template>

<script>
// const STATUS_INITIAL = 0, STATUS_SAVING = 1, STATUS_SUCCESS = 2, STATUS_FAILED = 3

export default {
  name: 'SubmitAComplaint',
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
    },
    comments: {
      type: String,
      default: 'no comments'
    }
  },
  data () {
    return {
      newComplaint: {},
      myCredentials: {}
      // uploadedFiles: [],
      // uploadError: null,
      // currentStatus: null,
      // uploadFieldName: 'photos'
    }
  },
  // computed: {
  //   isInitial () {
  //     return this.currentStatus === STATUS_INITIAL
  //   },
  //   isSaving () {
  //     return this.currentStatus === STATUS_SAVING
  //   },
  //   isSuccess () {
  //     return this.currentStatus === STATUS_SUCCESS
  //   },
  //   isFailed () {
  //     return this.currentStatus === STATUS_FAILED
  //   }
  // },
  methods: {
    submitComplaint: function (myCredentials, newComplaint) {
      const credentialsForm = new FormData()
      credentialsForm.append('username', myCredentials.username)
      credentialsForm.append('password', myCredentials.password)
      const complaintForm = new FormData()
      complaintForm.append('severity', newComplaint.severity)
      complaintForm.append('category', newComplaint.category)
      complaintForm.append('latitude', String(newComplaint.latitude))
      complaintForm.append('longitude', String(newComplaint.longitude))
      complaintForm.append('comments', newComplaint.comments)
      fetch('http://localhost:8000/get-token/', {
        // credentials: 'include',
        // cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        // credentials: 'same-origin', // include, same-origin, *omit
        mode: 'cors',
        body: credentialsForm,
        method: 'POST'
      }).then(response => response.json())
        .then(JSONresponse => JSON.stringify(JSONresponse.token))
        .then(resp3 => 'Token ' + JSON.parse(resp3))
        .then(resp4 => {
          alert(resp4)
          fetch('http://localhost:8000/complaints/', {
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
        }
        )
    }
    // reset () {
    //   // reset form to initial state
    //   this.currentStatus = STATUS_INITIAL
    //   this.uploadedFiles = []
    //   this.uploadError = null
    // },
    // save (formData) {
    //   // upload data to the server
    //   this.currentStatus = STATUS_SAVING
    //   upload(formData)
    //     .then(x => {
    //       this.uploadedFiles = [].concat(x)
    //       this.currentStatus = STATUS_SUCCESS
    //     })
    //     .catch(err => {
    //       this.uploadError = err.response
    //       this.currentStatus = STATUS_FAILED
    //     })
    // },
    // filesChange (fieldName, fileList) {
    //   // handle file changes
    //   const formData = new FormData()
    //   if (!fileList.length) return
    //   // append the files to FormData
    //   Array
    //     .from(Array(fileList.length).keys())
    //     .map(x => {
    //       formData.append(fieldName, fileList[x], fileList[x].name)
    //     })
    //   // save it
    //   this.save(formData)
    // }
  },
  // mounted () {
  //   this.reset()
  // },
  created: function () {

  }
}
</script>

<style scoped>

</style>
