<!--Log into the system and store the user's token and username on their computer via a cookie-->
<!--If we can get a username via a token I will delete the username cookie-->

<template>
  <div>
    <h1>{{$lang.LoginLang.account}}</h1>
    <template v-if="!loggedIn">`
      <md-field>
        <label>{{$lang.LoginLang.username}}</label>
        <md-input v-model="myCredentials.username"></md-input>
      </md-field>
      <md-field>
        <label>{{$lang.LoginLang.password}}</label>
        <md-input type="password" v-model="myCredentials.password"></md-input>
      </md-field>
      <md-checkbox class="md-primary" v-model="rememberMe"></md-checkbox>
      <span>{{$lang.LoginLang.remember_me}}</span>
      <br />
      <span v-if="rememberMe">{{$lang.LoginLang.remember_me_desc}}</span>
      <br />
      <br />
      <span>{{$lang.LoginLang.cookie_disclaimer}}</span>
      <br />
      <a href="https://www.whatismybrowser.com/guides/how-to-enable-cookies/">{{$lang.LoginLang.cookie_help}}</a>
      <br />
      <md-button class="md-raised md-primary" v-on:click="login()">{{$lang.LoginLang.log_in}}</md-button>
      <p id="errorMsg" v-if="invalidToken">{{$lang.LoginLang.creds_wrong}}</p>
      <template v-if="cookieWarning">
        <h2 class="cookieMsg">{{$lang.LoginLang.cookie_req}}</h2>
        <p class="cookieMsg">{{$lang.LoginLang.cookie_req_desc}}</p>
      </template>
    </template>
    <template v-if="loggedIn">
      <h1>{{$lang.LoginLang.logged_in_as}}{{tokenUsername}}</h1>
      <md-button class="md-raised md-primary" v-on:click="logout()">{{$lang.LoginLang.log_out}}</md-button>
    </template>
  </div>
</template>

<script>
import { dbInteract } from '../../src/mixins/dbInteract'
import { cookies } from '../../src/mixins/cookies'

export default {
  name: 'Login',
  mixins: [dbInteract, cookies],
  data () {
    return {
      myCredentials: {
        username: '',
        password: '',
        token: ''
      },
      tokenUsername: '',
      invalidToken: false,
      loggedIn: false,
      rememberMe: true,
      cookieWarning: false
    }
  },
  methods: {
    login () {
      if (cookies.methods.checkCookie()) {
        var onSucc = function (response, parScope) {
          parScope.invalidToken = false
          parScope.loggedIn = true
          window.location.reload()
          parScope.$router.push('Login')
        }
        var onFail = function (error, parScope) {
          console.log(error)
          parScope.invalidToken = true
        }
        dbInteract.methods.postToGetToken(this.$api, this.myCredentials, onSucc, onFail, this, this.rememberMe)
      } else {
        this.cookieWarning = true
      }
    },
    logout () {
      cookies.methods.clearAllCookies(this)
      this.loggedIn = false
      location.reload()
    }
  },
  mounted () {
    this.loggedIn = cookies.methods.checkForToken(this)
    if (this.loggedIn) {
      this.myCredentials.username = cookies.methods.getCookie('username')
      this.myCredentials.token = cookies.methods.getCookie('token')
      this.tokenUsername = cookies.methods.getCookie('username')
    } else {
    }
  },
  updated () {
    this.loggedIn = cookies.methods.checkForToken(this)
    if (this.loggedIn) {
      this.myCredentials.username = cookies.methods.getCookie('username')
      this.myCredentials.token = cookies.methods.getCookie('token')
      this.tokenUsername = cookies.methods.getCookie('username')
    } else {
    }
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
