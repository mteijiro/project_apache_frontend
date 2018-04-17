<template>
  <div id="app">
    <div class="page-container">
      <md-app md-waterfall md-mode="fixed-last">
        <md-app-toolbar class="md-large md-dense md-primary">
          <div class="md-toolbar-row">
            <div class="md-toolbar-section-start">
              <span class="md-title">{{$lang.ToolbarLang.app_name}}</span>
            </div>
            <md-button id="localization" v-on:click="changeLanguage()">{{$lang.ToolbarLang.language}}{{this.$lang.getLang()}} </md-button>
            <span id="loginName" v-if="username.length > 0">{{$lang.ToolbarLang.logged_in}}{{ username }}</span>
          </div>
          <div class="md-toolbar-row">
            <md-tabs class="md-primary" md-alignment="centered" md-sync-route>
              <md-tab id="tab-menu" v-bind:md-label="toolbarNames.menu" to="/"></md-tab>
              <md-tab id="tab-submit" v-bind:md-label="toolbarNames.submit_a_complaint" to="/SubmitAComplaint"></md-tab>
              <md-tab id="tab-create" v-bind:md-label="toolbarNames.register" to="/CreateAUser"></md-tab>
              <md-tab id="tab-about" v-bind:md-label="toolbarNames.about" to="/About"></md-tab>
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
    data: (parent) => ({
      menuVisible: false,
      username: '',
      accountTabLabel: 'My Account',
      toolbarNames: {
        menu: parent.$lang.ToolbarLang.menu,
        submit_a_complaint: parent.$lang.ToolbarLang.submit_a_complaint,
        register: parent.$lang.ToolbarLang.register,
        about: parent.$lang.ToolbarLang.about
      }
    }),
    methods: {
      displayUserName () {
        var myToken = this.getCookie('token')
        this.username = this.getCookie('username')
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
            return c.substring(name.length, c.length)
          }
        }
        return ''
      },
      checkForToken () {
        // this.getCookie('username')
        var token = this.getCookie('token')
        if (token.length > 0) {
          return true
        } else {
          return false
        }
      },
      //Returns "Log In" if not storing token, otherwise returns "My Account"
      setAccountTabLabel () {
        if (this.checkForToken()) {
          this.accountTabLabel = this.$lang.ToolbarLang.my_account // 'My Account'
        } else {
          this.accountTabLabel = this.$lang.ToolbarLang.log_in // 'Log In'
        }
      },
      // Refresh the toolbar header names on the toolbar to reflect the detected language
      refreshToolbarHeaders () {
        this.toolbarNames.menu = this.$lang.ToolbarLang.menu
        this.toolbarNames.submit_a_complaint = this.$lang.ToolbarLang.submit_a_complaint
        this.toolbarNames.register = this.$lang.ToolbarLang.register
        this.toolbarNames.about = this.$lang.ToolbarLang.about
      },
      changeLanguage () {
        if (this.$lang.getLang() === 'en') {
          this.$lang.setLang('dk')
          this.deleteCookie('lang')
          this.createCookieLang('dk')
        } else {
          this.$lang.setLang('en')
          this.deleteCookie('lang')
          this.createCookieLang('en')
        }
        location.reload()
      },
      createCookieLang () {
        const expireDate = new Date(Date.now())
        expireDate.setDate(expireDate.getDate() + 7)
        const expireDateString = expireDate.toUTCString()
        document.cookie = 'language=' + this.$lang.getLang() + '; expires=' + expireDateString + '; domain=' + location.hostname + '; path=/'
      },
      deleteCookie (name) {
        document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;'
      }
    },
    beforeMount() {
      this.displayUserName()
      this.setAccountTabLabel()
      this.refreshToolbarHeaders()
    },
    updated() {
      this.displayUserName()
      this.setAccountTabLabel()
    },
    mounted : function () {
      if (this.getCookie('language') !== null) {
        this.$lang.setLang(this.getCookie('language'))
      } else {
        this.$lang.setLang('en')
      }
      this.refreshToolbarHeaders()
    },
    created() {
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


