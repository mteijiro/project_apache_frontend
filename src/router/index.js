import Vue from 'vue'
import Router from 'vue-router'
import MainMenu from '@/components/MainMenu'
import SubmitAComplaint from '@/components/SubmitAComplaint'
import About from '@/components/About'
import CreateAUser from '@/components/CreateAUser'
import Login from '@/components/Login'
import DataSet from '@/components/DataSet'
import TermsOfService from '@/components/TermsOfService'
import CookiePolicy from '@/components/CookiePolicy'
import PrivacyPolicy from '@/components/PrivacyPolicy'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'MainMenu',
      component: MainMenu
    },
    {
      path: '/SubmitAComplaint',
      name: 'SubmitAComplaint',
      component: SubmitAComplaint
    },
    {
      path: '/About',
      name: 'About',
      component: About
    },
    {
      path: '/CreateAUser',
      name: 'CreateAUser',
      component: CreateAUser
    },
    {
      path: '/Login',
      name: 'Login',
      component: Login
    },
    {
      path: '/DataSet',
      name: 'DataSet',
      component: DataSet
    },
    {
      path: '/TermsOfService',
      name: 'TermsOfService',
      component: TermsOfService
    },
    {
      path: '/CookiePolicy',
      name: 'CookiePolicy',
      component: CookiePolicy
    },
    {
      path: '/PrivacyPolicy',
      name: 'PrivacyPolicy',
      component: PrivacyPolicy
    }
    // {
    //   path: '/LeafletMap',
    //   name: 'LeafletMap',
    //   component: LeafletMap
    // }
  ]
})
