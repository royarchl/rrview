import os

from flask import Flask, request, jsonify, session, make_response
from flask_httpauth import HTTPBasicAuth
from werkzeug.security import generate_password_hash, check_password_hash
from string import Template
from dotenv import load_dotenv

from models import db, Artist, Album
from spotify_service import SpotifyAlbumService
from database_service import DatabaseService

load_dotenv()


hostname = os.getenv('DB_ADDRESS')
username = os.getenv('DB_USERNAME')
password = os.getenv('DB_PASSWORD')
database = os.getenv('DB_NAME')

connection_template = Template(os.getenv('DB_CONNECTION_STRING'))
connection_string = connection_template.substitute(
    user=username, password=password, hostname=hostname, database=database)

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = connection_string
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')

auth = HTTPBasicAuth()

db.init_app(app)


users = {
    os.getenv('USER_NAME'): generate_password_hash(os.getenv('USER_PWD')),
}

# If @auth.verify_password fails it automatically returns a 401 response
@auth.verify_password
def verify_password(username, password):
    print(f"Received username: {username}, password: {password}")

    if username in users and check_password_hash(users.get(username), password):
        return username


@app.route('/api/login', methods=['POST'])
@auth.login_required
def login():
    session['user'] = auth.current_user()

    resp = make_response(jsonify({'message': 'Login successful'}), 200)
    resp.set_cookie('cookie_key', value='cookie_value',
                    domain='127.0.0.1', samesite=None)

    return resp
    # return jsonify({'message': 'Login successful'}), 200


@app.route('/api/logout', methods=['POST'])
def logout():
    session.pop('user', None)
    return jsonify({'message': 'Logout successful.'}), 200


@app.route('/api/check_auth', methods=['GET'])
@auth.login_required
def check_auth():
    return jsonify({'authenticated': True}), 200


@app.route('/api')
@auth.login_required
def home():
    return "Please use specific API endpoints to access the services."


@app.route('/api/delete/all', methods=['DELETE'])
@auth.login_required
def delete_all():
    return DatabaseService().__reset_database()


# NOTE: REMEMBER TO MAKE THESE ROUTES ONLY ACCESSIBLE VIA 'DELETE' METHOD!
@app.route('/api/delete/album/<album_id>', methods=['DELETE'])
@auth.login_required
def delete_album(album_id):
    return DatabaseService().delete_database_entry(Album, album_id)


@app.route('/api/delete/artist/<artist_id>', methods=['DELETE'])
@auth.login_required
def delete_artist(artist_id):
    return DatabaseService().delete_database_entry(Artist, artist_id)


# Unsure if this should be async - breaks when I try to
@app.route('/api/artists', methods=['GET'])
def artists():
    return DatabaseService().retrieve_artist_list()


@app.route('/api/albums/<artist_id>', methods=['GET'])
def albums(artist_id):
    return DatabaseService().retrieve_album_by_artist_id(artist_id)


@app.route('/api/get_album/<album_id>', methods=['GET', 'POST'])
@auth.login_required
async def get_album(album_id):
    return await SpotifyAlbumService().get_album_information(album_id)


@app.route('/api/upload', methods=['POST'])
@auth.login_required
async def upload():
    json_data = request.get_json()

    response, status_code = await DatabaseService().push_to_database(json_data)
    return response, status_code


@app.route('/api/edit/album', methods=['POST'])
@auth.login_required
def grab():
    json_data = request.get_json()
    return DatabaseService().retrieve_album_by_url(json_data['url'])


if (__name__ == '__main__'):
    app.run()
