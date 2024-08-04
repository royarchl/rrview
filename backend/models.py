from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class Artist(db.Model):
    __tablename__ = 'artist'

    ArtistId = db.Column(db.Integer, primary_key=True, autoincrement=True)
    Name = db.Column(db.String(255), nullable=False)
    IsFullyReviewed = db.Column(db.Boolean, nullable=True)

    albums = db.relationship('Album', backref='artist', lazy=True, cascade='all, delete-orphan')


class Album(db.Model):
    __tablename__ = 'album'

    AlbumId = db.Column(db.Integer, primary_key=True, autoincrement=True)
    ArtistId = db.Column(db.Integer, db.ForeignKey('artist.ArtistId'), nullable=False)
    Name = db.Column(db.String(255), nullable=False)
    ReleaseDate = db.Column(db.Date, nullable=False)
    Comment = db.Column(db.Text, nullable=True)
    Url = db.Column(db.String(2083), nullable=False)
    ArtUrl = db.Column(db.String(2083), nullable=False)
    IsBestAlbum = db.Column(db.Boolean, nullable=True)

    __table_args__ = (
        db.ForeignKeyConstraint(['ArtistId'], ['artist.ArtistId'], ondelete='CASCADE'),
    )

    songs = db.relationship('Song', backref='album', lazy=True, cascade='all, delete-orphan')


class Song(db.Model):
    __tablename__ = 'song'

    SongId = db.Column(db.Integer, primary_key=True, autoincrement=True)
    AlbumId = db.Column(db.Integer, db.ForeignKey('album.AlbumId'), nullable=False)#, ondelete='CASCADE')
    Name = db.Column(db.String(255), nullable=False)
    Url = db.Column(db.String(2083), nullable=False)
    SongNumber = db.Column(db.Integer, nullable=False)
    Features = db.Column(db.String(255), nullable=False)
    IsBestSong = db.Column(db.Boolean, nullable=True)

    __table_args__ = (
        db.ForeignKeyConstraint(['AlbumId'], ['album.AlbumId'], ondelete='CASCADE'),
    )

    review = db.relationship('Review', backref='song', uselist=False, lazy=True, cascade='all, delete-orphan')


class Review(db.Model):
    __tablename__ = 'review'

    ReviewId = db.Column(db.Integer, primary_key=True, autoincrement=True)
    SongId = db.Column(db.Integer, db.ForeignKey('song.SongId'), nullable=False)#, ondelete='CASCADE')
    Rating = db.Column(db.Boolean, nullable=False)
    Comment = db.Column(db.Text, nullable=True)

    __table_args__ = (
        db.ForeignKeyConstraint(['SongId'], ['song.SongId'], ondelete='CASCADE'),
    )