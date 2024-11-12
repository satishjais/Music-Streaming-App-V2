// EditPlaylist.js
export default {
    template: `
      <div>
        <header>
          <router-link :to="'/your_playlist/' + userid" class="btn btn-link">Go back to Your Playlist</router-link>
        </header>

        <h1>Edit Playlist</h1>
        <form @submit.prevent="editPlaylist">
          <label for="name">New Playlist Name:</label>
          <input type="text" v-model="newName" id="name" class="form-control">
          <input type="submit" value="Save Changes" class="btn btn-primary">
        </form>
      </div>
    `,
    data() {
      return {
        newName: '',
        userid : parseInt(localStorage.getItem('userid')) 
      };
    },
    methods: {
      async editPlaylist() {
        if (!this.newName) {
          console.error('New playlist name is required');
          return;
        }
        const playlistId = this.$route.params.id;
        try {
          const response = await fetch(`/edit_playlist/${playlistId}`, {
            method: 'POST', 
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: this.newName, user_id: this.userid }),
          });
          if (!response.ok) {
            throw new Error('Playlist already exist with this name');
          }
          this.$router.push(`/your_playlist/${this.userid}`);
        } catch (error) {
          console.error('Error editing playlist:', error);
          alert(error.message); 
        }
      },
    },
}
