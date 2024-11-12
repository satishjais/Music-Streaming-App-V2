export default {
    template: `
      <div>
        <h1>Upload Songs</h1>
        <form @submit.prevent="uploadSong">
          <div class="form-group">
            <label for="songName">Song Name:</label>
            <input type="text" v-model="songName" id="songName" class="form-control" required>
          </div>
          <div class="form-group">
            <label for="artist">Artist:</label>
            <input type="text" v-model="artist" id="artist" class="form-control" required>
          </div>
          <div class="form-group">
            <label for="genre">Genre:</label>
            <input type="text" v-model="genre" id="genre" class="form-control" required>
          </div>
          <div class="form-group">
            <label for="lyrics">Lyrics:</label>
            <textarea v-model="lyrics" id="lyrics" class="form-control" rows="4" required></textarea>
          </div>
          <button type="submit" class="btn btn-primary">Upload Song</button>
        </form>
      </div>
    `,
    data() {
      return {
        songName: '',
        artist: '',
        genre: '',
        lyrics: '',
        userId: parseInt(localStorage.getItem('userid'))
      };
    },
    methods: {
      async uploadSong() {
        if (!this.songName.trim() || !this.artist.trim() || !this.genre.trim() || !this.lyrics.trim()) {
          console.error('All fields are required');
          return;
        }
  
        try {
          const response = await fetch('/api/upload_song', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              song_name: this.songName,
              artist: this.artist,
              genre: this.genre,
              lyrics: this.lyrics,
              user_id: this.userId
            }),
          });
  
          if (!response.ok) {
            throw new Error('Failed to upload song');
          }
  
          this.$router.push(`/creator_songs/${this.userid}`);
        } catch (error) {
          console.error('Error uploading song:', error);
        }
      },
    },
  };
  