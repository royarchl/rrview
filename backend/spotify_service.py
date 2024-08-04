import os
import base64
import httpx

from datetime import datetime, timedelta

from response_schemas import SpotifyAlbumResponseSchema


class SpotifyAlbumService:
    def __init__(self):
        self.client_id = os.getenv('SPOTIFY_CLIENT_ID')
        self.client_secret = os.getenv('SPOTIFY_CLIENT_SECRET')
        self.token_url = os.getenv('SPOTIFY_TOKEN_URL')
        self._access_token = None
        self._expiration_time = datetime.min


    async def __get_access_token(self):
        client_id_and_secret = f"{self.client_id}:{self.client_secret}"
        base64_auth_string = base64.b64encode(client_id_and_secret.encode('utf-8')).decode('utf-8')

        headers = {
            'Authorization': f"Basic {base64_auth_string}",
            'Content-Type': 'application/x-www-form-urlencoded'
        }
        data = { 'grant_type': 'client_credentials' }

        async with httpx.AsyncClient() as client:
            response = await client.post(self.token_url, headers=headers, data=data)
            response.raise_for_status()
            content = response.json()
            self._access_token = content['access_token']
            self._expiration_time = datetime.now() + timedelta(seconds=content['expires_in'])


    async def get_album_information(self, album_id):
        if (datetime.now() >= self._expiration_time):
            await self.__get_access_token()

        url = f"https://api.spotify.com/v1/albums/{album_id}"
        headers = {
            'Authorization': f"Bearer {self._access_token}"
        }

        async with httpx.AsyncClient() as client:
            response = await client.get(url, headers=headers)
            response.raise_for_status()
            content = response.json()

        return self.__package_json_information(SpotifyAlbumResponseSchema, content)


    def __package_json_information(self, schema_class, json):
        return schema_class().load(json)