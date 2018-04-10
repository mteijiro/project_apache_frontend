<!--Log into the system and store the user's token and username on their computer via a cookie-->
<!--If we can get a username via a token I will delete the username cookie-->

<template>
  <div>
    <h1>Login</h1>
    <md-field>
      <label>Username:</label>
      <md-input v-model="myCredentials.username"></md-input>
    </md-field>
    <md-field>
      <label>Password:</label>
      <md-input type="password" v-model="myCredentials.password"></md-input>
    </md-field>
    <p>Our website uses cookies to store your authentication details.</p>
    <md-button class="md-raised md-primary" v-on:click="login()">Submit</md-button>
    <md-button class="md-raised md-primary" v-on:click="getCookie('token')">TestCookie</md-button>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data () {
    return {
      myCredentials: {
        username: '',
        password: '',
        token: ''
      }
    }
  },
  methods: {
    // Compile credentials into a formData object for a post submission
    compileCredentials (myCredentials) {
      const credentialsForm = new FormData()
      credentialsForm.append('username', myCredentials.username)
      credentialsForm.append('password', myCredentials.password)
      return credentialsForm
    },
    login () {
      var credentialsForm = this.compileCredentials(this.myCredentials)
      fetch('http://18.197.28.234:8000/get-token/', {
        mode: 'cors',
        body: credentialsForm,
        method: 'POST'
      }).then(response => response.json()) // Convert the token response into a JSON object
        .then(JSONresponse => JSON.stringify(JSONresponse.token)) // Select the token string from the object.
        .then(token => { this.myCredentials.token = token; console.log(token); document.cookie = 'username=' + this.myCredentials.username; document.cookie = 'token=' + token })
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
          console.log(c.substring(name.length, c.length))
          return c.substring(name.length, c.length)
        }
      }
      return ''
    }
  }
}
</script>

<style scoped>

</style>
