from marshmallow import Schema, fields, pre_load


class SongSchema(Schema):
    title = fields.Str()
    url = fields.Str()
    features = fields.Str()

    @pre_load
    def process_song_data(self, data, **kwargs):
        featured_artists = ', '.join(artist['name'] for artist in data['artists'][1:])
        return {
            'title': data['name'],
            'url': data['href'],
            'features': featured_artists
        }


class SpotifyAlbumResponseSchema(Schema):
    artist_name = fields.Str()
    album_title = fields.Str()
    album_release_date = fields.Str()
    album_url = fields.Str()
    album_art_url = fields.Str()
    songs = fields.List(fields.Nested(SongSchema))

    @pre_load
    def process_album_data(self, data, **kwargs):
        return {
            'artist_name': data['artists'][0]['name'],
            'album_title': data['name'],
            'album_release_date': data['release_date'],
            'album_url': data['external_urls']['spotify'],
            'album_art_url': data['images'][0]['url'],
            'songs': data['tracks']['items']
        }