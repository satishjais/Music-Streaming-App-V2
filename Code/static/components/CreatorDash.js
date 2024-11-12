import LogoutButton from './logout.js'; 

export default {
        template: `
          <div>
            <nav class="navbar navbar-expand-lg navbar-light bg-light">
                <div class="container">
                    <a class="navbar-brand" href="/#/dashboard">Music Streaming App</a>
                    <div class="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul class="navbar-nav ml-auto">
                            <li class="nav-item">
                                <a class="nav-link" href="#" @click="logout">Logout</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
      
            <div v-if="messages.length > 0" class="flash-container">
                <div v-for="message in messages" :key="message.id" :class="'alert alert-' + message.category">
                    {{ message.text }}
                </div>
            </div>

            <div class="container">
            <h2 v-if="user.email">Welcome Creator, {{ user.email }}</h2>
            <h3>We have a few suggestions for you</h3>
            <h1>SONGS</h1>
            <input type="text" v-model="songSearchQuery" @input="searchSongs" placeholder="Search songs...">

      
            
                <table v-if="results.length > 0" class="table">
                    <thead>
                        <tr>
                            <th>SNo</th>
                            <th>Name</th>
                            <th>Artist</th>
                            <th>Lyrics</th>
                            <th>Genre</th>
                            <th>Ratings</th>
                            <th>Rate</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(song, index) in aresults" :key="song.id">
                            <td>{{ index + 1 }}</td>
                            <td>{{ song.song_name }}</td>
                            <td>{{ song.artist }}</td>
                            <td><a :href="'/#/lyrics/' + song.id">Song lyrics</a></td>
                            <td>{{ song.genre }}</td>
                            <td :id="'ratings_' + song.id">{{ song.ratings }}</td>
                            <td>
                                <form @submit.prevent="rateSong(song.id)">
                                    <select class="form-control" v-model="ratings[song.id]">
                                        <option value="1">1</option>
                                        <option value="2">2</option>
                                        <option value="3">3</option>
                                        <option value="4">4</option>
                                        <option value="5">5</option>
                                    </select>
                                    <button type="submit" class="btn btn-primary">Rate</button>
                                </form>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
      
            <router-link :to="'/your_playlist/' + user.id" class="btn btn-link">Go to Playlist</router-link>
            <a href="/#/all_album" class="btn btn-link">All Albums</a>
            <router-link :to="'/creator_songs/' + user.id" class="btn btn-link">Uploaded Songs</router-link>
            <router-link :to="'/your_album/' + user.id" class="btn btn-link">Your Albums</router-link>
            <a href="/play" class="btn btn-link" target="_blank">Click to play a Song</a>
          </div>
        `      
      ,
    data() {
        return {
            user: [],
            messages: [],
            aresults: [],
            results: [],
            songSearchQuery: '',
            ratings: {},
            userId: null 
        }
    },
    async mounted() {
        await this.fetchSongData();
    },
    methods: {
        logout() {
            if (confirm("Are you sure you want to log out?")) {
            localStorage.removeItem('auth-token');
            localStorage.removeItem('role');
            localStorage.removeItem('userid')
            this.$router.push('/login');
            }
        },
        async fetchSongData(query = '') {
            try {
                const response = await fetch(`/search/songs?query=${query}`);
                const data = await response.json();
                this.results = data.songs;
                // console.log(this.results) 
            } catch (error) {
                console.error('Error fetching song data:', error);
            }
        },
        async searchSongs() {
            this.fetchSongData(this.songSearchQuery);
        },
        rateSong(songId) {
            const userId = localStorage.getItem('userid');
            const rating = this.ratings[songId];
            if (!userId) {
                console.error('User ID not found in localStorage');
                return;
            }
            if (!rating || isNaN(parseFloat(rating)) || rating < 1 || rating > 5) {
                console.error('Invalid rating value');
                return;
            }
            fetch(`/rate_song/${songId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ rating: parseFloat(rating), user_id: parseInt(userId) }),
            })
                .then(response => {
                    if (response.ok) {
                        this.messages.push({ id: Date.now(), category: 'success', text: 'Rating submitted successfully' });
                        window.location.reload()
                    } else {
                        throw new Error('Failed to submit rating');
                    }
                })
                .catch(error => {
                    console.error('Error submitting rating:', error);
                    this.messages.push({ id: Date.now(), category: 'danger', text: 'Error submitting rating. Please try again later.' });
                });
        },
    },
    
    created() {
        const userid = localStorage.getItem('userid'); 
        if (!userid) {
            console.error('User ID not found in localStorage');
            return;
        }
    
        // Fetch user details
        fetch(`/api/user_data/${userid}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch user details');
            }
            return response.json();
        })
        .then(data => {
            this.user = data;
        })
        .catch(error => {
            console.error('Error fetching user details:', error);
            this.messages.push({ id: Date.now(), category: 'danger', text: 'Failed to fetch user details' });
        });
    
        fetch('/songs') 
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch songs data');
            }
            return response.json();
        })
        .then(data => {
            this.aresults = data;
        })
        .catch(error => {
            console.error('Error fetching songs data:', error);
            this.messages.push({ id: Date.now(), category: 'danger', text: 'Failed to fetch songs data' });
        });
    },
    
    components: {
                LogoutButton 
            }
}


