export default {
    template: `
      <div>
        <header>
          <router-link :to="'/creator_songs/' + userid" class="btn btn-link">Go back to Your Songs</router-link>
        </header>

        <h1>Edit Song</h1>
        <form @submit.prevent="updateSong">
          <div class="form-group">
            <label for="songName">Song Name:</label>
            <input type="text" v-model="song.song_name" id="songName" class="form-control" required>
          </div>
          <div class="form-group">
            <label for="artist">Artist:</label>
            <input type="text" v-model="song.artist" id="artist" class="form-control" required>
          </div>
          <div class="form-group">
            <label for="genre">Genre:</label>
            <input type="text" v-model="song.genre" id="genre" class="form-control" required>
          </div>
          <div class="form-group">
            <label for="lyrics">Lyrics:</label>
            <textarea v-model="song.lyrics" id="lyrics" class="form-control" rows="4" required></textarea>
          </div>
          <button type="submit" class="btn btn-primary">Update Song</button>
        </form>
      </div>
    `,
    data() {
      return {
        song: {}, 
        songId: this.$route.params.id, 
        userid: parseInt(localStorage.getItem('userid')) 
      };
    },
    methods: {
      async updateSong() {
        try {
          const response = await fetch(`/update_song/${this.songId}`, {
            method: 'PUT', 
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(this.song),
          });
          
          if (response.ok) {
            console.log('Song updated successfully');
            this.$router.push(`/creator_songs/${this.userid}`);
          } else {
            throw new Error('Failed to update song');
          }
        } catch (error) {
          console.error('Error updating song:', error);
        }
      },
      async fetchSong() {
        try {
          const response = await fetch(`/api/song/${this.songId}`);
          if (!response.ok) {
            throw new Error('Failed to fetch song');
          }
          this.song = await response.json();
        } catch (error) {
          console.error('Error fetching song:', error);
        }
      },
    },
    created() {
      this.fetchSong(); 
    },
};
