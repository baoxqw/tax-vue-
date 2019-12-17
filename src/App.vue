<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style lang="less">
  html,
  body {
    height: 100vh;
    width: 100%;
  }

  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    height: 100%;
    width: 100%;
    overflow: hidden;
    color: #2c3e50;
  }
</style>
