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
                        <th>Album Code</th>

                    </tr>
                </thead>
                <tbody>
                    <tr v-for="album in albums" :key="album.id">
                        <td><a :href="'/#/album_song_view/' + album.id">{{ album.name }}</a></td>
                        <td>{{ album.user_id }}</td>

                    </tr>
                </tbody>
            </table>
            <div v-else>
                <p>No albums found. Please wait for a Creator to upload an Album :)</p>
            </div>
        </div>
    `,
    data() {
        return {
            albums: []
        }
    },
    created() {
        fetch('/all_albums')
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
            this.messages.push({ id: Date.now(), category: 'danger', text: 'Failed to fetch albums data' });
        });
    }
}
