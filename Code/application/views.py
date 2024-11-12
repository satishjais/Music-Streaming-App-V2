from flask import current_app as app, jsonify,request,render_template, Response
from flask_login import login_required
from flask_security import auth_required, roles_required, current_user
from .models import User,Song, Playlist, Album, Role, Rating, db
from werkzeug.security import check_password_hash
from .sec import datastore
from flask_restful import marshal, fields
from werkzeug.security import generate_password_hash
from .instances import cache

##########################################   HOME    #####################################################

@app.get('/')
def home():
    return render_template("index.html")

##########################################  ADMIN DETAILS TESTING #####################################################

@app.get('/admin')
@auth_required("token")
@roles_required("admin")
def admin():
    return "Hello Admin"

##########################################   LOGIN   #####################################################

@app.post('/user-login')
def user_login():
    data = request.get_json()
    email = data.get('email')
    if not email:
        return jsonify({"message": "email not provided"}), 400

    user = datastore.find_user(email=email)

    if not user:
        return jsonify({"message": "User Not Found"}), 404

    if check_password_hash(user.password, data.get("password")):
        return jsonify({"token": user.get_auth_token(), "email": user.email, "role": user.roles[0].name, "id":user.id})
    else:
        return jsonify({"message": "Wrong Password"}), 400
    
##########################################   REGISTRATION    #####################################################

@app.post('/register')
def register_user():
    email=request.json['email']
    password=request.json['password']
    username = request.json['username']
    # print(email,password)
    if not datastore.find_user(email=email):
        datastore.create_user(email=email, password=generate_password_hash(password),username=username, roles=["listener"])
        db.session.commit()
        return jsonify({'message': 'User Registered'}),201
    else :
        return jsonify({'error':'Email already exists!'}),409

##########################################   SONGS DATA    #####################################################

@app.route('/songs')
@cache.cached(timeout=10, key_prefix = "songs")
def get_songs():
    songs = Song.query.filter_by(flagged=False).all()
    return jsonify([{'id': song.id, 'song_name': song.song_name, 'artist': song.artist, 'lyrics': song.lyrics, 'genre': song.genre, 'ratings': song.ratings} for song in songs])

##########################################   LYRICS DATA    #####################################################

@app.route('/lyrics/<int:id>')
def lyrics(id):
    song = Song.query.get(id)
    return Response(song.lyrics, mimetype='text/plain')


##########################################   EDIT PLAYLST    #####################################################

@app.route('/edit_playlist/<int:playlist_id>', methods=['POST']) # Change method to POST
def edit_playlist(playlist_id):
    playlist = Playlist.query.get(playlist_id)

    if request.method == 'POST':
        new_name = request.json.get('name')
        userid = request.json.get('user_id')

        existing_playlist = Playlist.query.filter_by(name=new_name, user_id=userid).first()
        if existing_playlist:
            error = f"Playlist with name '{new_name}' already exists. Please choose a different name."
            return jsonify(error=error), 400
        
        playlist.name = new_name
        db.session.commit()
        return jsonify(message='Playlist edited successfully'), 200

    return jsonify(error='Method not allowed'), 405

##########################################   DELETE PLAYLST    #####################################################

@app.route('/api/delete_playlist/<int:playlist_id>', methods=['DELETE'])
def delete_playlist(playlist_id):
    playlist = Playlist.query.get(playlist_id)
    if playlist:
        db.session.delete(playlist)
        db.session.commit()
        return jsonify(message='Playlist deleted successfully'), 200
    else:
        return jsonify(error='Playlist not found'), 404
    
##########################################   PLAYLST SONGS    #####################################################


@app.route('/api/playlist_songs/<int:playlist_id>')
def get_playlist_songs(playlist_id):
    try:
        
        playlist = Playlist.query.get(playlist_id)
        if playlist:
            songs = playlist.songs
            song_data = [{'id': song.id, 'song_name': song.song_name, 'lyrics': song.lyrics} for song in songs]
            return jsonify(song_data)
        else:
            return jsonify(error='Playlist not found'), 404
    except Exception as e:
        return jsonify(error=str(e)), 500


