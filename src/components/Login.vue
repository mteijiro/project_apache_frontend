<!--Log into the system and store the user's token and username on their computer via a cookie-->
<!--If we can get a username via a token I will delete the username cookie-->

<template>
  <div>
    <h1>Account</h1>
    <template v-if="!loggedIn">
      <md-field>
        <label>Username:</label>
        <md-input v-model="myCredentials.username"></md-input>
      </md-field>
      <md-field>
        <label>Password:</label>
        <md-input type="password" v-model="myCredentials.password"></md-input>
      </md-field>
      <p>Our website uses cookies to store your authentication details.</p>
      <md-button class="md-raised md-primary" v-on:click="login()">Log In</md-button>
      <p id="errorMsg" v-if="invalidToken">Invalid username or password, please try again</p>
    </template>
    <template v-if="loggedIn">
      <h1>You are logged in as {{getCookie('username')}}</h1>
      <md-button class="md-raised md-primary" v-on:click="logout()">Log Out</md-button>
    </template>
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
      },
      invalidToken: false,
      loggedIn: false
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
      fetch(this.$api + '/get-token/', {
        mode: 'cors',
        body: credentialsForm,
        method: 'POST'
      }).then(this.handleErrors)
        .then(response => response.json()) // Convert the token response into a JSON object
        .then(JSONresponse => JSON.stringify(JSONresponse.token)) // Select the token string from the object.
        .then(token => {
          this.myCredentials.token = token
          console.log(token)
          document.cookie = 'username=' + this.myCredentials.username
          document.cookie = 'token=' + token
        })
        .then(response => {
          console.log('Complaint Success')
          this.invalidToken = false
          this.loggedIn = true
          this.$router.push('Login')
        })
        .catch(error => {
          console.log(error)
          this.invalidToken = true
        })
    },
    logout () {
      this.deleteCookie('username')
      this.deleteCookie('token')
      this.loggedIn = false
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
    },
    deleteCookie (name) {
      document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;'
    },
    handleErrors (response) {
      if (!response.ok) {
        throw Error(response.statusText)
      }
      return response
    },
    checkForToken () {
      // this.getCookie('username')
      this.myCredentials.token = this.getCookie('token')
      console.log(this.myCredentials.token)
      if (this.myCredentials.token.length > 0) {
        return true
      } else {
        return false
      }
    }
  },
  mounted () {
    this.loggedIn = this.checkForToken()
  },
  updated () {
    this.loggedIn = this.checkForToken()
  }
}
</script>

<style scoped>
  #errorMsg {
    color:red;
  }

</style>
