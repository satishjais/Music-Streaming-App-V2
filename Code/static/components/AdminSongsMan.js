export default {
    template: `
      <div>
        <header>
          <a href="/#/dashboard" class="btn btn-link">Go Back to Admin Dashboard</a>
        </header>
  
        <div v-if="songs.length === 0">
          <h1>No Songs Found</h1>
        </div>
        <div v-else>
          <h1>Admin Songs Management</h1>
          <table class="table">
            <thead>
              <tr>
                <th>Creator Code</th>
                <th>Name</th>
                <th>Artist</th>
                <th>Lyrics</th>
                <th>Genre</th>
                <th>Ratings</th>
                <th>Current Status</th>
                <th>Action</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="song in songs" :key="song.id">
                <td>{{ song.us_id }}</td>
                <td>{{ song.song_name }}</td>
                <td>{{ song.artist }}</td>
                <td><a :href="'/#/lyrics/' + song.id" class="text-info">Song lyrics</a></td>
                <td>{{ song.genre }}</td>
                <td :id="'ratings_' + song.id">{{ song.ratings.toFixed(1) }}</td>
                <td>{{ song.flagged ? "Flagged" : "Unflagged" }}</td>
                <td>
                  <select v-model="action">
                    <option value="flag">Flag</option>
                    <option value="unflag">Unflag</option>
                  </select>
                  <button @click="flagSong(song.id, action)" class="btn btn-primary">Confirm</button>
                </td>
                <td><button @click="deleteSong(song.id)" class="btn btn-danger">Delete</button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    `,
    data() {
      return {
        songs: [], 
        action: '', 
      };
    },
    created() {
      this.fetchSongs();
    },
    methods: {
      fetchSongs() {
        fetch('/admin/songs')
          .then(response => response.json())
          .then(data => {
            this.songs = data;
          })
          .catch(error => {
            console.error('Error fetching songs:', error);
          });
      },
      flagSong(songId, action) {
        fetch(`/admin/songs/${songId}/flag`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ action })
        })
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to flag/unflag song');
          }
          this.fetchSongs();
        })
        .catch(error => {
          console.error('Error flagging/unflagging song:', error);
        });
      },
      deleteSong(songId) {
        if (confirm('Are you sure you want to delete this song?')) {

        
        fetch(`/admin/songs/${songId}/delete`, {
          method: 'DELETE'
        })
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to delete song');
          }
          
          this.fetchSongs();
        })
        .catch(error => {
          console.error('Error deleting song:', error);
        });
    }
      }
    }
  };
  