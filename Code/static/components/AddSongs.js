export default {
    template: `
      <div>
        <h1>Add Songs to Playlist</h1>
        <form @submit.prevent="addSongToPlaylist">
          <label for="songSelect">Select Song:</label>
          <select v-model="selectedSong" id="songSelect" class="form-control">
            <option v-for="song in songs" :key="song.id" :value="song.id">{{ song.song_name }}</option>
          </select>
          <button type="submit" class="btn btn-primary">Add Song</button>
        </form>
      </div>
    `,
    data() {
      return {
        selectedSong: null,
        songs: [],
        playlistId: this.$route.params.id, 
        userid: parseInt(localStorage.getItem('userid'))
      };
    },
  
    created() {
      this.fetchSongs();
    },
  
    methods: {
      async fetchSongs() {
        try {
          const response = await fetch('/songs');
          if (response.ok) {
            this.songs = await response.json();
          } else {
            console.error('Failed to fetch songs');
          }
        } catch (error) {
          console.error('Error fetching songs:', error);
        }
      },
  
      async addSongToPlaylist() {
        if (!this.selectedSong) {
          console.error('Please select a song');
          return;
        }
  
        try {
          const response = await fetch(`/api/your_playlist/${this.playlistId}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ song_id: this.selectedSong, user_id : this.userid}),
          });
  
          if (!response.ok) {
            const errorMessage = await response.json(); 
            throw new Error(errorMessage.error); 
          }
  

          this.$router.push(`/your_playlist/${this.userid}`);
        } catch (error) {
          console.error('Error adding song to playlist:', error);
          alert(error.message); 
        }
      },
    },
  };
  