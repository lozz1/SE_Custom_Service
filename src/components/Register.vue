<template>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet"
    integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
  <title>注册账号</title>
  <section class="vh-100 bg-image">
    <div class="mask d-flex align-items-center h-100 gradient-custom-3">
      <div class="container h-100">
        <div class="row d-flex justify-content-center align-items-center h-100">
          <div class="col-12 col-md-9 col-lg-7 col-xl-6">
            <div class="card" style="border-radius: 15px;">
              <div class="card-body p-5">
                <h2 class="text-uppercase text-center mb-5">创建账号</h2>

                <form class="needs-validation" @submit.prevent="handleRegister" novalidate>
                  <div class="form-floating mb-4">
                    <input type="text" id="form3Example1cg" class="form-control form-control-lg" @keyup="check()"
                      v-model="RegisterData.username" placeholder="输入账号" required />
                    <label class="form-label" for="form3Example1cg">账 号</label>
                    <span class = "mb-2" :class="[is_available ? 'bg-success' : 'alert-danger'] ">{{ message }}</span>
                    <div class="invalid-feedback">
                      账号不能为空
                    </div>
                  </div>

                  <div class="form-floating mb-4">
                    <input type="text" id="form3Example2cg" class="form-control form-control-lg"
                      v-model="RegisterData.realname" placeholder="输入姓名" required />
                    <label class="form-label" for="form3Example1cg">姓 名</label>
                    <div class="invalid-feedback">
                      姓名不能为空
                    </div>
                  </div>

                  <div class="form-floating mb-4">
                    <input type="text" id="form3Example3cg" class="form-control form-control-lg" placeholder="输入手机号"
                      v-model="RegisterData.phone" required />
                    <label class="form-label" for="form3Example3cg">手机号</label>
                    <div class="invalid-feedback">
                      手机号不能为空
                    </div>
                  </div>

                  <div class="form-floating mb-4">
                    <input type="password" id="form3Example4cg" class="form-control form-control-lg" placeholder="输入密码"
                      required />
                    <label class="form-label" for="form3Example4cg">密码</label>
                    <div class="invalid-feedback">
                      密码不能为空
                    </div>
                  </div>

                  <div class="d-flex justify-content-center">
                    <button type="submit" class="btn btn-block btn-lg gradient-custom-4 text-body">注册</button>
                    <div class="error-message">
                    </div>
                  </div>

                  <p class="text-center text-muted mt-5 mb-0">已经有账号了? <a href="#/login"
                      class="fw-bold text-body"><u>登录</u></a>
                  </p>

                </form>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import axios from 'axios';
export default {
  setup() {
    return {
      RegisterData: {
        username: '',
        realname: '',
        phone: '',
        password: '',
        type: ''
      },
      is_available: false,
      message: '账号名重复',
    };
  },
  methods: {
    async register() {
      // handle login logic here
      var url = 'http://localhost:8080/test001/register'
      const res = await axios.post(url, {
        username: JSON.stringify(this.RegisterData.username),
        password: JSON.stringify(this.RegisterData.password),
        type: JSON.stringify(this.RegisterData.type),
      })

        .then((res) => {
          var data = res.data
          if (data == 1) {
            this.$router.push('/chat');
            this.$store.dispatch('usr/')
          }
          else {
            errorMessage.innerHTML = '密码错误';
            errorMessage.classList.add('alert', 'alert-danger');
          }
        })

        .catch((error) => {
          this.error = error;
          console.log(error);
        })
    },
    handleRegister(e) {
      e.preventDefault();
      const form = e.target;
      const errorMessage = document.querySelector('#error-message');
      if (form.checkValidity()) {
        this.register();
      } else {
        form.classList.add("was-validated");
      }
    },
    check() {
      console.log("check called")
      var url = 'http://localhost:8080/test001/register'
      axios.post(url, {
        username: JSON.stringify(this.RegisterData.username)
      })

        .then((response) => {
          if (response.is_available == 'yes') {
            this.is_available = true
          }
          else {
            this.is_available = false
            this.message = "账号名重复"
          }
        })
    }
  },
}

</script>



<style scoped>
.gradient-custom-3 {
  /* fallback for old browsers */
  background: #84fab0;

  /* Chrome 10-25, Safari 5.1-6 */
  background: -webkit-linear-gradient(to right, rgba(132, 250, 176, 0.5), rgba(143, 211, 244, 0.5));

  /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
  background: linear-gradient(to right, rgba(132, 250, 176, 0.5), rgba(143, 211, 244, 0.5))
}

.gradient-custom-4 {
  /* fallback for old browsers */
  background: #84fab0;

  /* Chrome 10-25, Safari 5.1-6 */
  background: -webkit-linear-gradient(to right, rgba(132, 250, 176, 1), rgba(143, 211, 244, 1));

  /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
  background: linear-gradient(to right, rgba(132, 250, 176, 1), rgba(143, 211, 244, 1))
}
</style>