webpackJsonp([1],{"/RyS":function(e,t){},0:function(e,t){},"4+hh":function(e,t){},"4VeS":function(e,t){},AitT:function(e,t){},BZUQ:function(e,t){},HwEy:function(e,t){},IJT7:function(e,t){},Ii5r:function(e,t){},Jq5x:function(e,t,n){e.exports=n.p+"static/img/WPIxMiljopunkt.96a041c.png"},"KVv/":function(e,t){},NHnr:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o=n("7+uW"),a={name:"App",data:function(){return{menuVisible:!1,username:"",accountTabLabel:"My Account"}},methods:{displayUserName:function(){this.getCookie("token");this.username=this.getCookie("username")},getCookie:function(e){for(var t=e+"=",n=decodeURIComponent(document.cookie).split(";"),o=0;o<n.length;o++){for(var a=n[o];" "===a.charAt(0);)a=a.substring(1);if(0===a.indexOf(t))return console.log(a.substring(t.length,a.length)),a.substring(t.length,a.length)}return""},checkForToken:function(){var e=this.getCookie("token");return console.log(e),e.length>0},setAccountTabLabel:function(){this.checkForToken()?this.accountTabLabel="My Account":this.accountTabLabel="Log In"}},beforeMount:function(){this.displayUserName(),this.setAccountTabLabel()},updated:function(){this.displayUserName(),this.setAccountTabLabel()},mounted:function(){}},i={render:function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{attrs:{id:"app"}},[n("div",{staticClass:"page-container"},[n("md-app",{attrs:{"md-waterfall":"","md-mode":"fixed-last"}},[n("md-app-toolbar",{staticClass:"md-large md-dense md-primary"},[n("div",{staticClass:"md-toolbar-row"},[n("div",{staticClass:"md-toolbar-section-start"},[n("span",{staticClass:"md-title"},[e._v("Noise Complaint App")])]),e._v(" "),e.username.length>0?n("span",{attrs:{id:"loginName"}},[e._v("Logged In: "+e._s(e.username))]):e._e()]),e._v(" "),n("div",{staticClass:"md-toolbar-row"},[n("md-tabs",{staticClass:"md-primary",attrs:{"md-alignment":"centered"}},[n("md-tab",{attrs:{id:"tab-menu","md-label":"Menu",to:"/"}}),e._v(" "),n("md-tab",{attrs:{id:"tab-submit","md-label":"Submit A Complaint",to:"SubmitAComplaint"}}),e._v(" "),n("md-tab",{attrs:{id:"tab-create","md-label":"Register",to:"CreateAUser"}}),e._v(" "),n("md-tab",{attrs:{id:"tab-about","md-label":"About",to:"About"}}),e._v(" "),n("md-tab",{attrs:{id:"tab-login","md-label":e.accountTabLabel,to:"Login"}})],1)],1)]),e._v(" "),n("md-app-content",[n("br"),e._v(" "),n("router-view")],1)],1)],1)])},staticRenderFns:[]};var r=n("VU/8")(a,i,!1,function(e){n("IJT7"),n("/RyS")},"data-v-9a27f12a",null).exports,s=n("/ocq"),l={render:function(){this.$createElement;this._self._c;return this._m(0)},staticRenderFns:[function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",[n("h1",[e._v("Welcome!")]),e._v(" "),n("p",[e._v("Welcome to the Noise Complaint App! This app serves two purposes: to help inform about Copenhagen’s noise complaint process and to collect nightlife noise complaint data. The app will walk you through the process of submitting a noise complaint. Currently, we are only accepting noise complaints pertaining to street noise and private celebrations; however, the app will walk you through the process of submitting any other type of noise complaint to the proper authorities.")]),e._v(" "),n("p",[e._v("For the testing period, we ask you to create a username and password that will allow you into the noise complaint system. Please visit the create an account tab at the top of the screen to do so.")]),e._v(" "),n("p",[e._v("Please note that this app is not finished yet and is currently being worked on. Before our system becomes available to the public we will be clearing the database of all complaints, and accounts created during the testing period. However, please refrain from submitting any personal information in a complaint as we are still actively improving the data security systems.")]),e._v(" "),n("h2",[e._v("Disclaimer")]),e._v(" "),n("p",[e._v("Your noise complaint submission will be sent to our database for noise disturbance data collection. For any emergencies, please contact the Police at 112.")])])}]};var d=n("VU/8")({name:"main-menu"},l,!1,function(e){n("4VeS")},"data-v-15e89c44",null).exports,c=n("Xxa5"),u=n.n(c),m=n("exGp"),p=n.n(m),h=n("nrd6"),f=n.n(h),v={name:"leaflet-map",props:{newCoords:{latitude:{type:Number,default:0},longitude:{type:Number,default:0}}},data:function(){return{mymap:{},myMarker:{},curCoords:{latCoord:{type:Number,default:0},longCoord:{type:Number,default:0}}}},mounted:function(){var e=f.a.map("mapid",{minZoom:13,maxZoom:18,maxBounds:[[55.71,12.5],[55.65,12.66]]}).setView([55.679479,12.56947],13);f.a.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw",{attribution:'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',id:"mapbox.streets"}).addTo(e),this.myMarker=f.a.marker([55.679479,12.56947],{draggable:!0}).addTo(e);var t=this;this.myMarker.on("dragend",function(e){t.curCoords.latCoord=this.getLatLng().lat,t.curCoords.longCoord=this.getLatLng().lng,t.$emit("coordsChanged",t.curCoords)}),this.mymap=e},methods:{updateCoords:function(){this.curCoords.latCoord=this.newCoords.latitude,this.curCoords.longCoord=this.newCoords.longitude,this.mymap.setView([this.curCoords.latCoord,this.curCoords.longCoord],this.mymap.getZoom()),this.myMarker.setLatLng([this.curCoords.latCoord,this.curCoords.longCoord]).update()}},watch:{newCoords:{handler:function(e,t){this.updateCoords()}}}},g={render:function(){var e=this.$createElement,t=this._self._c||e;return t("div",[t("div",this._b({attrs:{id:"mapid"}},"div",this.mymap,!1))])},staticRenderFns:[]};var _=n("VU/8")(v,g,!1,function(e){n("KVv/")},"data-v-7c9d1bde",null).exports,C=n("E+XS"),b=n("mvHQ"),y=n.n(b),k={data:function(){return{}},methods:{cookieExists:function(e){return null!==this.getCookie(e)},compileCreateCredentials:function(e){var t=new FormData;return t.append("username",e.username),t.append("password",e.password),t.append("first_name",e.firstName),t.append("last_name",e.lastName),t},compileCredentials:function(e){var t=new FormData;return t.append("username",e.username),t.append("password",e.password),t},compileComplaint:function(e){var t=new FormData;return t.append("severity",e.severity),t.append("category",e.category),t.append("latitude",String(e.latitude)),t.append("longitude",String(e.longitude)),t.append("comments",e.comments),null!=e.imageUP&&t.append("image",e.imageUP,e.imageUP.name),null!=e.audioUP&&t.append("audio",e.audioUP,e.audioUP.name),t},getCookie:function(e){for(var t=e+"=",n=decodeURIComponent(document.cookie).split(";"),o=0;o<n.length;o++){for(var a=n[o];" "===a.charAt(0);)a=a.substring(1);if(0===a.indexOf(t))return console.log(a.substring(t.length,a.length)),a.substring(t.length,a.length)}return""},postToUsers:function(e,t,n,o,a){var i=this,r=this.compileCreateCredentials(t);fetch(e+"/users/",{mode:"cors",body:r,method:"POST"}).then(this.handleErrors).then(function(e){return e.json()}).then(function(e){"function"==typeof n&&n(e,a,i)}).catch(function(e){"function"==typeof o&&o(e,a)})},createUser:function(e,t){k.methods.postToUsers(this.$api,e,function(t,n,o){var a={username:e.username,password:e.password,token:""};n.invalidCreation=!1;var i=function(e,t){console.log("Complaint Success"),t.invalidToken=!1,t.$router.push("/")};o.postToGetToken(n.$api,a,i,function(e,t){console.log(e),t.invalidToken=!0},n)},function(e,t){console.log(e),t.errorMessage=e.message,t.invalidCreation=!0},this)},postToComplaints:function(e,t,n,o,a){var i=this.compileComplaint(t),r="Token "+JSON.parse(this.getCookie("token"));console.log(r),fetch(e+"/complaints/",{mode:"cors",headers:{Authorization:r},body:i,method:"POST"}).then(this.handleErrors).then(function(e){"function"==typeof n&&n(e,a)}).catch(function(e){"function"==typeof o&&o(e,a)})},postToGetToken:function(e,t,n,o,a){var i=this;console.log(t);var r=this.compileCredentials(t);fetch(e+"/get-token/",{mode:"cors",body:r,method:"POST"}).then(this.handleErrors).then(function(e){return e.json()}).then(function(e){return y()(e.token)}).then(function(e){console.log(e),t.token=e,i.clearAllCookies(),document.cookie="username="+t.username,document.cookie="token="+e,"function"==typeof n&&n(e,a)}).catch(function(e){"function"==typeof o&&o(e,a)})},deleteCookie:function(e){document.cookie=e+"=; expires=Thu, 01 Jan 1970 00:00:01 GMT;"},clearAllCookies:function(){this.deleteCookie("token"),this.deleteCookie("username")},handleErrors:function(e){if(!e.ok)throw Error(e.statusText);return e}},created:function(){}},w={name:"SubmitAComplaint",props:{},mixins:[k],components:{"leaflet-map":_},data:function(){return{newComplaint:{username:"",password:"",category:"",severity:"",latitude:0,longitude:0,comments:"",imageUP:null,audioUP:null},returnParty:"Police",lookupAddress:"",provider:null,formIndex:0,endFormIndex:4,myCredentials:{username:"",password:""},imageUpload:null,audioUpload:null,formSteps:["login","category","location","submit","done"],categories:[{key:1,value:"Street Noise"},{key:2,value:"Private Celebration"},{key:3,value:"Bar/Restaurant"},{key:4,value:"Construction"}],noiseGuardCategories:["Bar/Restaurant","Construction"]}},methods:{searchAddress:function(){var e=this;return p()(u.a.mark(function t(){var n,o;return u.a.wrap(function(t){for(;;)switch(t.prev=t.next){case 0:return n=document.getElementById("addressBox").value,t.next=3,e.provider.search({query:n});case 3:o=t.sent,e.newComplaint.longitude=o[0].x,e.newComplaint.latitude=o[0].y;case 6:case"end":return t.stop()}},t,e)}))()},isNoiseGuard:function(e){for(var t=this.noiseGuardCategories,n=0;n<t.length;n++)if(e===t[n])return!0;return!1},onNoiseGuardSelected:function(){this.isNoiseGuard(this.newComplaint.category)?this.returnParty="Noise Guard":this.returnParty="Police"},getUserLocation:function(){var e,t=this;e=function(e){null!=e&&(t.newComplaint.latitude=e.coords.latitude,t.newComplaint.longitude=e.coords.longitude)},navigator.geolocation?navigator.geolocation.getCurrentPosition(e):e(null)},backButtonPressed:function(){this.formIndex>0&&(this.formIndex=this.formIndex-1)},nextButtonPressed:function(){this.formIndex<this.endFormIndex-1&&(this.onNoiseGuardSelected(),"Noise Guard"===this.returnParty?this.formIndex=4:this.formIndex=this.formIndex+1)},onDragMapCoords:function(e){this.newComplaint.latitude=e.latCoord,this.newComplaint.longitude=e.longCoord},onImageSelected:function(e){this.imageUpload=e.target.files[0],this.newComplaint.imageUP=this.imageUpload},onAudioSelected:function(e){this.audioUpload=e.target.files[0],this.newComplaint.audioUP=this.audioUpload},submitComplaint:function(e,t){this.formIndex===this.endFormIndex-1&&(this.sendToDatabase(e,t),this.formIndex=this.formIndex+1)},sendToDatabase:function(e,t){k.methods.postToComplaints(this.$api,t,function(e,t){console.log("Complaint Success")},function(e,t){console.log(e)},this)},getCookie:function(e){for(var t=e+"=",n=decodeURIComponent(document.cookie).split(";"),o=0;o<n.length;o++){for(var a=n[o];" "===a.charAt(0);)a=a.substring(1);if(0===a.indexOf(t))return console.log(a.substring(t.length,a.length)),a.substring(t.length,a.length)}return""},checkForToken:function(){return this.myCredentials.token=this.getCookie("token"),console.log(this.myCredentials.token),this.myCredentials.token.length>0}},created:function(){},mounted:function(){this.provider=new C.OpenStreetMapProvider}},x={render:function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"greetings"},[n("h1",[e._v("Submit A Complaint")]),e._v(" "),n("md-steppers",{attrs:{"md-active-step":e.formSteps[e.formIndex],"md-linear":""}},[n("md-step",{attrs:{id:e.formSteps[0],"md-description":e.formIndex[0],"md-label":e.formIndex[0],"md-done":e.formIndex>0},on:{click:function(t){e.formIndex=0}}},[0===e.formIndex?[e.checkForToken()?e._e():[n("h2",[e._v("You must be logged in to submit a complaint.")]),e._v(" "),n("router-link",{attrs:{to:"Login"}},[e._v("You can log in here")])],e._v(" "),e.checkForToken()?[n("h2",[e._v("You are currently logged in as: "+e._s(e.getCookie("username")))]),e._v(" "),n("span",{staticStyle:{"text-align":"center"}},[e._v("Press next to continue")])]:e._e()]:e._e()],2),e._v(" "),n("md-step",{attrs:{id:e.formSteps[1],"md-label":e.formIndex[1],"md-done":e.newComplaint.category.length>1},on:{click:function(t){e.formIndex=1}}},[1===e.formIndex?[n("md-field",[n("label",[e._v("Category")]),e._v(" "),n("md-select",{attrs:{name:"category",id:"category"},model:{value:e.newComplaint.category,callback:function(t){e.$set(e.newComplaint,"category",t)},expression:"newComplaint.category"}},[n("md-option",{attrs:{disabled:"",value:""}},[e._v("Select Category")]),e._v(" "),e._l(e.categories,function(t){return n("md-option",{key:t.key,attrs:{value:t.value}},[e._v("\n              "+e._s(t.value)+"\n            ")])})],2)],1)]:e._e()],2),e._v(" "),n("md-step",{attrs:{id:e.formSteps[2],"md-label":e.formIndex[2],"md-done":0!==e.newComplaint.latitude&&0!==e.newComplaint.longitude},on:{click:function(t){e.formIndex=2}}},[2===e.formIndex?[n("br"),e._v(" "),n("md-field",[n("label",[e._v("Location (Search by Address):")]),e._v(" "),n("md-input",{attrs:{id:"addressBox"}}),e._v(" "),n("span",{staticClass:"md-helper-text"},[e._v("e.g. Regnbuepladsen 7")])],1),e._v(" "),n("md-button",{staticClass:"md-raised",on:{click:function(t){e.searchAddress(e.lookupAddress)}}},[e._v("Search")]),e._v(" "),n("span",{staticStyle:{"text-align":"center"},attrs:{id:"locationDisplay"}},[e._v("Please drag the arrow to your location.")]),e._v(" "),n("leaflet-map",{attrs:{id:"myMap",newCoords:{latitude:e.newComplaint.latitude,longitude:e.newComplaint.longitude}},on:{coordsChanged:e.onDragMapCoords}})]:e._e()],2),e._v(" "),n("md-step",{attrs:{id:e.formSteps[3],"md-label":e.formIndex[3],"md-done":e.formIndex>3},on:{click:function(t){e.formIndex=3}}},[3===e.formIndex?[n("md-field",[n("label",[e._v("Comments:")]),e._v(" "),n("md-textarea",{model:{value:e.newComplaint.comments,callback:function(t){e.$set(e.newComplaint,"comments",t)},expression:"newComplaint.comments"}})],1),e._v(" "),n("md-field",[n("label",[e._v("Image")]),e._v(" "),n("md-file",{attrs:{accept:"image/*",placeholder:"Upload image file..."},on:{change:e.onImageSelected}})],1),e._v(" "),n("md-field",[n("label",[e._v("Audio")]),e._v(" "),n("md-file",{attrs:{accept:"audio/*",placeholder:"Upload audio file..."},on:{change:e.onAudioSelected}})],1)]:e._e()],2),e._v(" "),n("md-step",{attrs:{id:e.formSteps[4],"md-label":e.formIndex[4]},on:{click:function(t){e.formIndex=4}}},[e.formIndex===e.endFormIndex&&"Police"===e.returnParty?[n("h3",[e._v("Thank you")]),e._v(" "),n("p",[e._v("Your complaint has been submitted")]),e._v(" "),n("P",[e._v("If you require immediate action, please call the police at 114.")])]:e._e(),e._v(" "),e.formIndex===e.endFormIndex&&"Noise Guard"===e.returnParty?[n("h3",[e._v("Thank you")]),e._v(" "),n("p",[e._v("Thank you for your submission. However we do not accept complaints related to:")]),e._v(" "),n("ul",{attrs:{id:"NGlist"}},[n("li",[e._v("Musical noise from event (no restorations)")]),e._v(" "),n("li",[e._v("Music noise from restaurants")]),e._v(" "),n("li",[e._v("Music noise due to open doors / windows")]),e._v(" "),n("li",[e._v("Noise from construction site (not Metro)")]),e._v(" "),n("li",[e._v("Noise from facade renovation")]),e._v(" "),n("li",[e._v("Noise from supply (construction site)")]),e._v(" "),n("li",[e._v("Noise from Goods Delivery (Retail)")]),e._v(" "),n("li",[e._v("Noise from ventilation or similar")]),e._v(" "),n("li",[e._v("Noisy work outside allowed time (Construction site)...")]),e._v(" "),n("li",[e._v("Other Noise Generations (No Construction Site)")])]),e._v(" "),n("p",[e._v("If you would like to submit a complaint about noise being generated by one of these sources, please visit\n          the København Kommune’s noise complaint form via this link:\n          "),n("a",{attrs:{href:"https://www.kk.dk/støj"}},[e._v("https://www.kk.dk/støj")])]),e._v(" "),n("p",[e._v("If you would like to submit a complaint about noise generated by cafes, restaurants, events or other\n          venues, please contact the Noise Unit or Noise Guard.")]),e._v(" "),n("p",[e._v("Noise Unit: Man-Tors 9:00-15:00. Tel. 26 86 58 27")]),e._v(" "),n("p",[e._v("Noise Guard: Tors 19:00-01:00, Fre-Lør 21:00-03:00. Tel. 33 66 25 85")])]:e._e()],2)],1),e._v(" "),n("br"),e._v(" "),n("div",[e.formIndex>0&&e.formIndex<e.endFormIndex?[n("md-button",{staticClass:"md-raised md-primary",on:{click:function(t){e.backButtonPressed()}}},[e._v("Back")])]:e._e(),e._v(" "),e.formIndex<e.endFormIndex-1&&e.getCookie("username").length>0?[n("md-button",{staticClass:"md-raised md-primary",on:{click:function(t){e.nextButtonPressed()}}},[e._v("Next")])]:e._e(),e._v(" "),e.formIndex===e.endFormIndex-1?[n("md-button",{staticClass:"md-raised md-primary",on:{click:function(t){e.submitComplaint(e.myCredentials,e.newComplaint)}}},[e._v("Submit\n      ")])]:e._e()],2)],1)},staticRenderFns:[]};var I=n("VU/8")(w,x,!1,function(e){n("AitT")},"data-v-e49bc78e",null).exports,T={render:function(){this.$createElement;this._self._c;return this._m(0)},staticRenderFns:[function(){var e=this,t=e.$createElement,o=e._self._c||t;return o("div",[o("h1",[e._v("About")]),e._v(" "),o("p",[e._v("This app was developed for the purpose of collecting data on noise disturbances throughout the city of\n    Copenhagen. Each complaint submitted through this app will be entered into a database that will help create\n    a deeper understanding of the nightlife noise problem in Copenhagen. We hope that the data collected by this\n    app will help raise awareness of the nightlife noise problem, and provide evidence to promote changes in the\n    way that noise complaints are handled.")]),e._v(" "),o("h2",[e._v("Developed by:")]),e._v(" "),o("p",[e._v("Christopher Cyr, Brent Reissman, Michael Taylor and Chad Underhill,\n    from the Worcester Polytechnic Institute under the guidance and supervision of Centerleader\n    Marianne Spang Bech from Miljøpunkt Indre By and Christianshavn")]),e._v(" "),o("img",{attrs:{alt:"WPIxMiljopunkt",src:n("Jq5x")}})])}]};var U=n("VU/8")({name:"about"},T,!1,function(e){n("BZUQ")},"data-v-d28f4820",null).exports,N={name:"CreateAUser",mixins:[k],data:function(){return{myCredentials:{username:"",password:"",confirmPassword:"",firstName:"",lastName:""},errorMessage:"",invalidToken:!1,invalidCreation:!1}},methods:{createUser:function(e){k.methods.postToUsers(this.$api,e,function(t,n,o){var a={username:e.username,password:e.password,token:""};n.invalidCreation=!1;var i=function(e,t){console.log("Complaint Success"),t.invalidToken=!1,t.$router.push("/")};o.postToGetToken(n.$api,a,i,function(e,t){console.log(e),t.invalidToken=!0},n)},function(e,t){console.log(e),t.errorMessage=e.message,t.invalidCreation=!0},this)},getCookie:function(e){for(var t=e+"=",n=decodeURIComponent(document.cookie).split(";"),o=0;o<n.length;o++){for(var a=n[o];" "===a.charAt(0);)a=a.substring(1);if(0===a.indexOf(t))return console.log(a.substring(t.length,a.length)),a.substring(t.length,a.length)}return""},checkForToken:function(){return this.myCredentials.token=this.getCookie("token"),console.log(this.myCredentials.token),this.myCredentials.token.length>0}}},P={render:function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",[n("h1",[e._v("Register")]),e._v(" "),e.checkForToken()?[n("h2",[e._v("Please log out before creating a new account")]),e._v(" "),n("router-link",{attrs:{to:"Login"}},[e._v("Log out here")])]:e._e(),e._v(" "),e.checkForToken()?e._e():n("form",[n("md-field",[n("label",[e._v("Username:")]),e._v(" "),n("md-input",{attrs:{type:"text"},model:{value:e.myCredentials.username,callback:function(t){e.$set(e.myCredentials,"username",t)},expression:"myCredentials.username"}})],1),e._v(" "),n("md-field",[n("label",[e._v("Password:")]),e._v(" "),n("md-input",{attrs:{type:"password"},model:{value:e.myCredentials.password,callback:function(t){e.$set(e.myCredentials,"password",t)},expression:"myCredentials.password"}})],1),e._v(" "),n("md-field",[n("label",[e._v("Confirm Password:")]),e._v(" "),n("md-input",{attrs:{type:"password"},model:{value:e.myCredentials.confirmPassword,callback:function(t){e.$set(e.myCredentials,"confirmPassword",t)},expression:"myCredentials.confirmPassword"}}),e._v(" "),e.myCredentials.password!==e.myCredentials.confirmPassword?n("span",{staticStyle:{color:"darkred","margin-right":"35px","margin-top":"5px"}},[e._v("Passwords do not match")]):e._e()],1),e._v(" "),n("md-field",[n("label",[e._v("First Name:")]),e._v(" "),n("md-input",{attrs:{type:"text"},model:{value:e.myCredentials.firstName,callback:function(t){e.$set(e.myCredentials,"firstName",t)},expression:"myCredentials.firstName"}})],1),e._v(" "),n("md-field",[n("label",[e._v("Last Name:")]),e._v(" "),n("md-input",{attrs:{type:"text"},model:{value:e.myCredentials.lastName,callback:function(t){e.$set(e.myCredentials,"lastName",t)},expression:"myCredentials.lastName"}})],1),e._v(" "),n("md-button",{staticClass:"md-raised md-primary",attrs:{type:"button",value:"submit"},on:{click:function(t){e.createUser(e.myCredentials)}}},[e._v("Create")]),e._v(" "),e.invalidCreation?n("p",{staticClass:"err"},[e._v(e._s(e.errorMessage)+". The username may be taken. Please try again with a different username or at a later date")]):e._e(),e._v(" "),e.invalidToken?n("p",{staticClass:"err"},[e._v("Error: invalid token")]):e._e()],1)],2)},staticRenderFns:[]};var S=n("VU/8")(N,P,!1,function(e){n("HwEy")},"data-v-2c9d80ff",null).exports,A={name:"Login",mixins:[k],data:function(){return{myCredentials:{username:"",password:"",token:""},invalidToken:!1,loggedIn:!1}},methods:{login:function(){k.methods.postToGetToken(this.$api,this.myCredentials,function(e,t){console.log("Complaint Success"),t.invalidToken=!1,t.loggedIn=!0,t.$router.push("Login")},function(e,t){console.log(e),t.invalidToken=!0},this)},logout:function(){k.methods.clearAllCookies(),this.loggedIn=!1},getCookie:function(e){for(var t=e+"=",n=decodeURIComponent(document.cookie).split(";"),o=0;o<n.length;o++){for(var a=n[o];" "===a.charAt(0);)a=a.substring(1);if(0===a.indexOf(t))return console.log(a.substring(t.length,a.length)),a.substring(t.length,a.length)}return""},deleteCookie:function(e){document.cookie=e+"=; expires=Thu, 01 Jan 1970 00:00:01 GMT;"},checkForToken:function(){return this.myCredentials.token=this.getCookie("token"),console.log(this.myCredentials.token),this.myCredentials.token.length>0}},mounted:function(){this.loggedIn=this.checkForToken()},updated:function(){this.loggedIn=this.checkForToken()}},F={render:function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",[n("h1",[e._v("Account")]),e._v(" "),e.loggedIn?e._e():[n("md-field",[n("label",[e._v("Username:")]),e._v(" "),n("md-input",{model:{value:e.myCredentials.username,callback:function(t){e.$set(e.myCredentials,"username",t)},expression:"myCredentials.username"}})],1),e._v(" "),n("md-field",[n("label",[e._v("Password:")]),e._v(" "),n("md-input",{attrs:{type:"password"},model:{value:e.myCredentials.password,callback:function(t){e.$set(e.myCredentials,"password",t)},expression:"myCredentials.password"}})],1),e._v(" "),n("p",[e._v("Our website uses cookies to store your authentication details.")]),e._v(" "),n("md-button",{staticClass:"md-raised md-primary",on:{click:function(t){e.login()}}},[e._v("Log In")]),e._v(" "),e.invalidToken?n("p",{attrs:{id:"errorMsg"}},[e._v("Invalid username or password, please try again")]):e._e()],e._v(" "),e.loggedIn?[n("h1",[e._v("You are logged in as "+e._s(e.getCookie("username")))]),e._v(" "),n("md-button",{staticClass:"md-raised md-primary",on:{click:function(t){e.logout()}}},[e._v("Log Out")])]:e._e()],2)},staticRenderFns:[]};var M=n("VU/8")(A,F,!1,function(e){n("mfXK")},"data-v-71b68a96",null).exports;o.default.use(s.a);var L=new s.a({routes:[{path:"/",name:"MainMenu",component:d},{path:"/SubmitAComplaint",name:"SubmitAComplaint",component:I},{path:"/About",name:"About",component:U},{path:"/CreateAUser",name:"CreateAUser",component:S},{path:"/Login",name:"Login",component:M}]}),$=n("8+8L"),G=n("Lgyv"),R=n.n(G);n("4+hh"),n("Ii5r");o.default.use(R.a),o.default.use($.a),o.default.config.productionTip=!1;o.default.prototype.$api="http://18.197.28.234:8000",new o.default({el:"#app",router:L,components:{App:r},template:"<App/>"})},mfXK:function(e,t){}},["NHnr"]);