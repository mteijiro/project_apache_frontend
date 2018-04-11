export const dbInteract = {
  data () {
    return {
    }
  },
  methods: {
    cookieExists (key) {
      const myCookie = this.getCookie(key)
      if (myCookie !== null) {
        return true
      } else {
        return false
      }
    },
    // Compile credentials into a formdata object for a post submission
    compileCreateCredentials (myCredentials) {
      const credentialsForm = new FormData()
      credentialsForm.append('username', myCredentials.username)
      credentialsForm.append('password', myCredentials.password)
      credentialsForm.append('first_name', myCredentials.firstName)
      credentialsForm.append('last_name', myCredentials.lastName)
      return credentialsForm
    },
    // Compile credentials into a formData object for a post submission
    compileCredentials (myCredentials) {
      const credentialsForm = new FormData()
      credentialsForm.append('username', myCredentials.username)
      credentialsForm.append('password', myCredentials.password)
      return credentialsForm
    },
    compileComplaint (newComplaint) {
      const complaintForm = new FormData()
      complaintForm.append('severity', newComplaint.severity)
      complaintForm.append('category', newComplaint.category)
      complaintForm.append('latitude', String(newComplaint.latitude))
      complaintForm.append('longitude', String(newComplaint.longitude))
      complaintForm.append('comments', newComplaint.comments)
      if (newComplaint.imageUP != null) {
        complaintForm.append('image', newComplaint.imageUP, newComplaint.imageUP.name)
      }
      if (newComplaint.audioUP != null) {
        complaintForm.append('audio', newComplaint.audioUP, newComplaint.audioUP.name)
      }
      return complaintForm
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
    postToUsers (apiLoc, newUserData, onSucc, onFail, parentScope) {
      // Compile the user data into formData for sending
      const credentialsForm = this.compileCreateCredentials(newUserData)
      // Send the request
      fetch(apiLoc + '/users/', {
        mode: 'cors',
        body: credentialsForm,
        method: 'POST'
      }).then(this.handleErrors)
        .then(response => response.json())
        .then(response => {
          if (typeof onSucc === 'function') {
            onSucc(response, parentScope, this)
          }
        })
        .catch(error => {
          if (typeof onFail === 'function') {
            onFail(error, parentScope)
          }
        })
    },
    createUser (newUserCredentials, parScope) {
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
      }
      var onFail = function (error, parScope) {
        console.log(error)
        parScope.errorMessage = error.message
        parScope.invalidCreation = true
      }
      dbInteract.methods.postToUsers(this.$api, newUserCredentials, onSucc, onFail, this)
    },
    postToComplaints (apiLoc, newComplaintData, onSucc, onFail, parentScope) {
      const complaintForm = this.compileComplaint(newComplaintData)
      var myAuth = 'Token ' + JSON.parse(this.getCookie('token'))
      console.log(myAuth)
      fetch(apiLoc + '/complaints/', {
        mode: 'cors',
        headers: {
          'Authorization': myAuth
        },
        body: complaintForm,
        method: 'POST'
      }).then(this.handleErrors)
        .then(response => {
          if (typeof onSucc === 'function') {
            onSucc(response, parentScope)
          }
        })
        .catch(error => {
          if (typeof onFail === 'function') {
            onFail(error, parentScope)
          }
        })
    },
    postToGetToken (apiLoc, credentials, onSucc, onFail, parentScope) {
      console.log(credentials)
      var credentialsForm = this.compileCredentials(credentials)
      fetch(apiLoc + '/get-token/', {
        mode: 'cors',
        body: credentialsForm,
        method: 'POST'
      }).then(this.handleErrors)
        .then(response => response.json()) // Convert the token response into a JSON object
        .then(JSONresponse => JSON.stringify(JSONresponse.token)) // Select the token string from the object.
        .then(response => {
          console.log(response)
          credentials.token = response
          this.clearAllCookies()
          document.cookie = 'username=' + credentials.username
          document.cookie = 'token=' + response
          if (typeof onSucc === 'function') {
            onSucc(response, parentScope)
          }
        })
        .catch(error => {
          if (typeof onFail === 'function') {
            onFail(error, parentScope)
          }
        })
    },
    deleteCookie (name) {
      document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;'
    },
    clearAllCookies () {
      this.deleteCookie('token')
      this.deleteCookie('username')
    },
    handleErrors (response) {
      if (!response.ok) {
        throw Error(response.statusText)
      }
      return response
    }
  },
  created () {

  }
}
