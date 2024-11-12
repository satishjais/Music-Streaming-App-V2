from flask_sqlalchemy import SQLAlchemy
from flask_security import UserMixin, RoleMixin
db = SQLAlchemy()

#rolesofusers
class RolesUsers(db.Model):
    __tablename__ = 'roles_users'
    id = db.Column(db.Integer(), primary_key=True)
    user_id = db.Column('user_id', db.Integer(), db.ForeignKey('user.id'))
    role_id = db.Column('role_id', db.Integer(), db.ForeignKey('role.id'))


# user
class User(db.Model, UserMixin):
    id = db.Column(db.Integer(), autoincrement=True ,primary_key=True)
    username = db.Column(db.String(80), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(80), nullable=False)
    active = db.Column(db.Boolean())
    user_playlist = db.relationship('Playlist', backref='user')
    ratings_given = db.relationship('Rating', backref='user')
    blacklisted = db.Column(db.Boolean(), default=False)
    fs_uniquifier = db.Column(db.String(255), unique=True, nullable=False)
    role_id = db.Column(db.Integer,db.ForeignKey('role.id'))
    role = db.Relationship('Role')
    roles = db.relationship('Role', secondary='roles_users',
                         backref=db.backref('users', lazy='dynamic'))

#role
class Role(db.Model, RoleMixin):
    id = db.Column(db.Integer() ,primary_key=True)
    name = db.Column(db.String(80), unique=True)
    description = db.Column(db.String(255))

# songs
class Song(db.Model):
    id = db.Column(db.Integer(),primary_key=True, unique=True)
    song_name = db.Column(db.String(80), nullable=False)
    artist = db.Column(db.String(80), nullable=False)
    lyrics = db.Column(db.String(), nullable=False)
    genre = db.Column(db.String(80), nullable=False)
    ratings = db.Column(db.Float(), default=0)
    us_id = db.Column(db.Integer(), default=0)
    ratings_total = db.Column(db.Float(), default=0)
    ratings_count = db.Column(db.Float(), default=0)
    flagged = db.Column(db.Boolean(), default=False)



#  Playlists
class Playlist(db.Model):
    _tablename_ = "playlists"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(40))
    user_id = db.Column(db.Integer,db.ForeignKey("user.id"), nullable=False , default='')

    songs = db.relationship('Song', secondary='playlist_songs', backref='playlists')

    playlist_songs = db.Table('playlist_songs',db.Column('playlist_id', db.String(36), db.ForeignKey('playlist.id'), primary_key=True), 
    db.Column('song_id', db.String(36), db.ForeignKey('song.id'), primary_key=True))

#Album
class Album(db.Model):
    _tablename_ = "albums"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(40))
    user_id = db.Column(db.Integer,db.ForeignKey("user.id"), nullable=False , default='')

    songs = db.relationship('Song', secondary='album_songs', backref='albums')

    album_songs = db.Table('album_songs',db.Column('album_id', db.String(36), db.ForeignKey('album.id'), primary_key=True), 
    db.Column('song_id', db.String(36), db.ForeignKey('song.id'), primary_key=True))

#ratings  
class Rating(db.Model):
    id = db.Column(db.Integer(), primary_key=True)
    user_id = db.Column(db.Integer(), db.ForeignKey("user.id"), nullable=False)
    song_id = db.Column(db.Integer(), db.ForeignKey("song.id"), nullable=False)
    rating = db.Column(db.Integer(), nullable=False)

