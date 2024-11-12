const AdminDashTemplate = `
<div v-if="adminData">
<div class="row">
  <div class="col-md-2 bg-dark">
    <nav class="navbar navbar-dark">
      <ul class="navbar-nav flex-column">
        <li class="nav-item">
          <a class="nav-link text-light" href="#" @click="logout">Logout</a>
        </li>
        <li class="nav-item">
          <a class="nav-link text-light" href="/#/admin_songs_man">Song Management</a>
        </li>
        <li class="nav-item">
          <a class="nav-link text-light" href="/#/admin_users_man">Creator Management</a>
        </li>
        <li class="nav-item">
          <a class="nav-link text-light" href="/#/admin_album_man">Album Management</a>
        </li>
      </ul>
    </nav>
  </div>
  <div class="col-md-10 bg-light"> <!-- Changed background color to light -->
    <header>
      <h1>Admin Dashboard</h1>
    </header>
    <div id="statistics">
      <h2>App Statistics</h2>
      <p>Total Users: {{ adminData.userCount - 1 }}</p>
      <p>Total Listeners: {{ adminData.listenerCount }}</p>
      <p>Total Creators: {{ adminData.creatorCount }}</p>
      <p>Blacklisted Creators: {{ adminData.blacklistedCreatorCount }}</p>
    </div>

    <div id="performance">
      <h2>Song Data</h2>
      <p>Total Song: {{ adminData.songCount }}</p>
      <p>Flagged Songs: {{ adminData.flaggedSongCount }}</p>
      <h2>Top Performing Songs</h2>
      <table class="table">
        <thead class="thead-dark">
          <tr>
            <th>Ranking</th>
            <th>Name</th>
            <th>Current Rating</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(song, index) in adminData.topSongs" :key="song.id">
            <td>{{ index + 1 }}</td>
            <td>{{ song.song_name }}</td>
            <td>{{ song.ratings.toFixed(1) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</div>
</div>
  `
;

const AdminDash = {
  template: AdminDashTemplate,
  data() {
    return {
      adminData: null
    };
  },
  created() {
    this.fetchAdminData();
  },
  methods: {
    logout() {
        if (confirm("Are you sure you want to log out?")) {
        localStorage.removeItem('auth-token');
        localStorage.removeItem('role');
        localStorage.removeItem('userid')
        this.$router.push('/login');
        }
    },
    async fetchAdminData() {
      try {
        const response = await fetch('/api/admin_dashboard_data');
        const data = await response.json();
        this.adminData = data;
      } catch (error) {
        console.error('Error fetching admin dashboard data:', error);
      }
    }
  }
};

export default AdminDash;
