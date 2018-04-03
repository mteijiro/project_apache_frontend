<template>
  <div>
    <h2>Create A User</h2>
    <form>
      <div>Username:</div>
      <input type="text" v-model="myCredentials.username" placeholder="username">
      <div>Password:</div>
      <input type="password" v-model="myCredentials.password" placeholder="password">
      <div>Confirm Password:</div>
      <input type="password" v-model="myCredentials.confirmPassword" placeholder="confirm password">
      <p v-if="myCredentials.password !== myCredentials.confirmPassword">Passwords do not match</p>
      <div>First Name:</div>
      <input type="text" v-model="myCredentials.firstName" placeholder="First Name">
      <div>Last Name:</div>
      <input type="text" v-model="myCredentials.lastName" placeholder="Last Name">
      <br />
      <button type="button" value="submit" v-on:click="createUser(myCredentials)">Create</button>
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
      fetch('http://localhost:8000/users/', {
        mode: 'cors',
        body: credentialsForm,
        method: 'POST'
      }).then(response => response.json()) // Convert the token response into a JSON object
        .then(JSONresponse => JSON.stringify(JSONresponse)) // Select the token string from the object.
        .then(resp => alert('Server Response: ' + resp))
    }
  }
}
</script>

<style scoped>

</style>