##########################################  DELETING PLAYLST SONGS    #####################################################

@app.route('/api/delete_song_from_playlist/<int:playlist_id>/<int:song_id>', methods=['DELETE'])
def delete_song_from_playlist(playlist_id, song_id):
    try:
        playlist = Playlist.query.get(playlist_id)
        song = Song.query.get(song_id)

        if playlist and song:
            if song in playlist.songs:
                playlist.songs.remove(song)
                db.session.commit()
                return jsonify(message='Song deleted from playlist successfully'), 200
            else:
                return jsonify(error='Song not found in playlist'), 404
        else:
            return jsonify(error='Playlist or song not found'), 404

    except Exception as e:
        return jsonify(error=str(e)), 500
    
##########################################  CREATOR UPLOADING SONGS    #####################################################


@app.route('/api/upload_song', methods=['POST'])
def upload_song():
    try:
        data = request.get_json()
        song_name = data.get('song_name')
        artist = data.get('artist')
        genre = data.get('genre')
        lyrics = data.get('lyrics')
        user_id = data.get('user_id')

        new_song = Song(song_name=song_name, artist=artist, genre=genre, lyrics=lyrics, us_id=user_id)
        db.session.add(new_song)
        db.session.commit()

        return jsonify(message='Song uploaded successfully'), 200
    except Exception as e:
        return jsonify(error=str(e)), 500

##########################################  CREATOR SONGS VISIBILITY    #####################################################

@app.route('/api/user_songs/<int:user_id>')
def user_songs(user_id):
    try:
        user_songs = Song.query.filter_by(us_id=user_id).all()
        
        songs_data = [{
            'id': song.id,
            'song_name': song.song_name,
            'artist': song.artist,
            'genre': song.genre,
            'lyrics': song.lyrics,
            'ratings': song.ratings,
            'flagged': song.flagged
        } for song in user_songs]

        return jsonify(songs_data), 200
    except Exception as e:
        return jsonify(error=str(e)), 500
    

##########################################  DELETE CREATOR SONGS    #####################################################

@app.route('/delete_song/<int:song_id>', methods=['DELETE'])
def delete_song(song_id):
    song = Song.query.get(song_id)
    if song:
        db.session.delete(song)
        db.session.commit()
        return jsonify(message='Song deleted successfully'), 200
    else:
        return jsonify(error='Song not found'), 404

    
##########################################  FETCHING SONGS FOR UPDATATION    #####################################################

@app.route('/api/song/<int:song_id>', methods=['GET'])
def get_song(song_id):
    song = Song.query.get(song_id)
    if song:
        return jsonify({
            'id': song.id,
            'song_name': song.song_name,
            'artist': song.artist,
            'genre': song.genre,
            'lyrics': song.lyrics
        }), 200
    else:
        return jsonify({'error': 'Song not found'}), 404
    
##########################################  UPDATING CREATOR SONGS    #####################################################

@app.route('/update_song/<int:song_id>', methods=['PUT'])
def update_song(song_id):
    song = Song.query.get(song_id)

    if request.method == 'PUT':
        song_name = request.json.get('song_name')
        artist = request.json.get('artist')
        genre = request.json.get('genre')
        lyrics = request.json.get('lyrics')
        
        if song:
            song.song_name = song_name
            song.artist = artist
            song.genre = genre
            song.lyrics = lyrics
            db.session.commit()
            return jsonify(message='Song updated successfully'), 200
        else:
            return jsonify(error='Song not found'), 404

    return jsonify(error='Method not allowed'), 405


##########################################   ALBUM SONGS    #####################################################


@app.route('/api/album_songs/<int:album_id>')
def get_album_songs(album_id):
    try:
        album = Album.query.get(album_id)
        if album:
            songs = album.songs
            song_data = [{'id': song.id, 'song_name': song.song_name, 'lyrics': song.lyrics} for song in songs]
            return jsonify(song_data)
        else:
            return jsonify(error='album not found'), 404
    except Exception as e:
        return jsonify(error=str(e)), 500

##########################################  DELETING ALBUM SONGS    #####################################################

