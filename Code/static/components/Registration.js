export default {
    template: `
    <div class='d-flex justify-content-center' style="margin-top: 25vh">
      <div class="mb-3 p-5 bg-light">
          <h1> Registrations </h1>
          <div class='text-danger'>*{{error}}</div>
          <label for="user-username" class="form-label">Username</label>
          <input type="text" class="form-control" id="user-username" v-model="cred.username">
          <label for="user-email" class="form-label">Email address</label>
          <input type="email" class="form-control" id="user-email" placeholder="name@example.com" v-model="cred.email">
          <label for="user-password" class="form-label">Password</label>
          <input type="password" class="form-control" id="user-password" v-model="cred.password">
          <button class="btn btn-primary mt-2" @click='register'> Register </button>
          <a href="/#/login">Already have an account? Login from here</a>
      </div> 
    </div>
    `,
    data() {
      return {
        cred: {
          username: null,
          email: null,
          password: null,
        },
        error: null, 
      }
    },
    methods: {
      async register() {
        const res = await fetch('/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(this.cred),
        })
        const data = await res.json()
        if (res.ok) {
          this.$router.push({ path: '/login'})
        } else {
          this.error = data.error || data.message;
        }
      },
    },
  }
