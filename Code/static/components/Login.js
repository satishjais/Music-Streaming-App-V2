export default {
    template: `
      <div class='d-flex justify-content-center' style="margin-top: 25vh">
        <div class="mb-3 p-5 bg-light">
            <div class='text-danger'>*{{error}}</div>
            <h1> Welcome to Music Streaming App</h1>
            <label for="user-email" class="form-label">Email address</label>
            <input type="email" class="form-control" id="user-email" placeholder="name@example.com" v-model="cred.email">
            <label for="user-password" class="form-label">Password</label>
            <input type="password" class="form-control" id="user-password" v-model="cred.password">
            <button class="btn btn-primary mt-2" @click='login' > Login </button>
            <a href="/#/registration" class="d-block mt-2">Don't have an account? Register from here</a>
        </div> 
      </div>
    `
  ,
    data() {
      return {
        cred: {
          email: null,
          password: null,
        },
        error: null, 
        // pehle se no error pe set
      }
    },
    methods: {
      async login() {
        const res = await fetch('/user-login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(this.cred),
        })
        const data = await res.json()
        if (res.ok) {
          localStorage.setItem('auth-token', data.token)
          localStorage.setItem('role', data.role)
          localStorage.setItem('userid', data.id)
          this.$router.push({ path: '/dashboard'})
        } else{
            this.error=data.message
        }
      },
    },
  }