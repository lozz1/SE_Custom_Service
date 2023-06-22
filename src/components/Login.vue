<template>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet"
    integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">

  <title>客服登录</title>
  <section class="vh-100">
    <div class="container-fluid h-custom">
      <div class="row d-flex justify-content-center align-items-center h-100">
        <div class="col-md-9 col-lg-6 col-xl-5">
          <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp" class="img-fluid"
            alt="Sample image">
        </div>
        <div class="col-md-8 col-lg-6 col-xl-4 offset-xl-1">
          <form class="needs-validation" @submit.prevent="handleLogin" novalidate>
            <!-- Id input -->
            <div class="form-floating mb-4 has-validation">
              <input type="text" id="form3Example3" class="form-control form-control-lg" v-model="loginData.username"
                placeholder="输入账号" required />
              <label class="form-label" for="form3Example3">账 号</label>
              <div class="invalid-feedback">
                账号不能为空
              </div>
            </div>

            <!-- Password input -->
            <div class="form-floating mb-4">
              <input type="password" id="form3Example4" class="form-control form-control-lg" v-model="loginData.password"
                placeholder="输入密码" required />
              <label class="form-label" for="form3Example4">密 码</label>
              <div class="invalid-feedback">
                密码不能为空
              </div>
              <div id="error-message" class="mt-3">
              </div>
            </div>
            <div class="form-check mb-2">
              <input class="form-check-input" type="radio" name="flexRadioDefault" value="service"
                v-model="loginData.type">
              <label class="form-check-label" for="flexRadioDefault1">
                客服登录
              </label>
            </div>
            <div class="form-check mb-2">
              <input class="form-check-input" type="radio" name="flexRadioDefault" value="patient"
                v-model="loginData.type">
              <label class="form-check-label" for="flexRadioDefault2">
                患者登录
              </label>
            </div>
            <div class="text-center text-lg-start mt-4 pt-2">
              <button type="submit" class="btn btn-primary btn-lg"
                style="padding-left: 2.5rem; padding-right: 2.5rem;">登录</button>
              <p class="medium fw-bold mt-2 pt-1 mb-0">还没有账号？<a href="#/registration" class="link-danger">注册</a>
              </p>
            </div>

          </form>
        </div>
      </div>
    </div>
    <div
      class="d-flex flex-column flex-md-row text-center text-md-start justify-content-between py-4 px-4 px-xl-5 bg-primary">

      <!-- Right -->
      <div>
        <a class="text-white me-4">
        </a>
      </div>
      <!-- Right -->
    </div>
  </section>
</template>

<script>
import axios from 'axios';
axios.defaults.withCredentials = true;
export default {
  setup() {
    return {
      loginData: {
        username: '',
        password: '',
        type: ''
      },
    };
  },
  methods: {
    async login() {
      // handle login logic here
      var url = 'https://yejsgk.top:443/back/demo2/login-test'
      const res = await axios.post(url, {
        username: this.loginData.username,
        password: this.loginData.password,
        type: this.loginData.type,
      })

        .then((res) => {
          var data = res.data
          if (data.state == 1) {
            if (this.loginData.type == 'patient') {
              this.$router.push('/chat');
              this.$store.dispatch('userModule/addPatientId', { username: this.loginData.username });
            }
            // 客服登录
          }
          else {
            const errorMessage = document.querySelector('#error-message');
            errorMessage.innerHTML = '账号或者密码错误';
            errorMessage.classList.add('alert', 'alert-danger');
          }
        })

        .catch((error) => {
          this.error = error;
          console.log(error);
        })
    },
    register() {
      this.$router.push('/registration')
    },
    handleLogin(e) {
      // this.$router.push('/chat')
      e.preventDefault();
      const form = e.target;
      if (form.checkValidity()) {
        this.login();
      } else {
        form.classList.add("was-validated");
      }
    }
  },
};
</script>

<style scoped>
.divider:after,
.divider:before {
  content: "";
  flex: 1;
  height: 1px;
  background: #eee;
}

.h-custom {
  height: calc(100% - 73px);
}

@media (max-width: 450px) {
  .h-custom {
    height: 100%;
  }
}
</style>