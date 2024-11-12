
# MusicStreamingApp
A lightweight music application where a user can find various songs, their lyrics, artist, genre can give ratings. They can also collect their favourite songs at a particular place by creating a playlist. 
It also gives them a functionality to become a creator where they can become a creator and can upload their own songs and release their own albums.

# Getting Started
### Prerequisites
To run Music Streaming App on your local device, you will need to have the following installed:

- Python 3
- Pip
- Node.js

### Creation of Virtual Environment
```
cd /mnt/c/Users/satis/Desktop/MAD2NEW
sudo apt-get update
sudo apt-get install libpython3-dev
sudo apt-get install python3-venv
python3 -m venv whatever
```
### start the virtual environment
```
source whatever/bin/activate
```

### Installation
Install the required packages inside myenv
```
pip install -r requirements.txt

```
### Start the redis server

```
redis-server
```
### to stop redis server
```
sudo service redis-server stop

```
### Start the celery worker

```
celery -A app.celery worker --loglevel=info
```
### Start the celery worker
```
celery -A app.celery beat --loglevel=info

```
### Start the app
start the app

```
python main.py

```
### DataBase Creation
python upload_initial_data.py
```
### Usage
Register for an account if you are new or login if you already have one.
Once logged in, you can create playlists,become a creator, can create your albumns, give ratings etc.



