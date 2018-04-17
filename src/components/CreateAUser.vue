<template>
  <div>
    <h1>{{$lang.CreateAUserLang.register}}</h1>
    <template v-if="this.loggedIn">
      <h2>{{$lang.CreateAUserLang.please_logout}}</h2>
      <md-button class="md-raised md-primary" v-on:click="logout()">{{$lang.CreateAUserLang.log_out}}</md-button>
    </template>
    <form v-if="!this.loggedIn">
      <md-field>
        <label>{{$lang.CreateAUserLang.username}}</label>
        <md-input type="text" v-model="myCredentials.username"></md-input>
        <md-input type="text" v-model="myCredentials.username"></md-input>
      </md-field>
      <md-field>
        <label>{{$lang.CreateAUserLang.password}}</label>
        <md-input type="password" v-model="myCredentials.password"></md-input>
        <span v-if="myCredentials.password.length < 6"
              style="color: darkred; margin-right: 35px; margin-top: 5px;">{{$lang.CreateAUserLang.password_length}}</span>
      </md-field>
      <md-field>
        <label>{{$lang.CreateAUserLang.password_confirm}}</label>
        <md-input type="password" v-model="myCredentials.confirmPassword"></md-input>
        <span v-if="myCredentials.password !== myCredentials.confirmPassword"
              style="color: darkred; margin-right: 35px; margin-top: 5px;">{{$lang.CreateAUserLang.password_match}}</span>
      </md-field>
      <md-field>
        <label>{{$lang.CreateAUserLang.name_first}}</label>
        <md-input type="text" v-model="myCredentials.firstName"></md-input>
      </md-field>
      <md-field>
        <label>{{$lang.CreateAUserLang.name_last}}</label>
        <md-input type="text" v-model="myCredentials.lastName"></md-input>
      </md-field>
      <md-checkbox class="md-primary" v-model="rememberMe"></md-checkbox>
      <span>{{$lang.CreateAUserLang.remember_me}}</span>
      <br />
      <span v-if="rememberMe">{{$lang.CreateAUserLang.remember_me_desc}}</span>
      <br />
      <span>{{$lang.CreateAUserLang.cookie_disclaimer}}</span>
      <br />
      <a href="https://www.whatismybrowser.com/guides/how-to-enable-cookies/">{{$lang.CreateAUserLang.cookie_help}}</a>
      <br />
      <template v-if="cookieWarning">
        <h2 class="cookieMsg">{{$lang.CreateAUserLang.cookie_req}}</h2>
        <p class="cookieMsg">{{$lang.CreateAUserLang.cookie_req_desc}}</p>
      </template>
      <template v-if="invalidCredsWarning">
        <h2 class="cookieMsg">{{$lang.CreateAUserLang.invalid_creds}}</h2>
        <p class="cookieMsg">{{$lang.CreateAUserLang.invalid_creds_desc}}</p>
      </template>
      <br />
      <md-button class="md-raised md-primary" type="button" value="submit" v-on:click="createUser(myCredentials)">{{$lang.CreateAUserLang.create}}</md-button>
      <p class="err" v-if="invalidCreation">{{ errorMessage }}. {{$lang.CreateAUserLang.username_taken}}</p>
      <p class="err" v-if="invalidToken">{{$lang.CreateAUserLang.invalid_token}}</p>
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
      cookieWarning: false,
      invalidCredsWarning: false
    }
  },
  methods: {
    // Create the user
    createUser (newUserCredentials) {
      if (this.checkCookie()) {
        if (this.checkCredentials(newUserCredentials)) {
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
              window.location.reload()
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
          this.invalidCredsWarning = true
        }
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
      location.reload()
    },
    checkCredentials (myCreds) {
      if (myCreds.password === myCreds.confirmPassword) {
        if (myCreds.username.length > 0 && myCreds.password.length >= 6 && myCreds.firstName.length > 0 && myCreds.lastName.length > 0) {
          return true
        } else {
          return false
        }
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
