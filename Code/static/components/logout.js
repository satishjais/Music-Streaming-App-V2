export default {
    template: `<li v-if="is_login">
          <button @click='logout' >logout</button>
        </li>`,
        data() {
            return {
              role: localStorage.getItem('role'),
              is_login: localStorage.getItem('auth-token'),
              userid : localStorage.getItem('userid')
            }
          },
          methods: {
            logout() {
              if (confirm('Are you sure you want to log out?')) {
                localStorage.removeItem('auth-token')
                localStorage.removeItem('role')
                localStorage.removeItem('userid')
                this.$router.push({ path: '/login' })
              }
            }
          }
    }
