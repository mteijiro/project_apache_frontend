<template>
  <div>
    <h1>Register</h1>
    <template v-if="this.loggedIn">
      <h2>Please log out before creating a new account</h2>
      <md-button class="md-raised md-primary" v-on:click="logout()">Log Out</md-button>
    </template>
    <form v-if="!this.loggedIn">
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
      <md-checkbox class="md-primary" v-model="rememberMe"></md-checkbox>
      <span>Remember Me</span>
      <br />
      <span v-if="rememberMe">Your credentials will be saved for 7 days or until you log out</span>
      <br />
      <span>Our website uses cookies to store your authentication details.</span>
      <br />
      <a href="https://www.whatismybrowser.com/guides/how-to-enable-cookies/">How do I enable cookies?</a>
      <br />
      <md-button class="md-raised md-primary" type="button" value="submit" v-on:click="createUser(myCredentials)">Create</md-button>
      <template v-if="cookieWarning">
        <h2 class="cookieMsg">Cookies Required</h2>
        <p class="cookieMsg">Cookies are not enabled on your browser. Please enable cookies in your browser preferences to continue.</p>
      </template>
      <p class="err" v-if="invalidCreation">{{ errorMessage }}. The username may be taken. Please try again with a different username or at a later date</p>
      <p class="err" v-if="invalidToken">Error: invalid token</p>
    </form>
  </div>
</template>

<script>
import { dbInteract } from '../../src/mixins/dbInteract'
export default {
  name: 'CreateAUser',
  mixins: [dbInteract],
  data () {
    return {
      myCredentials: {
        username: '',
        password: '',
        confirmPassword: '',
        firstName: '',
        lastName: ''
      },
      loggedIn: false,
      errorMessage: '',
      invalidToken: false,
      invalidCreation: false,
      rememberMe: true,
      cookieWarning: false
    }
  },
  methods: {
    // Create the user
    createUser (newUserCredentials) {
      if (this.checkCookie()) {
        var onSucc = function (response, parScope, Up1Scope) {
          var credentials = {
            username: newUserCredentials.username,
            password: newUserCredentials.password,
            token: ''
          }
          parScope.invalidCreation = false
          var onSucc = function (response, parScope) {
            console.log('Complaint Success')
            parScope.invalidToken = false
            location.reload(true)
            parScope.$router.push('Login')
          }
          var onFail = function (error, parScope) {
            console.log(error)
            parScope.invalidToken = true
          }
          Up1Scope.postToGetToken(parScope.$api, credentials, onSucc, onFail, parScope, parScope.rememberMe)
          // this.login(credentials, parScope)
        }
        var onFail = function (error, parScope) {
          console.log(error)
          parScope.errorMessage = error.message
          parScope.invalidCreation = true
        }
        dbInteract.methods.postToUsers(this.$api, newUserCredentials, onSucc, onFail, this)
      } else {
        this.cookieWarning = true
      }
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
    checkForToken () {
      // this.getCookie('username')
      this.myCredentials.token = this.getCookie('token')
      console.log(this.myCredentials.token)
      if (this.myCredentials.token.length > 0) {
        return true
      } else {
        return false
      }
    },
    logout () {
      dbInteract.methods.clearAllCookies()
      this.loggedIn = false
      location.reload(true)
    },
    checkCookie () {
      var cookieEnabled = navigator.cookieEnabled
      if (!cookieEnabled) {
        document.cookie = 'testcookie'
        cookieEnabled = document.cookie.indexOf('testcookie') !== -1
      }
      return cookieEnabled || this.showCookieFail()
    },
    showCookieFail () {
      // do something here
      return false
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
  .err {
    color:darkred;
  }
  .cookieMsg {
    color: red;
  }
</style>
