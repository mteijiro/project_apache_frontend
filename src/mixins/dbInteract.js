/* dbInteract.js
   Functions that make calls to the database API are locted here.
 */

import { cookies } from '../../src/mixins/cookies'

export const dbInteract = {
  mixins: [cookies],
  data () {
    return {
    }
  },
  methods: {
    // Compile credentials into a FormData object for a post submission
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
      complaintForm.append('category', newComplaint.category)
      complaintForm.append('sub_category', newComplaint.sub_category)
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
    // createUser: Creates a user in the database with the given credentials
    //  newUserCredentials: Credentials required to create a user
    //  parScope: The scope of the parent (calling) object (used for callback functions).
    createUser (newUserCredentials, parScope) {
      var onSucc = function (response, parScope, Up1Scope) {
        var credentials = {
          username: newUserCredentials.username,
          password: newUserCredentials.password,
          token: ''
        }
        parScope.invalidCreation = false
        var onSucc = function (response, parScope) {
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
      dbInteract.methods.postToUsers(parScope.$api, newUserCredentials, onSucc, onFail, this)
    },
    // postToUsers: Posts to /users/ and asks for a new user to be created.
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
    postToComplaints (apiLoc, newComplaintData, onSucc, onFail, parentScope, myCredentials) {
      const complaintForm = this.compileComplaint(newComplaintData)

      var ifSucc = function (response, parentScope) {
        var handleErrors = function (response) {
          if (!response.ok) {
            throw Error(response.statusText)
          }
          return response
        }
        var myAuth = 'Token ' + JSON.parse(response)
        fetch(apiLoc + '/complaints/', {
          mode: 'cors',
          headers: {
            'Authorization': myAuth
          },
          body: complaintForm,
          method: 'POST'
        }).then(handleErrors)
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
      }

      var ifFail = function (response, parentScope) {
        alert('error: Complaint wasn\'t submitted: ' + response)
        console.log(response)
      }

      if (cookies.methods.getCookie('token')) {
        ifSucc(cookies.methods.getCookie('token'))
      } else {
        this.postToGetToken(apiLoc, myCredentials, ifSucc, ifFail, parentScope, false)
      }
    },
    postToGetToken (apiLoc, credentials, onSucc, onFail, parentScope, rememberMe) {
      var handleErrors = function (response) {
        if (!response.ok) {
          throw Error(response.statusText)
        }
        return response
      }

      var credentialsForm = this.compileCredentials(credentials)
      fetch(apiLoc + '/get-token/', {
        mode: 'cors',
        body: credentialsForm,
        method: 'POST'
      }).then(handleErrors)
        .then(response => response.json()) // Convert the token response into a JSON object
        .then(JSONresponse => JSON.stringify(JSONresponse.token)) // Select the token string from the object.
        .then(response => {
          credentials.token = response
          cookies.methods.clearAllCookies(parentScope)
          if (rememberMe) {
            const expireDate = new Date(Date.now())
            expireDate.setDate(expireDate.getDate() + 7)
            const expireDateString = expireDate.toUTCString()
            document.cookie = 'username=' + credentials.username + '; expires=' + expireDateString + '; domain=' + location.hostname + '; path=/'
            document.cookie = 'token=' + response + '; expires=' + expireDateString + '; domain=' + location.hostname + '; path=/'
          } else {
            // document.cookie = 'username=' + credentials.username + '; domain=' + location.hostname + '; path=/'
            // document.cookie = 'token=' + response + '; domain=' + location.hostname + '; path=/'
          }
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
