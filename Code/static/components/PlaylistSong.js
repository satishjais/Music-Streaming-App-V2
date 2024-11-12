export default {
  template: `
    <div>
    <header><a href="/#/dashboard">Back to Dashboard</a></header>
      <h1>{{ playlistName }}</h1>
      <table>
        <thead>
          <tr>
            <th>Song Name</th>
            <th>Lyrics</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="song in songs" :key="song.id">
            <td>{{ song.song_name }}</td>
            <td><a :href="'/#/lyrics/' + song.id" class="btn btn-primary">{{song.song_name}}Lyrics</a></td>
            <td>
              <button @click="removeFromPlaylist(song.id)" class="btn btn-danger">Remove from Playlist</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
  data() {
    return {
      playlistName: '', 
      songs: [] 
    };
  },
  created() {
    const playlistId = this.$route.params.id;
    this.fetchPlaylistSongs(playlistId);
  },
  methods: {
    async fetchPlaylistSongs(playlistId) {
      try {
        const playlistResponse = await fetch(`/api/your_playlist/${playlistId}`);
        if (playlistResponse.ok) {
          const playlistData = await playlistResponse.json();
          this.playlistName = playlistData.name;

          const songsResponse = await fetch(`/api/playlist_songs/${playlistId}`);
          if (songsResponse.ok) {
            this.songs = await songsResponse.json();
          } else {
            console.error('Failed to fetch playlist songs');
          }
        } else {
          console.error('Failed to fetch playlist');
        }
      } catch (error) {
        console.error('Error fetching playlist songs:', error);
      }
    },
    async removeFromPlaylist(songId) {
      const playlistId = this.$route.params.id;
      const confirmation = confirm('Are you sure you want to remove this song from the playlist?');
      if (confirmation) {
        try {
          const response = await fetch(`/api/delete_song_from_playlist/${playlistId}/${songId}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            }
          });
          if (response.ok) {
            this.songs = this.songs.filter(song => song.id !== songId);
          } else {
            const data = await response.json();
            console.error('Error removing song from playlist:', data.error);
          }
        } catch (error) {
          console.error('Error removing song from playlist:', error);
        }
      }
    }    
  }
};

