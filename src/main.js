// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueResource from 'vue-resource'
import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.min.css'
import '../src/CustomTheme.scss'
import Lang from 'vuejs-localization'

// Notice that you need to specify the lang folder, in this case './lang'
Lang.requireAll(require.context('./lang', true, /\.js$/))

Vue.use(VueMaterial)
Vue.use(VueResource)
Vue.use(Lang, {
  // default: 'en'
})

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
  template: '<App/>',
  created () {
  }
})
