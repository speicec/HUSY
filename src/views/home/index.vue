<template>
  <div class="home-container">
    <h1>这是 home 页面</h1>
    <div>

      <router-link to="/permissions">点我去permissions</router-link>
    </div>
  </div>
</template>

<style scoped>
    .home-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh; /* 高度为视口高度 */
    text-align: center;
    flex-direction: column;
}
</style>
