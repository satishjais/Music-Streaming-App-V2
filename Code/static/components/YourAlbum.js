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
  
        <div v-if="album.length === 0">
          <h1>No Album Found</h1>
          <a href="/#/create_album" class="btn btn-primary">Create an Album from here</a>
        </div>
        <div v-else>
          <h1>Your Albums</h1>
          <table class="table">
            <thead>
              <tr>
                <th>Album Name</th>
                <th>Action</th>
                <th>Edit</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="a in album" :key="a.id">
                <td><a :href="'/#/album_song/' + a.id">{{ a.name }}</a></td>
                <td><a :href="'/#/add_album_songs/' + a.id" class="btn btn-success">+ Add Songs</a></td>
                <td><a :href="'/#/edit_album/' + a.id" class="btn btn-warning">Edit</a></td>
                <td><a href="#" @click="deleteAlbum(a.id)" class="btn btn-danger">Delete</a></td>
              </tr>
            </tbody>
          </table>
          <a href="/#/create_album" class="btn btn-primary">Create a New Album here</a>
        </div>
      </div>
    `,
    data() {
      return {
        user: {}, 
        album: [], 
        userid : parseInt(localStorage.getItem('userid'))
      };
    },
    created() {
      const id = this.$route.params.id;
      this.fetch_album(id);
    },
    methods: {
      async fetch_album(id){
        const res = await fetch(`/api/your_album/${id}`)
        if (res.ok) {
          this.album= await res.json()

      }
    },
    
async deleteAlbum(albumId) {
  const confirmation = confirm('Are you sure you want to delete this album?');
  if (confirmation) {
    try {
      const response = await fetch(`/api/delete_album/${albumId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: this.userid }),
      });
      if (response.ok) {
        
        this.album = this.album.filter(p => p.id !== albumId);
      } else {
        const data = await response.json();
        console.error('Error deleting album:', data.message);
        
      }
      this.$router.push(`/your_album/${this.userid}`);
    } catch (error) {
      console.error('Error deleting album:', error);
      
    }
  }
}
        
    }
}