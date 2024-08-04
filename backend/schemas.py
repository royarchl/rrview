from marshmallow import Schema, fields, pre_load, post_load
from marshmallow_sqlalchemy import SQLAlchemyAutoSchema, auto_field

from models import db, Artist, Album, Song, Review


class ReviewSchema(SQLAlchemyAutoSchema):
    class Meta:
        model = Review
        load_instance = True
        sqla_session = db.session

class SongSchema(SQLAlchemyAutoSchema):
    review = fields.Nested(ReviewSchema)

    class Meta:
        model = Song
        load_instance = True
        sqla_session = db.session


class AlbumSchema(SQLAlchemyAutoSchema):
    songs = fields.List(fields.Nested(SongSchema))

    class Meta:
        model = Album
        load_instance = True
        sqla_session = db.session


class ArtistSchema(SQLAlchemyAutoSchema):
    albums = fields.List(fields.Nested(AlbumSchema))

    class Meta:
        model = Artist
        load_instance = True
        sqla_session = db.session