@app.route('/api/delete_song_from_album/<int:album_id>/<int:song_id>', methods=['DELETE'])
def delete_song_from_album(album_id, song_id):
    try:
        album = Album.query.get(album_id)
        song = Song.query.get(song_id)

        if album and song:
            if song in album.songs:
                album.songs.remove(song)
                db.session.commit()
                return jsonify(message='Song deleted from album successfully'), 200
            else:
                return jsonify(error='Song not found in album'), 404
        else:
            return jsonify(error='Album or song not found'), 404

    except Exception as e:
        return jsonify(error=str(e)), 500
    

##########################################   EDIT ALBUM    #####################################################

@app.route('/edit_album/<int:album_id>', methods=['POST']) 
def edit_album(album_id):
    album = Album.query.get(album_id)

    if request.method == 'POST':
        new_name = request.json.get('name')
        userid = request.json.get('user_id')

        existing_album = Album.query.filter_by(name=new_name, user_id=userid).first()
        if existing_album:
            error = f"Album with name '{new_name}' already exists. Please choose a different name."
            return jsonify(error=error), 400
        
        album.name = new_name
        db.session.commit()
        return jsonify(message='Album edited successfully'), 200

    return jsonify(error='Method not allowed'), 405

##########################################   DELETE ALBUMS    #####################################################

@app.route('/api/delete_album/<int:album_id>', methods=['DELETE'])
def delete_album(album_id):
    album = Album.query.get(album_id)
    if album:
        db.session.delete(album)
        db.session.commit()
        return jsonify(message='Album deleted successfully'), 200
    else:
        return jsonify(error='Album not found'), 404
    

##########################################   ALL ALBUMS FOR LISTENER/CREATOR   #####################################################


@app.route('/all_albums')
@cache.cached(timeout=10, key_prefix = "allalbums")
def all_albums():
    try:
        albums = Album.query.all()
        albums_data = [{'id': album.id, 'name': album.name, 'user_id': album.user_id} for album in albums]
        return jsonify(albums_data)
    except Exception as e:
        return jsonify(error=str(e)), 500
    
##########################################   ADMIN DASHBOARD   #####################################################


@app.route('/api/admin_dashboard_data')
def admin_dashboard_data():
    user_count = User.query.count()
    creator_count = Role.query.filter_by(name="creator").first().users.count()
    listener_count = Role.query.filter_by(name="listener").first().users.count()
    blacklisted_creator_count = User.query.filter_by(blacklisted=True).count()
    song_count = Song.query.count()
    flagged_song_count = Song.query.filter_by(flagged=True).count()
    top_songs = Song.query.order_by(Song.ratings.desc()).limit(5).all()
    
    top_songs_data = [{'id': song.id, 'song_name': song.song_name, 'ratings': song.ratings} for song in top_songs]
    
    data = {
        'userCount': user_count,
        'listenerCount' : listener_count,
        'creatorCount': creator_count,
        'blacklistedCreatorCount': blacklisted_creator_count,
        'songCount': song_count,
        'flaggedSongCount': flagged_song_count,
        'topSongs': top_songs_data
    }
    
    return jsonify(data)

##########################################   ADMIN SONG FETCHING   #####################################################

@app.route('/admin/songs')
def admin_songs():
    songs = Song.query.all()
    song_data = [{'id': song.id, 'song_name': song.song_name, 'artist': song.artist, 'lyrics': song.lyrics, 'genre': song.genre, 'ratings': song.ratings, 'flagged': song.flagged, 'us_id':song.us_id} for song in songs]
    return jsonify(song_data)

##########################################   ADMIN FLAGGING SONGS   #####################################################

@app.route('/admin/songs/<int:song_id>/flag', methods=['POST'])
def flag_song(song_id):
    action = request.json.get('action')
    song = Song.query.get_or_404(song_id)
    if action == 'flag':
        song.flagged = True
    elif action == 'unflag':
        song.flagged = False
    db.session.commit()
    return jsonify({'message': 'Song flagged/unflagged successfully'})

##########################################   ADMIN DELETING SONGS   #####################################################

