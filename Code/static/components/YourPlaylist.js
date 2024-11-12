// YourPlaylist.js
export default {
    template: `
      <div>
        <div v-if="user.role === 'creator'">
          <header>
            <a href="/#/dashboard" class="btn btn-link">Go Back to Dashboard</a>
          </header>
        </div>
        <div v-else>
          <header>
            <a href="/#/dashboard" class="btn btn-link">Go Back to Dashboard</a>
          </header>
        </div>
  
        <div v-if="playlist.length === 0">
          <h1>No Playlist Found</h1>
          <a href="/#/create_playlist" class="btn btn-primary">Create a Playlist from here</a>
        </div>
        <div v-else>
          <h1>Your Playlists</h1>
          <table class="table">
            <thead>
              <tr>
                <th>Playlist Name</th>
                <th>Action</th>
                <th>Edit</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="p in playlist" :key="p.id">
                <td><a :href="'/#/playlist_song/' + p.id">{{ p.name }}</a></td>
                <td><a :href="'/#/add_songs/' + p.id" class="btn btn-success">+ Add Songs</a></td>
                <td><a :href="'/#/edit_playlist/' + p.id" class="btn btn-warning">Edit</a></td>
                <td><a href="#" @click="deletePlaylist(p.id)" class="btn btn-danger">Delete</a></td>
              </tr>
            </tbody>
          </table>
          <a href="/#/create_playlist" class="btn btn-primary">Create a New Playlist here</a>
        </div>
      </div>
    `,
    data() {
      return {
        user: {}, 
        playlist: [], 
        userid : parseInt(localStorage.getItem('userid'))
      };
    },
    created() {
      const id = this.$route.params.id;
      this.fetch_playlist(id);
    },
    methods: {
      async fetch_playlist(id){
        const res = await fetch(`/api/your_playlist/${id}`)
        if (res.ok) {
          this.playlist= await res.json()

      }
    },

async deletePlaylist(playlistId) {
  const confirmation = confirm('Are you sure you want to delete this playlist?');
  if (confirmation) {
    try {
      const response = await fetch(`/api/delete_playlist/${playlistId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: this.userid }),
      });
      if (response.ok) {
        
        this.playlist = this.playlist.filter(p => p.id !== playlistId);
      } else {
        const data = await response.json();
        console.error('Error deleting playlist:', data.message);
        
      }
      this.$router.push(`/your_playlist/${this.userid}`);
    } catch (error) {
      console.error('Error deleting playlist:', error);
    }
  }
}

        

        
    }
}