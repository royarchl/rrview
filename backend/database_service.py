from sqlalchemy import select
from sqlalchemy.orm import joinedload
from flask import jsonify, make_response
from marshmallow import ValidationError

from models import db, Artist, Album, Song, Review
from schemas import ArtistSchema, AlbumSchema, SongSchema, ReviewSchema


class DatabaseService:
    async def __validate_and_deserialize(self, json):
        try:
            output = ArtistSchema().load(json['artist'])
            return output, None, 200
        except ValidationError as err:
            print(f"Validation error: {err.messages}")
            return None, jsonify(err.messages), 402


    async def push_to_database(self, json):
        artist, response, status_code = await self.__validate_and_deserialize(json)
        if status_code != 200:
            return response, status_code

        try:
            existing_artist = db.session.query(
                Artist).filter_by(Name=artist.Name).first()

            if existing_artist:
                for album in artist.albums:
                    existing_album = db.session.query(Album).filter_by(Name=album.Name, 
                                                                       ArtistId=existing_artist.ArtistId).first()
                    if existing_album:
                        return jsonify({'error': f"Album {album.Name} already exists for artist {artist.Name}"}), 409
                    
                    album.artist = db.session.merge(existing_artist)
                    db.session.add(album)
            else:
                db.session.add(artist)

            db.session.commit()
        except Exception as e:
            await db.session.rollback()
            return jsonify({'error': str(e)}), 500

        return jsonify({'message': 'Entry to database successful.'}), 201


    def retrieve_artist_list(self):
        stmt = select(Artist.ArtistId, Artist.Name).order_by(Artist.Name)
        result = db.session.execute(stmt).all()

        artists = [{'id': artist.ArtistId, 'name': artist.Name}
                   for artist in result]

        return jsonify(artists)


    def retrieve_album_by_artist_id(self, artist_id):
        artist = db.session.query(Artist).options(
            joinedload(Artist.albums).joinedload(Album.songs).joinedload(Song.review)
        ).filter(Artist.ArtistId == artist_id).first()

        if artist and artist.albums:
            artist.albums.sort(reverse=True, key=lambda album: album.ReleaseDate)

        return jsonify(ArtistSchema().dump(artist))


    # Potentially remove async and await
    def retrieve_album_by_url(self, url):
        album = db.session.query(Album).filter(Album.Url == url).first()
        if album:
            return jsonify(AlbumSchema().dump(album))
        else:
            return jsonify({'error': 'Album not found'}), 404


    def delete_database_entry(self, schema, id):
        try:
            attribute_id = f"{schema.__name__}Id"
            data = db.session.query(schema).filter(
                getattr(schema, attribute_id) == id).first()

            if data is None:
                return jsonify({'error': 'Data not found.'}), 404

            # 1 album or less remaining BEFORE deletion
            if (schema == Album and len(data.artist.albums) < 2):
                return self.delete_database_entry(Artist, data.ArtistId)
            else:
                db.session.delete(data)

            db.session.commit()
            return jsonify({'message': 'Data successfully deleted.'}), 200
        except Exception as e:
            db.session.rollback()
            return jsonify({'error': str(e)}), 500


    def __reset_database(self):
        try:
            db.session.query(Artist).delete()
            db.session.commit()
            return jsonify({'message': 'All entries successfully deleted.'}), 200
        except Exception as e:
            db.session.rollback()
            return jsonify({'error': str(e)}), 500
