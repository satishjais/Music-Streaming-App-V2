export default {
  template: `
    <div>
      <header>
      <a href="/#/dashboard" class="btn btn-link">Go Back to Dashboard</a>
      </header>
      <h1 v-if="songs.length > 0">Creator Songs</h1>
      <h1 v-else>No songs uploaded yet</h1>
      <table v-if="songs.length > 0" class="table">
        <thead>
          <tr>
            <th>Song Name</th>
            <th>Artist</th>
            <th>Lyrics</th>
            <th>Edit</th>
            <th>Delete</th>
            <th>Flag Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="song in songs" :key="song.id">
            <td>{{ song.song_name }}</td>
            <td>{{ song.artist }}</td>
            <td><a :href="'/#/lyrics/' + song.id">Song lyrics</a></td>
            <td><router-link :to="'/edit_song/' + song.id" class="btn btn-primary">Edit Song</router-link></td>
            <td>
              <button @click="confirmDelete(song.id)" class="btn btn-danger">Delete</button>
            </td>
            <td>{{ song.flagged ? 'Flagged' : 'Not Flagged' }}</td>
          </tr>
        </tbody>
      </table>
      <router-link v-if="songs.length === 0" to="/upload_songs" class="btn btn-primary">Upload Songs from here</router-link>
      <router-link v-if="songs.length !== 0" to="/upload_songs" class="btn btn-primary">Upload More Songs</router-link>
    </div>
  `,
  data() {
    return {
      songs: [], 
      userId: parseInt(localStorage.getItem('userid')) 
    };
  },
  methods: {
    goBack() {
      this.$router.push('/dashboard');
    },
    async deleteSong(songId) {
      try {
        const response = await fetch(`/delete_song/${songId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (response.ok) {
          this.songs = this.songs.filter(song => song.id !== songId);
          console.log('Song deleted successfully');
        } else {
          throw new Error('Failed to delete song');
        }
      } catch (error) {
        console.error('Error deleting song:', error);
      }
    },
    confirmDelete(songId) {
      if (confirm('Are you sure you want to delete this song?')) {
        this.deleteSong(songId);
      }
    },
  },
  created() {
    fetch(`/api/user_songs/${this.userId}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch user songs');
        }
        return response.json();
      })
      .then(data => {
        this.songs = data;
      })
      .catch(error => {
        console.error('Error fetching user songs:', error);
      });
  },
};

