// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueResource from 'vue-resource'
import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.min.css'
import '../src/CustomTheme.scss'

Vue.use(VueMaterial)
Vue.use(VueResource)

Vue.config.productionTip = false

var config = {
  api: 'http://18.195.234.213:8000',
  localApi: 'http://localhost:8000'
}

Vue.prototype.$api = config.localApi

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