@app.route('/admin/songs/<int:song_id>/delete', methods=['DELETE'])
def admin_delete_song(song_id):
    song = Song.query.get_or_404(song_id)
    db.session.delete(song)
    db.session.commit()
    return jsonify({'message': 'Song deleted successfully'})

##########################################   ADMIN FETCHING USERS   #####################################################


@app.route('/api/admin/users/creator')
def admin_creator_users():
    creator_role = Role.query.filter_by(name='creator').first()
    if creator_role:
        creator_users = User.query.filter(User.roles.contains(creator_role)).all()
        users_data = [
            {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'roles': [role.name for role in user.roles],
                'blacklisted': user.blacklisted
            }
            for user in creator_users
        ]
        return jsonify(users_data)
    else:
        return jsonify([])


##########################################   ADMIN BLACKLISTING USERS  #####################################################

@app.route('/api/admin/blacklist/<int:user_id>', methods=['POST'])
def admin_blacklist_user(user_id):
    action = request.json.get('action')
    user = User.query.get(user_id)

    if user:
        if action == 'blacklist':
            user.blacklisted = True
            
            songs_flag_after_black = Song.query.filter_by(us_id=user.id).all()
            for song in songs_flag_after_black:
                song.flagged = True
        elif action == 'whitelist':
            user.blacklisted = False
            
            songs_unflag_after_black = Song.query.filter_by(us_id=user.id).all()
            for song in songs_unflag_after_black:
                song.flagged = False

        db.session.commit()

    return jsonify({'message': 'Action performed successfully'})

##########################################   ADMIN FETCHING ALBUM  #####################################################

@app.route('/api/admin/albums')
def admin_get_albums():
    albums = Album.query.all()
    albums_data = [
        {
            'id': album.id,
            'name': album.name,
            'user_id' : album.user_id
        }
        for album in albums
    ]
    return jsonify(albums_data)

##########################################   ADMIN DELETING ALBUM  #####################################################

@app.route('/api/admin/album/<int:album_id>/delete', methods=['DELETE'])
def admin_delete_album(album_id):
    album = Album.query.get_or_404(album_id)
    db.session.delete(album)
    db.session.commit()
    return jsonify({'message': 'Album deleted successfully'})


##########################################   RATINGS  #####################################################

@app.route('/rate_song/<int:song_id>', methods=['POST'])
def rate_song(song_id):
    try:
        
        user_id = request.json.get('user_id')
        rating_value = request.json.get('rating')

        if user_id is None or rating_value is None:
            return jsonify({'error': 'User ID and rating are required'}), 400

        song = Song.query.get(song_id)

        if song is None:
            return jsonify({'error': 'Song not found'}), 404

        song.ratings_total += rating_value
        song.ratings_count += 1

        song.ratings = song.ratings_total / song.ratings_count

        db.session.commit()
        return jsonify({'message': 'Rating submitted successfully'}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

#========================================== SEARCH SONGS =====================================================================
from sqlalchemy import or_

@app.route('/search/songs', methods=['GET'])
def search_songs():
    query = request.args.get('query')
    songs = Song.query.filter(or_(Song.song_name.like(f'%{query}%'), Song.artist.like(f'%{query}%'), Song.genre.like(f'%{query}%'), Song.ratings.like(f'%{query}%'))).all()
    song_data = [{'id': song.id, 'song_name': song.song_name, 'artist': song.artist, 'genre': song.genre, 'ratings': round(song.ratings,2)} for song in songs]
    return jsonify({'songs': song_data})

# #========================================== SEARCH PLAYLISTS =====================================================================
# from sqlalchemy import or_

# @app.route('/search/playlists', methods=['GET'])
# def search_playlist():
#     query = request.args.get('query')
#     playlists = Playlist.query.filter(or_(Playlist.name.like(f'%{query}%'))).all()
#     playlist_data = [{'id': playlist.id, 'playlist_name': playlist.name} for playlist in playlists]
#     return jsonify({'playlists': playlist_data})

#========================================== PLAY SONG :) =====================================================================
@app.route('/play')
def play():
    return render_template("play.html")
