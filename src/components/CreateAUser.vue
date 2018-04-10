<template>
  <div>
    <h1>Register</h1>
    <form>
      <md-field>
        <label>Username:</label>
        <md-input type="text" v-model="myCredentials.username"></md-input>
      </md-field>
      <md-field>
        <label>Password:</label>
        <md-input type="password" v-model="myCredentials.password"></md-input>
      </md-field>
      <md-field>
      <label>Confirm Password:</label>
      <md-input type="password" v-model="myCredentials.confirmPassword"></md-input>
      <span v-if="myCredentials.password !== myCredentials.confirmPassword"
            style="color: darkred; margin-right: 35px; margin-top: 5px;">Passwords do not match</span>
      </md-field>
      <md-field>
      <label>First Name:</label>
      <md-input type="text" v-model="myCredentials.firstName"></md-input>
      </md-field>
      <md-field>
      <label>Last Name:</label>
      <md-input type="text" v-model="myCredentials.lastName"></md-input>
      </md-field>
      <md-button class="md-raised md-primary" type="button" value="submit" v-on:click="createUser(myCredentials)">Create</md-button>
      <p class="err" v-if="invalidCreation">{{ errorMessage }}. The username may be taken. Please try again with a different username or at a later date</p>
      <p class="err" v-if="invalidToken">Error: invalid token</p>
    </form>
  </div>
</template>

<script>
export default {
  name: 'CreateAUser',
  data () {
    return {
      myCredentials: {
        username: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: ''
      },
      errorMessage: '',
      invalidToken: false,
      invalidCreation: false
    }
  },
  methods: {
    // Compile credentials into a formdata object for a post submission
    compileCreateCredentials (myCredentials) {
      const credentialsForm = new FormData()
      credentialsForm.append('username', myCredentials.username)
      credentialsForm.append('password', myCredentials.password)
      credentialsForm.append('first_name', myCredentials.firstName)
      credentialsForm.append('last_name', myCredentials.lastName)
      return credentialsForm
    },
    // Create the user
    createUser (myCredentials) {
      // Compile the user data into formData for sending
      const credentialsForm = this.compileCreateCredentials(myCredentials)
      // Send the request
      fetch(this.$api + '/users/', {
        mode: 'cors',
        body: credentialsForm,
        method: 'POST'
      }).then(this.handleErrors)
        .then(response => response.json())
        .then(JSONresponse => {
          var credentials = {
            username: myCredentials.username,
            password: myCredentials.password,
            token: ''
          }
          this.invalidCreation = false
          this.login(credentials)
        })
        .catch(error => {
          console.log(error)
          this.errorMessage = error.message
          this.invalidCreation = true
        })
    },
    // Compile credentials into a formData object for a post submission
    compileCredentials (myCredentials) {
      const credentialsForm = new FormData()
      credentialsForm.append('username', myCredentials.username)
      credentialsForm.append('password', myCredentials.password)
      return credentialsForm
    },
    login (credentials) {
      console.log(credentials)
      var credentialsForm = this.compileCredentials(credentials)
      fetch(this.$api + '/get-token/', {
        mode: 'cors',
        body: credentialsForm,
        method: 'POST'
      }).then(this.handleErrors)
        .then(response => response.json()) // Convert the token response into a JSON object
        .then(JSONresponse => JSON.stringify(JSONresponse.token)) // Select the token string from the object.
        .then(token => { this.myCredentials.token = token; console.log(token); document.cookie = 'username=' + this.myCredentials.username; document.cookie = 'token=' + token })
        .then(response => {
          console.log('Complaint Success')
          this.invalidToken = false
          this.$router.push('/')
        })
        .catch(error => {
          console.log(error)
          this.invalidToken = true
        })
    },
    handleErrors (response) {
      if (!response.ok) {
        throw Error(response.statusText)
      }
      return response
    }
  }
}
</script>

<style scoped>
  .err {
    color:darkred;
  }
</style>
