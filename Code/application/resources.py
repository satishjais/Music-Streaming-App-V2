from flask_restful import Resource, Api, reqparse, marshal_with, fields, abort
from .models import Song,Playlist,User,Album, Rating, Role, db
from flask import request
from sqlalchemy import func, or_

api= Api(prefix='/api')
parser = reqparse.RequestParser()



##########################################   SONGS DATA API   #####################################################

parser.add_argument('id', type=int, help='ID is required should be a integer', required=True)
parser.add_argument('song_name', type=str, help='Song Name is required should be a string', required=True)
parser.add_argument('artist', type=str, help='Artist is required and should be a string', required=True)
parser.add_argument('lyrics', type=str, help='Lyrics is required and should be a string', required=True)
parser.add_argument('genre', type=str, help='Genre is required and should be a string', required=True)
parser.add_argument('ratings', type=float, help='ratings is required and should be a Float', required=True)

#to visualize our columns json files, isme se koi hata diye toh rahega still but dikhega nahi in api resource
song_fields = {
    'id': fields.Integer,
    'song_name': fields.String,
    'artist':   fields.String,
    'lyrics':  fields.String,
    'genre': fields.String,
    'ratings': fields.Float
}
    
class MusicStreamingApp(Resource): #must have name jo bhej rahe in api in line api.add_resource 
    @marshal_with(song_fields)

    def get(self):
        all_songs_data = Song.query.all() #original databse se fetched
        print(all_songs_data)
        return all_songs_data
        # return {'message' : "hello fro api"}

    def post(self):
        args = parser.parse_args()
        song = Song(**args)
        db.session.add(song)
        db.session.commit()
        return {"message": "Songs Created"}

api.add_resource(MusicStreamingApp, '/music_streaming_app')

##########################################   USER DATA API  #####################################################

user_parser = reqparse.RequestParser()
user_parser.add_argument( 'email' , type = str , help ='email missing',required= True  )
user_parser.add_argument( 'password' , type = str , help ='password missing',required= True  )

user_data_output_fields = {
    "email" : fields.String ,
    "password" : fields.String,
    "id" : fields.Integer
}

class Userdata(Resource):
    @marshal_with(user_data_output_fields)
    def get(self,id):
        return User.query.filter_by(id=id).first()
    
api.add_resource(Userdata,'/user_data/<int:id>')


##########################################   PLAYLIST API   #####################################################
playlist_parser = reqparse.RequestParser()
playlist_parser.add_argument('name', type=str, help='Playlist name is required and should be a string', required=True)
playlist_parser.add_argument('user_id', type=int, help='User ID is required and should be an integer', required=True)

playlist_fields = {
    'id': fields.Integer,
    'name': fields.String,
    'user_id': fields.Integer
}

class PlaylistResource(Resource):
    @marshal_with(playlist_fields)
    def get(self,id):
        playlists = Playlist.query.filter_by(user_id=id).all()
        return playlists

    def post(self):
        args = playlist_parser.parse_args()
        playlist = Playlist(**args)
        db.session.add(playlist)
        db.session.commit()
        return {"message": "Playlist created successfully"}
    
    #Adding a song to a playlist
    def post(self, id):
        playlist = Playlist.query.get(id)
        if not playlist:
            return {"error": "Playlist not found"}, 404

        song_id = request.json.get('song_id')
        song = Song.query.get(song_id)
        if not song:
            return {"error": "Song not found"}, 404
        
        if song in playlist.songs:
            return {"error": "Song is already in the playlist"}, 400


        playlist.songs.append(song)
        db.session.commit()

        return {"message": "Song added to playlist successfully"}


api.add_resource(PlaylistResource, '/your_playlist/<int:id>')

##########################################  CREATE PLAYLIST API   #####################################################

playlist_parser = reqparse.RequestParser()
playlist_parser.add_argument('name', type=str, help='Playlist name is required and should be a string', required=True)
playlist_parser.add_argument('user_id', type=int, help='User ID is required and should be an integer', required=True)

create_playlist_fields = {
    'id': fields.Integer,
    'name': fields.String,
    'user_id': fields.Integer
}

class CreatePlaylist(Resource):
    @marshal_with(create_playlist_fields)
    def post(self):
        args = playlist_parser.parse_args()
        playlist_name = args['name']
        user_id = args['user_id']

        existing_playlist = Playlist.query.filter_by(name=playlist_name, user_id=user_id).first()
        if existing_playlist:
            return {"error": "Playlist with the same name already exists"}, 400

        playlist = Playlist(**args)
        db.session.add(playlist)
        db.session.commit()
        return {"message": "Playlist created successfully"}
    
