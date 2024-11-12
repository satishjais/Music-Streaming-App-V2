import Home from './components/Home.js'
import Registration from './components/Registration.js'
import Login from './components/Login.js'
import Dashboard from './components/Dashboard.js'
import Lyrics from './components/Lyrics.js'
import YourPlaylist from './components/YourPlaylist.js'
import CreatePlaylist from './components/CreatePlaylist.js'
import EditPlaylist from './components/EditPlaylist.js'
import AddSongs from './components/AddSongs.js'
import PlaylistSong from './components/PlaylistSong.js'
import UploadSongs from './components/UploadSongs.js'
import CreatorSongs from './components/CreatorSongs.js'
import EditSongs from './components/EditSongs.js'
import YourAlbum from './components/YourAlbum.js'
import CreateAlbum from './components/CreateAlbum.js'
import AddAlbumSongs from './components/AddAlbumSongs.js'
import AlbumSong from './components/AlbumSong.js'
import EditAlbum from './components/EditAlbum.js'
import AllAlbum from './components/AllAlbum.js'
import AlbumSongView from './components/AlbumSongView.js'
import AdminSongsMan from './components/AdminSongsMan.js'
import AdminUserMan from './components/AdminUserMan.js'
import AdminAlbumMan from './components/AdminAlbumMan.js'


const routes =[
    {path:'/', component: Home, name :'Home'},
    {path:'/registration', component: Registration},
    {path:'/login', component: Login, name: 'Login'},
    {path:'/dashboard', component: Dashboard},
    {path: '/lyrics/:id', component: Lyrics, name: 'Lyrics' },
    {path: '/your_playlist/:id', component: YourPlaylist, name: 'YourPlaylist' },
    {path: '/create_playlist', component: CreatePlaylist, name: 'CreatePlaylist' },
    {path: '/edit_playlist/:id', component: EditPlaylist, name: 'EditPlaylist' },
    {path: '/add_songs/:id',component: AddSongs, name: 'AddSongs'},
    {path: '/playlist_song/:id',component: PlaylistSong, name: 'PlaylistSong'},
    {path: '/upload_songs',component: UploadSongs, name: 'UploadSongs'},
    {path: '/creator_songs/:id',component: CreatorSongs, name: 'CreatorSongs'},
    {path: '/edit_song/:id',component: EditSongs, name: 'EditSongs'},
    {path: '/your_album/:id', component: YourAlbum, name: 'YourAlbum' },
    {path: '/create_album', component: CreateAlbum, name: 'CreateAlbum' },
    {path: '/add_album_songs/:id',component: AddAlbumSongs, name: 'AddAlbumSongs'},
    {path: '/album_song/:id',component: AlbumSong, name: 'AlbumSong'},
    {path: '/edit_album/:id', component: EditAlbum, name: 'EditAlbum' },
    {path: '/all_album', component: AllAlbum, name: 'AllAlbum' },
    {path: '/album_song_view/:id',component: AlbumSongView, name: 'AlbumSongView'},
    {path: '/admin_songs_man',component: AdminSongsMan, name: 'AdminSongsMan'},
    {path: '/admin_users_man',component: AdminUserMan, name: 'AdminUserMan'},
    {path: '/admin_album_man',component: AdminAlbumMan, name: 'AdminAlbumMan'},
    
    
]

export default new VueRouter({
    routes,
})