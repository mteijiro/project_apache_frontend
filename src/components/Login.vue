<!--Log into the system and store the user's token and username on their computer via a cookie-->
<!--If we can get a username via a token I will delete the username cookie-->

<template>
  <div>
    <h1>Account</h1>
    <h2>Cookie Data:</h2>
    <p>Your Username: {{getCookie('username')}}</p>
    <br/>
    <p>Your Token: {{getCookie('token')}}</p>
    <template v-if="!loggedIn">
      <md-field>
        <label>Username:</label>
        <md-input v-model="myCredentials.username"></md-input>
      </md-field>
      <md-field>
        <label>Password:</label>
        <md-input type="password" v-model="myCredentials.password"></md-input>
      </md-field>
      <md-checkbox class="md-primary" v-model="rememberMe"></md-checkbox>
      <span>Remember Me</span>
      <br />
      <span v-if="rememberMe">Your credentials will be saved for 7 days or until you log out</span>
      <br />
      <br />
      <span>Our website uses cookies to store your authentication details.</span>
      <br />
      <a href="https://www.whatismybrowser.com/guides/how-to-enable-cookies/">How do I enable cookies?</a>
      <br />
      <md-button class="md-raised md-primary" v-on:click="login()">Log In</md-button>
      <p id="errorMsg" v-if="invalidToken">Invalid username or password, please try again</p>
      <template v-if="cookieWarning">
        <h2 class="cookieMsg">Cookies Required</h2>
        <p class="cookieMsg">Cookies are not enabled on your browser. Please enable cookies in your browser preferences to continue.</p>
      </template>
    </template>
    <template v-if="loggedIn">
      <h1>You are logged in as {{getCookie('username')}}</h1>
      <md-button class="md-raised md-primary" v-on:click="logout()">Log Out</md-button>
    </template>
  </div>
</template>

<script>
import { dbInteract } from '../../src/mixins/dbInteract'

export default {
  name: 'Login',
  mixins: [dbInteract],
  data () {
    return {
      myCredentials: {
        username: '',
        password: '',
        token: ''
      },
      invalidToken: false,
      loggedIn: false,
      rememberMe: true,
      cookieWarning: false
    }
  },
  methods: {
    login () {
      if (this.checkCookie()) {
        var onSucc = function (response, parScope) {
          console.log('Complaint Success')
          parScope.invalidToken = false
          parScope.loggedIn = true
          window.location.reload()
          parScope.$router.push('Login')
        }
        var onFail = function (error, parScope) {
          console.log(error)
          parScope.invalidToken = true
        }
        // console.log(dbInteract)
        dbInteract.methods.postToGetToken(this.$api, this.myCredentials, onSucc, onFail, this, this.rememberMe)
      } else {
        this.cookieWarning = true
      }
    },
    logout () {
      dbInteract.methods.clearAllCookies()
      this.loggedIn = false
      location.reload()
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
    alert('Your Token after going to login' + this.getCookie('token'))
  },
  updated () {
    this.loggedIn = this.checkForToken()
  }
}
</script>

<style scoped>
  #errorMsg {
    color: red;
  }
  .cookieMsg {
    color: red;
  }

</style>
