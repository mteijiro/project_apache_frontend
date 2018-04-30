<template>
  <div>
    <!--<img src="../assets/titleImageSmall.png" width="250vh" height="250vh">-->
    <h1>{{$lang.MainMenu.welcome}}</h1>
    <p>{{$lang.MainMenu.intro_paragraph2}}</p>
    <p>{{$lang.MainMenu.secondary_paragraph}}</p>
    <h2>{{$lang.MainMenu.disclaimer}}</h2>
    <p>{{$lang.MainMenu.security_paragraph}}</p>
    <router-link to="TermsOfService">{{$lang.MainMenu.terms_of_service}}</router-link>
    <br />
    <router-link to="CookiePolicy">{{$lang.MainMenu.cookie_policy}}</router-link>
    <br />
    <router-link to="PrivacyPolicy">{{$lang.MainMenu.privacy_policy}}</router-link>
  </div>
</template>

<script>
export default {
  name: 'main-menu'
}
</script>

<style scoped>
</style>
