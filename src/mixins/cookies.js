// import { dbInteract } from '../../src/mixins/dbInteract'

export const cookies = {
  // mixins: [dbInteract],
  data () {
    return {
    }
  },
  methods: {
    checkForToken (parScope) {
      if (this.getCookie('token').length > 0) {
        return true
      } else {
        return false
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
          return c.substring(name.length, c.length)
        }
      }
      return ''
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
    },
    clearAllCookies (parScope) {
      parScope.deleteCookie('token')
      parScope.deleteCookie('username')
    },
    deleteCookie (name) {
      document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;'
    },
    createCookieLang (langCode) {
      const expireDate = new Date(Date.now())
      expireDate.setDate(expireDate.getDate() + 7)
      const expireDateString = expireDate.toUTCString()
      document.cookie = 'language=' + langCode + '; expires=' + expireDateString + '; domain=' + location.hostname + '; path=/'
    }
  },
  created () {

  }
}