api.add_resource(CreatePlaylist, '/create_playlist')

##########################################   ALBUM API   #####################################################
album_parser = reqparse.RequestParser()
album_parser.add_argument('name', type=str, help='Album name is required and should be a string', required=True)
album_parser.add_argument('user_id', type=int, help='User ID is required and should be an integer', required=True)

album_fields = {
    'id': fields.Integer,
    'name': fields.String,
    'user_id': fields.Integer
}

class AlbumResource(Resource):
    @marshal_with(album_fields)
    def get(self,id):
        albums = Album.query.filter_by(user_id=id).all()
        return albums

    def post(self):
        args = album_parser.parse_args()
        album = Album(**args)
        db.session.add(album)
        db.session.commit()
        return {"message": "Album created successfully"}
    
    def post(self, id):
        # Handle adding a song to a album
        album = Album.query.get(id)
        if not album:
            return {"error": "Album not found"}, 404

        song_id = request.json.get('song_id')
        song = Song.query.get(song_id)
        if not song:
            return {"error": "Song not found"}, 404
        
        if song in album.songs:
            return {"error": "Song is already in the album"}, 400


        album.songs.append(song)
        db.session.commit()

        return {"message": "Song added to album successfully"}


api.add_resource(AlbumResource, '/your_album/<int:id>')

##########################################  CREATE ALBUM API   #####################################################

album_parser = reqparse.RequestParser()
album_parser.add_argument('name', type=str, help='Album name is required and should be a string', required=True)
album_parser.add_argument('user_id', type=int, help='User ID is required and should be an integer', required=True)

create_album_fields = {
    'id': fields.Integer,
    'name': fields.String,
    'user_id': fields.Integer
}

class CreateAlbum(Resource):
    @marshal_with(create_album_fields)
    def post(self):
        args = album_parser.parse_args()
        album_name = args['name']
        user_id = args['user_id']

        existing_album = Album.query.filter_by(name=album_name, user_id=user_id).first()
        if existing_album:
            return {"error": "Album with the same name already exists"}, 400

        # Agar nahi mila same naam se album, create a new album
        album = Album(**args)
        db.session.add(album)
        db.session.commit()
        return {"message": "Album created successfully"}
    
api.add_resource(CreateAlbum, '/create_album')

##########################################  CREATOR REGISTRATION  #####################################################

creator_registration_parser = reqparse.RequestParser()
creator_registration_parser.add_argument('user_id', type=int, help='User ID is required and should be an integer', required=True)


class UpdateUserRole(Resource):
    def put(self):
        args = creator_registration_parser.parse_args()
        data = request.get_json()
        user_id = data.get('user_id')
        user = User.query.get(user_id)
        if user is None:
            return {'message': 'User not found'}, 404
        new_role = Role.query.filter_by(name='creator').first()
        if new_role is None:
            return {'message': 'Role "creator" not found'}, 404
        user.roles = [new_role]
        db.session.commit()
        return {'message': 'User role updated successfully'}, 200

api.add_resource(UpdateUserRole, '/user/update-role')

##########################################  SEARCH SONGS  #####################################################

parser.add_argument('id', type=int, help='ID is required should be a integer', required=True)
parser.add_argument('song_name', type=str, help='Song Name is required should be a string', required=True)
parser.add_argument('artist', type=str, help='Artist is required and should be a string', required=True)
parser.add_argument('lyrics', type=str, help='Lyrics is required and should be a string', required=True)
parser.add_argument('genre', type=str, help='Genre is required and should be a string', required=True)
parser.add_argument('ratings', type=float, help='ratings is required and should be a Float', required=True)

song_fields = {
    'id': fields.Integer,
    'song_name': fields.String,
    'artist':   fields.String,
    'lyrics':  fields.String,
    'genre': fields.String,
    'ratings': fields.Float
}
    
class SearchSongs(Resource):
    @marshal_with(song_fields)
    def get(self, query):
        query = query
        query = f"%{query}%"
        songs = Song.query.filter(
            or_(
                Song.song_name.contains(query),
                Song.artist.contains(query),
                Song.genre.contains(query),
                func.cast(Song.ratings, db.String).contains(query)
            )
        ). all()
        return songs, 200

api.add_resource(SearchSongs, '/search_songs/<string:query>')
