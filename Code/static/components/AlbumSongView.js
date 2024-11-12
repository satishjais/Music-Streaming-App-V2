export default {
    template: `
      <div>
      <header>
      <a href="/#/dashboard" class="btn btn-link">Go Back to Dashboard</a>
      </header>
        <h1>{{ albumName }}</h1>
        <table>
          <thead>
            <tr>
              <th>Song Name</th>
              <th>Lyrics</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="song in songs" :key="song.id">
              <td>{{ song.song_name }}</td>
              <td><a :href="'/#/lyrics/' + song.id">{{song.song_name}}Lyrics</a></td>
            </tr>
          </tbody>
        </table>
      </div>
    `,
    data() {
      return {
        albumName: '', 
        songs: [] 
      };
    },
    created() {
      const albumId = this.$route.params.id;
      this.fetchAlbumSongs(albumId);
    },
    methods: {
      async fetchAlbumSongs(albumId) {
        try {
          
          const albumResponse = await fetch(`/api/your_album/${albumId}`);
          if (albumResponse.ok) {
            const albumData = await albumResponse.json();
            this.albumName = albumData.name;
  
            
            const songsResponse = await fetch(`/api/album_songs/${albumId}`);
            if (songsResponse.ok) {
              this.songs = await songsResponse.json();
            } else {
              console.error('Failed to fetch album songs');
              
            }
          } else {
            console.error('Failed to fetch album');
            
          }
        } catch (error) {
          console.error('Error fetching album songs:', error);
          
        }
      },
    }
  };
  
  