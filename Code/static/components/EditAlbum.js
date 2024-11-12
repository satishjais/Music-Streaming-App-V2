export default {
    template: `
      <div>
        <header>
          <router-link :to="'/your_album/' + userid" class="btn btn-link">Go back to Your Album</router-link>
        </header>

        <h1>Edit Album</h1>
        <form @submit.prevent="editAlbum">
          <label for="name">New Album Name:</label>
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
      async editAlbum() {
        if (!this.newName) {
          console.error('New album name is required');
          return;
        }
        const albumId = this.$route.params.id;
        try {
          const response = await fetch(`/edit_album/${albumId}`, {
            method: 'POST', 
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: this.newName, user_id: this.userid }),
          });
          if (!response.ok) {
            throw new Error('Album Already exist with this name');
          }
          this.$router.push(`/your_album/${this.userid}`);
        } catch (error) {
          console.error('Error editing album:', error);
          alert(error.message); 
        }
      },
    },
}
