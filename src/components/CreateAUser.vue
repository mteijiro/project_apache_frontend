<template>
  <div>
    <h1>Register</h1>
    <template v-if="checkForToken()">
      <h2>Please log out before creating a new account</h2>
      <router-link to="Login">Log out here</router-link>
    </template>
    <form v-if="!checkForToken()">
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
      errorMessage: '',
      invalidToken: false,
      invalidCreation: false
    }
  },
  methods: {
    // Create the user
    createUser (newUserCredentials) {
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
          parScope.$router.push('/')
        }
        var onFail = function (error, parScope) {
          console.log(error)
          parScope.invalidToken = true
        }
        Up1Scope.postToGetToken(parScope.$api, credentials, onSucc, onFail, parScope)
        // this.login(credentials, parScope)
      }
      var onFail = function (error, parScope) {
        console.log(error)
        parScope.errorMessage = error.message
        parScope.invalidCreation = true
      }
      dbInteract.methods.postToUsers(this.$api, newUserCredentials, onSucc, onFail, this)
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
    }
  }
}
</script>

<style scoped>
  .err {
    color:darkred;
  }
</style>
