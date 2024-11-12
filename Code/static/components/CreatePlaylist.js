// CreatePlaylist.js
export default {
    template: `
      <div>
        <h1>Create Playlist</h1>
        <form @submit.prevent="createPlaylist">
          <label for="playlistName">Playlist Name:</label>
          <input type="text" v-model="playlistName" id="playlistName" class="form-control">
          <button type="submit" class="btn btn-primary">Create Playlist</button>
        </form>
      </div>
    `,
    data() {
      return {
        playlistName: '',
        error: null,
        userid : parseInt(localStorage.getItem('userid'))
      };
    },

    methods: {
      async createPlaylist() {
        if (!this.playlistName.trim()) {
          console.error('Playlist name is required');
          return;
        }
  
        try {
          const response = await fetch('/api/create_playlist', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: this.playlistName, user_id: this.userid }),
          });
  
          if (!response.ok) {
            throw new Error('Playlist with this name already exist');
          }
  
          this.$router.push(`/your_playlist/${this.userid}`);
        } catch (error) {
          console.error('Error creating playlist:', error);
          alert(error.message);
        }
      },
    },
  };
  