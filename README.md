# rrview

**A personal project for posting (and later hosting) album reviews.**

I used to manually post these albums in Discord for friends but got tired of the
limited character count for messages. Naturally, I decided to make use of my
skills and develop a proper website to host these reviews and, at the same time,
make it look nicer and my life easier. Making use of the SpotifyAPI, I send a
query based on the supplied album link which retrieves all the necessary
information for populating the submission form. Then, I simply add my rating
(bool) to each song and submit; a million times better than my prior, manual
method. This information is then stored in a (MariaDB) database and accessed
from the frontend via exposed API endpoints.

NOTE: The backend is a rewrite of an earlier version I developed in C#. Having
to rewrite everything in an entirely new language enriched my understanding of
what I was doing and made me appreciate the simplicity of Python.

![alt text](https://github.com/royarchl/rrview/assets/home-page.png "Home page")
![alt text](https://github.com/royarchl/rrview/assets/albums-page.png "Albums page")

## Tools
- HTML, CSS, JavaScript
- Python
- MariaDB

## Dependencies
### Frontend
- Handlebars.js
- Google Material Symbols
### Backend
- Flask
    - flask-sqlalchemy
    - flask-httpauth
- httpx
- marshmallow
    - marshmallow-sqlalchemy
- PyMySQL
- python-dotenv
- SQLAlchemy
