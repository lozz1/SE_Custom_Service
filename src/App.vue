<template>
  <div id="app" class="app-containt">
    <router-view ></router-view>
  </div>
</template>

<script>
export default {
  name: 'App',
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
