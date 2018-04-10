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
      }
    }
  },
  methods: {
    // Compile credentials into a formdata object for a post submission
    compileCredentials (myCredentials) {
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
      const credentialsForm = this.compileCredentials(myCredentials)
      // Send the request
      fetch('http://18.197.28.234:8000/users/', {
        mode: 'cors',
        body: credentialsForm,
        method: 'POST'
      }).then(response => response.json()) // Convert the token response into a JSON object
        .then(JSONresponse => JSON.stringify(JSONresponse)) // Select the token string from the object.
    }
  }
}
</script>

<style scoped>

</style>
