<template>
  <div id="app" class="app-containt">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App',
  created() {
    // 在页面加载时读取sessionStorage
    if (sessionStorage.getItem('store')) {
      this.$store.replaceState(Object.assign({}, this.$store.state, JSON.parse(sessionStorage.getItem('store'))))
    }
    // 在页面刷新时将store保存到sessionStorage里
    window.addEventListener('beforeunload', () => {
      sessionStorage.setItem('store', JSON.stringify(this.$store.state))
    })
  }
}
</script>

<style>
.login {
  width: 400px;
  margin: 200px auto;
  border: 10px solid #efefef;
  padding: 30px;
  border-radius: 20px;
}

h4 {
  text-align: center;
}

.customer_service_btn {
  width: 40%;
}

.patient_btn {
  width: 40%;
}
</style>
