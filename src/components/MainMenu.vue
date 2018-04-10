<template>
  <div>
    <h2>Main Menu</h2>
    <router-link to="SubmitAComplaint">Submit A Complaint</router-link>
    <br />
    <router-link to="About">About</router-link>
    <br />
    <router-link to="CreateAUser">Create A User</router-link>
    <br />
    <router-link to="Login">Login</router-link>
    <br />
    <h2>Welcome!</h2>
    <p>Welcome to the Noise Complaint App! This app serves two purposes: to help inform about Copenhagen’s noise complaint process and to collect nightlife noise complaint data. The app will walk you through the process of submitting a noise complaint. Currently, we are only accepting noise complaints pertaining to street noise and private celebrations; however, the app will walk you through the process of submitting any other type of noise complaint to the proper authorities.</p>
    <p>For the testing period, we ask you to create a username and password that will allow you into the noise complaint system. Please visit the create an account tab at the top of the screen to do so.</p>
    <p>Please note that this app is not finished yet and is currently being worked on. Before our system becomes available to the public we will be clearing the database of all complaints, and accounts created during the testing period. However, please refrain from submitting any personal information in a complaint as we are still actively improving the data security systems.</p>
    <h3>Disclaimer</h3>
    <p>Your noise complaint submission will be sent to our database for noise disturbance data collection. For any emergencies, please contact the Police at 112.</p>
  </div>
</template>

<script>
export default {
  name: 'main-menu'
}
</script>

<style scoped>
</style>
