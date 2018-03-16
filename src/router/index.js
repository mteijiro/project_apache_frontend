import Vue from 'vue'
import Router from 'vue-router'
import Complaint from '@/components/Complaint'
import MainMenu from '@/components/MainMenu'
import SubmitAComplaint from '@/components/SubmitAComplaint'
import About from '@/components/About'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'MainMenu',
      component: MainMenu
    },
    {
      path: '/Complaint',
      name: 'Complaint',
      component: Complaint
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
    }
  ]
})
