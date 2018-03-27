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
          <div>Severity: {{ newComplaint.severity }}</div>
          <select v-model="newComplaint.severity">
            <option disabled value="">Select Severity</option>
            <option v-for="severityRating in severityRatings" v-bind:key="severityRating.key">
              {{ severityRating.value }}</option>
          </select>
          <div>Category: {{ newComplaint.category }}</div>
          <select v-model="newComplaint.category">
            <option disabled value="">Define Category</option>
            <option v-for="category in categories" v-bind:key="category.key">
              {{ category.value }}</option>
          </select>
          <br />
          <span>Location</span>
          <input type="text" v-model="newComplaint.latitude" value="latitude">
          <input type="text" v-model="newComplaint.longitude" value="longitude">
          <br />
          <br />
          <span>Image</span>
          <input type="file" @change="onImageSelected" accept="image/*">
          <br />
          <span>Audio</span>
          <input type="file" @change="onAudioSelected" accept="audio/*">
          <br />
          <button>Submit</button>
        </form>
    </div>
</template>

<script>

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
      complaintForm.append('image', newComplaint.imageUP, newComplaint.imageUP.name)
      complaintForm.append('audio', newComplaint.audioUP, newComplaint.audioUP.name)
      fetch('http://localhost:8000/get-token/', {
        mode: 'cors',
        body: credentialsForm,
        method: 'POST'
      }).then(response => response.json()) // Convert the token response into a JSON object
        .then(JSONresponse => JSON.stringify(JSONresponse.token)) // Select the token string from the object.
        .then(tokenString => 'Token ' + JSON.parse(tokenString)) // Remove string quotations and concatenate with authorization syntax
        .then(resp4 => {
          alert(resp4) // (For debugging purposes) print out the token.
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
