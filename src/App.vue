<template>
  <div id="app">
    <div class="page-container">
      <md-app md-waterfall md-mode="fixed-last">
        <md-app-toolbar class="md-large md-dense md-primary">
          <div class="md-toolbar-row">
            <div class="md-toolbar-section-start">
              <span class="md-title">Noise Complaint App</span>
            </div>
            <span id="loginName" v-if="username.length > 0">Logged In: {{ username }}</span>
          </div>
          <div class="md-toolbar-row">
            <md-tabs class="md-primary" md-alignment="centered" md-sync-route>
              <md-tab id="tab-menu" md-label="Menu" to="/"></md-tab>
              <md-tab id="tab-submit" md-label="Submit A Complaint" to="/SubmitAComplaint"></md-tab>
              <md-tab id="tab-create" md-label="Register" to="/CreateAUser"></md-tab>
              <md-tab id="tab-about" md-label="About" to="/About"></md-tab>
              <md-tab id="tab-login" v-bind:md-label="accountTabLabel" to="/Login"></md-tab>
            </md-tabs>
          </div>
        </md-app-toolbar>

        <md-app-content>
          <br/>
          <router-view/>
        </md-app-content>
      </md-app>
    </div>
  </div>
</template>

<script>
/* eslint-disable */

  export default {
    name: 'App',
    data: () => ({
      menuVisible: false,
      username: '',
      accountTabLabel: 'My Account'
    }),
    methods: {
      displayUserName () {
        var myToken = this.getCookie('token')
        this.username = this.getCookie('username')
        // if (myToken.token.length > 0) {
        //   this.getUserName(myToken)
        // }
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
        var token = this.getCookie('token')
        console.log(token)
        if (token.length > 0) {
          return true
        } else {
          return false
        }
      },
      //Returns "Log In" if not storing token, otherwise returns "My Account"
      setAccountTabLabel () {
        if (this.checkForToken()) {
          this.accountTabLabel = 'My Account'
        } else {
          this.accountTabLabel = 'Log In'
        }
      }
      //Send a request to get the user name
      //Currently just points to the first user name because i'm not sure
      // getUserName (myToken) {
      //   var myAuth = 'Token ' + JSON.parse(myToken)
      //   console.log(myAuth)
      //   fetch('http://localhost:8000/users/1/', {
      //     mode: 'cors',
      //     headers: {
      //       'Authorization': myAuth
      //     },
      //     method: 'GET',
      //   }).then(response => response.json()) // Convert the token response into a JSON object
      //     .then(JSONresponse => JSON.stringify(JSONresponse.username)) // Select the token string from the object.
      //     .then(username => { this.username = username; console.log(username) })
      // },
    },
    beforeMount() {
      this.displayUserName()
      this.setAccountTabLabel()
    },
    updated() {
      this.displayUserName()
      this.setAccountTabLabel()
    },
    mounted : function () {
    }
  }
</script>

<style>

  html * {
    max-width: 100%;
  }

  body {
    background-color: #eee;
  }

  p {
    text-align: left!important;
  }

  ul, ol {
    text-align: left!important;
  }

  .md-input {
    font-size: 16px!important;
  }

  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    padding: .5vh .5vw;
  }

  .md-steppers-navigation {
    box-shadow: none!important;
    overflow: auto!important;
  }

  .md-primary {
    background-color: #008a83 !important;
  }

  .md-tabs-navigation {
    flex-wrap: wrap!important;
    justify-content: center!important;
  }

  .md-toolbar .md-tabs {
    margin: 0!important;
  }

  .md-toolbar-section-start {
    justify-content: center!important;
  }

  @media only screen and (max-width: 520px) {
    .md-app-scroller.md-layout-column.md-flex.md-theme-default.md-scrollbar {
      margin-top: 148px !important;
    }
  }

</style>

<style lang="scss" scoped>

  .md-app {
    background-color: #fff;
    max-width: 750px;
    margin: 0 auto;
    border: 1px solid rgba(#000, .12);
  }

  #loginName {
    margin-right: 0;
  }

  // Demo purposes only
  .md-drawer {
    width: 230px;
    max-width: calc(100vw - 125px);
  }

  .md-toolbar.md-theme-default.md-primary {
    background-color: #008a83 !important;
  }

  .md-input {
    font-size: 72px;
  }

</style>


