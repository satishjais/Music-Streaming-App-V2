export default {
    template: `
        <div>
            <header>
                <a href="/#/dashboard" class="btn btn-link">Go Back to Dashboard</a>
            </header>
            <h1>All Albums</h1>
            <table v-if="albums.length > 0" class="table">
                <thead>
                    <tr>

                        <th>Album Name</th>
                        <th>Creator Code</th>
                        <th>Delete</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="album in albums" :key="album.id">
                        <td><a :href="'/#/album_song_view/' + album.id">{{ album.name }}</a></td>
                        <td>{{ album.user_id }}</td>
                        <td><button @click="deleteAlbum(album.id)" class="btn btn-danger">Delete</button></td>
                    </tr>
                </tbody>
            </table>
            <div v-else>
                <p>No albums found</p>
            </div>
        </div>
    `,
    data() {
        return {
            albums: []
        }
    },
    created() {
        this.fetchAlbums();
    },
    methods: {
        fetchAlbums() {
            fetch('/api/admin/albums')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch albums data');
                }
                return response.json();
            })
            .then(data => {
                this.albums = data;
            })
            .catch(error => {
                console.error('Error fetching albums data:', error);
            });
        },
        deleteAlbum(albumId) {
            if (confirm('Are you sure you want to delete this Album?')) {
                fetch(`/api/admin/album/${albumId}/delete`, {
                    method: 'DELETE'
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Failed to delete album');
                    }
                    this.fetchAlbums();
                })
                .catch(error => {
                    console.error('Error deleting album:', error);
                });
            }
        }
    }
}
