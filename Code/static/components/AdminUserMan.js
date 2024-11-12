export default {
    template: `
      <div>
      <header>
          <a href="/#/dashboard" class="btn btn-link">Go Back to Admin Dashboard</a>
        </header>
        <div v-if="users.length === 0">
          <h1>No Users Found</h1>
        </div>
        <div v-else>
          <h1>Creators</h1>
          <table class="table">
            <thead class="thead-dark">
              <tr>
                <th>Creator Code</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Current Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in users" :key="user.id">
                <td>{{ user.id }}</td>
                <td>{{ user.username }}</td>
                <td>{{ user.email }}</td>
                <td>{{ user.roles.join(', ') }}</td>
                <td>{{ user.blacklisted ? "Blacklisted" : "Whitelisted" }}</td>
                <td>
                  <select v-model="selectedAction">
                    <option value="blacklist">Blacklist</option>
                    <option value="whitelist">Whitelist</option>
                  </select>
                  <button @click="confirmAction(user.id)" class="btn btn-primary">Confirm</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    `,
    data() {
      return {
        users: [],
        selectedAction: 'blacklist' 
      };
    },
    created() {
      this.fetchUsers();
    },
    methods: {
      async fetchUsers() {
        try {
          const response = await fetch('/api/admin/users/creator');
          if (!response.ok) {
            throw new Error('Failed to fetch users');
          }
          this.users = await response.json();
        } catch (error) {
          console.error('Error fetching users:', error);
        }
      },
      async confirmAction(userId) {
        try {
          const response = await fetch(`/api/admin/blacklist/${userId}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ action: this.selectedAction })
          });
          if (!response.ok) {
            throw new Error('Failed to perform action');
          }
          
          this.fetchUsers();
        } catch (error) {
          console.error('Error performing action:', error);
        }
      }
    }
  };
  