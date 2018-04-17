<template>
  <div>
    <!--<img src="../assets/titleImageSmall.png" width="250vh" height="250vh">-->
    <h1>{{$lang.MainMenu.welcome}}</h1>
    <p>{{$lang.MainMenu.intro_paragraph}}</p>
    <p>{{$lang.MainMenu.testing_paragraph1}}</p>
    <p>{{$lang.MainMenu.testing_paragraph2}}</p>
    <h2>{{$lang.MainMenu.disclaimer}}</h2>
    <p>{{$lang.MainMenu.disclaimer_paragraph}}</p>
  </div>
</template>

<script>
export default {
  name: 'main-menu'
}
</script>

<style scoped>
</style>
