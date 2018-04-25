<template>
  <div id="app">
    <div class="page-container">
      <md-app md-waterfall md-mode="fixed-last">
        <md-app-toolbar class="md-large md-dense md-primary">
          <div class="md-toolbar-row">
            <div class="md-toolbar-section-start">
              <span class="md-title">{{$lang.ToolbarLang.app_name}}</span>
            </div>
            <md-button id="localization" class="md-raised" v-on:click="changeLanguage()">{{$lang.ToolbarLang.language}}{{curLanguage}} </md-button>
            <span id="loginName" v-if="myCredentials.username.length > 0">{{$lang.ToolbarLang.logged_in}}{{ myCredentials.username }}</span>
          </div>
          <div class="md-toolbar-row">
            <md-tabs class="md-primary"  md-sync-route>
              <md-tab id="tab-menu" v-bind:md-label="toolbarNames.menu" to="/"></md-tab>
              <md-tab id="tab-submit" v-bind:md-label="toolbarNames.submit_a_complaint" to="/SubmitAComplaint"></md-tab>
              <!--<md-tab id="tab-create" v-bind:md-label="toolbarNames.register" to="/CreateAUser"></md-tab>-->
              <md-tab id="tab-about" v-bind:md-label="toolbarNames.about" to="/About"></md-tab>
              <!--<md-tab id="tab-login" v-bind:md-label="accountTabLabel" to="/Login"></md-tab>-->
              <!--<md-tab id="tab-dataset" md-label="DataSet" to="/DataSet"></md-tab>-->
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
import { cookies } from '../src/mixins/cookies'

/* eslint-disable */
  export default {
    name: 'App',
    mixins: [cookies],
    data: (parent) => ({
      menuVisible: false,
      myCredentials: {
        username: '',
        token: ''
      },
      accountTabLabel: parent.$lang.ToolbarLang.my_account,
      curLanguage: 'en',
      toolbarNames: {
        menu: parent.$lang.ToolbarLang.menu,
        submit_a_complaint: parent.$lang.ToolbarLang.submit_a_complaint,
        register: parent.$lang.ToolbarLang.register,
        about: parent.$lang.ToolbarLang.about
      },
    }),
    methods: {
      displayUserName () {
        this.myCredentials.token = cookies.methods.getCookie('token')
        this.myCredentials.username = cookies.methods.getCookie('username')
      },
      //Returns "Log In" if not storing token, otherwise returns "My Account"
      setAccountTabLabel () {
        if (cookies.methods.checkForToken(this)) {
          this.myCredentials.token = cookies.methods.getCookie('token')
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
          this.curLanguage = 'dk'
          cookies.methods.deleteCookie('language')
          cookies.methods.createCookieLang('dk')
        } else {
          this.$lang.setLang('en')
          this.curLanguage = 'en'
          cookies.methods.deleteCookie('language')
          cookies.methods.createCookieLang('en')
        }
        location.reload()
      },
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
      if (cookies.methods.getCookie('language').length > 0) {
        this.$lang.setLang(cookies.methods.getCookie('language'))
        this.curLanguage = cookies.methods.getCookie('language')
      } else {
        this.$lang.setLang('en')
        this.curLanguage = 'en'
        cookies.methods.createCookieLang('en')
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
    text-align: left
  }

  ul, ol {
    text-align: left!important;
  }

  .md-input {
    font-size: 16px!important;
  }

  #app > div > div > main > div.md-toolbar.md-app-toolbar.md-large.md-dense.md-primary.md-theme-default.md-elevation-4.md-no-elevation.md-fixed-last-active > div:nth-child(2) > div {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
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

  .md-tabs {
    margin: 0!important;
    alignment: right!important;
  }

  #localization {
    background-color: #ffffff !important;
  }

  .md-raised {
  }

  .md-toolbar-section-start {
    justify-content: center!important;
  }

  body > div.md-datepicker-dialog.md-theme-default > div.md-datepicker-body > div.md-dialog-actions.md-datepicker-body-footer > button > div > div {
    color: #ffffff !important;
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
