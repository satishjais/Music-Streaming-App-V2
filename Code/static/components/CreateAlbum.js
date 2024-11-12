export default {
    template: `
      <div>
        <h1>Create Album</h1>
        <form @submit.prevent="createAlbum">
          <label for="albumName">Album Name:</label>
          <input type="text" v-model="albumName" id="albumName" class="form-control">
          <button type="submit" class="btn btn-primary">Create Album</button>
        </form>
      </div>
    `,
    data() {
      return {
        albumName: '',
        error: null,
        userid : parseInt(localStorage.getItem('userid'))
      };
    },

    methods: {
      async createAlbum() {
        if (!this.albumName.trim()) {
          console.error('Album name is required');
          return;
        }
  
        try {
          const response = await fetch('/api/create_album', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: this.albumName, user_id: this.userid }),
          });
  
          if (!response.ok) {
            throw new Error('You have already created an album with this name. Please choose a different name for your Album');
          }
  
          this.$router.push(`/your_album/${this.userid}`);
        } catch (error) {
          console.error('Error creating album:', error);
          alert(error.message);
        }
      },
    },
  };
  