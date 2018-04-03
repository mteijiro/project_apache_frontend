<template>
  <div id="app">
    <router-link to="/">Menu</router-link>
    <router-link to="SubmitAComplaint">Submit A Complaint</router-link>
    <router-link to="About">About</router-link>
    <br />
    <!--<img src="./assets/titleImageSmall.png">-->
    <h1>Noise Complaint App</h1>
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }
</style>
