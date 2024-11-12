export default {
    template: `
        <div>
            <header>
            <a href="/#/dashboard" class="btn btn-link">Go Back to Dashboard</a>
            </header>

            <div v-if="messages.length > 0" class="flash-container">
                <div v-for="message in messages" :key="message.id" :class="'alert alert-' + message.category">
                    {{ message.text }}
                </div>
            </div>

            <h2 class="display-4">Song Lyrics</h2>
            <h4>{{ lyrics }}</h4>
        </div>
    `,
    data() {
        return {
            songName: '',
            lyrics: '',
            messages: []
        }
    },
    methods: {
        goBack() {
            this.$router.push('/dashboard');
        },
        logout() {
            localStorage.removeItem('auth-token');
            localStorage.removeItem('role');
            this.$router.push('/login');
        }
    },
    created() {
        const songId = this.$route.params.id;
        fetch(`/lyrics/${songId}`)
        .then(response => response.text()) 
        .then(data => {
            this.songName = 'Song Name'; 
            this.lyrics = data; 
        })
        .catch(error => {
            console.error('Error fetching lyrics data:', error);
            this.messages.push({ id: Date.now(), category: 'danger', text: 'Error fetching lyrics data. Please try again later.' });
        });
    }
}
