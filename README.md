# Sargam V2

**Welcome to Sargam V2**, a comprehensive multi-user music streaming platform that brings music to life through features tailored for listeners, creators, and admins. Sargam V2 enables users to explore music, manage playlists, view lyrics, and connect with artists. For creators, it offers tools to upload and manage songs and albums, and for admins, it provides a robust dashboard for monitoring platform activities.

## Features
- **Song and Album Streaming**: Stream music, view lyrics, and rate songs and albums.
- **Playlist Management**: Create and customize playlists based on mood or occasion.
- **Creator Features**: Upload new songs and albums, edit content, and manage your music.
- **Admin Dashboard**: View statistics on users, songs, and platform performance.
- **Role-Based Access Control (RBAC)**: Secure login for users, creators, and the admin.
- **Search and Filter**: Find songs by genre, artist, or rating for a personalized experience.
- **Scheduled Reports and Alerts**: Daily reminders for users and monthly activity reports for creators.

## Screenshots

## Screenshots
![Screenshot (508)](https://github.com/user-attachments/assets/5b5c241b-6b23-421e-abf8-83d822fc57a0)
![Screenshot (509)](https://github.com/user-attachments/assets/02cf71aa-06a7-4156-86a2-0addef8b0489)
![Screenshot (510)](https://github.com/user-attachments/assets/96b68c54-884a-431b-9ba2-112f46eca0f6)
![Screenshot (511)](https://github.com/user-attachments/assets/82cf690b-5477-401d-9dd5-58e25f4cb826)
![Screenshot (512)](https://github.com/user-attachments/assets/333a0093-bd39-417f-9138-b0bb8a76c9d4)
![Screenshot (513)](https://github.com/user-attachments/assets/dde3fa5e-6924-4ca8-8765-60d1336c7395)

## Technologies Used

### Backend
- **Flask**: Backend framework for web development.
- **Flask-Login**: User session management.
- **Flask-SQLAlchemy**: ORM for database interaction.
- **Redis**: Caching and background task management.
- **Celery**: Task queue for scheduling jobs.

### Frontend
- **Vue.js**: Framework for building a dynamic user interface.
- **Bootstrap**: Responsive and accessible design.
- **Jinja**: For rendering HTML templates in Flask.

## Database Schema Design
The Sargam V2 database structure includes the following tables:
- **User**: Stores user details and roles.
- **Song**: Contains song details such as lyrics, genre, and duration.
- **Album**: Holds information on albums, including associated songs.
- **Playlist**: Allows users to create collections of songs.
- **Rating**: Captures user ratings for songs and albums.

## Architecture and Files

### Root Folder Contains:
- **app.py**: Manages routes and API endpoints.
- **models.py**: Defines database models and their relationships.
- **graph.py**: Generates visualizations using Matplotlib for performance insights.
- **readme.md**: Documentation for setup and overview.
- **requirements.txt**: Lists all dependencies.
- **templates folder**: HTML templates for the frontend.
- **static folder**: Static files including CSS, images, and audio files.

### Detailed Files:
- **app.py**: Contains routes, manages sessions and roles, and configures scheduled tasks.
- **models.py**: Sets up database schema using SQLAlchemy.
- **graph.py**: Handles data visualization with charts and graphs for insights on app usage.

## Installation and Setup
### Prerequisites
To run Music Streaming App on your local device, you will need to have the following installed:

- Python 3
- Pip
- Node.js

### Creation of Virtual Environment
```
path to project file
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
---

This README provides a complete overview of the Sargam V2 app, guiding users and contributors through its features, architecture, database schema, and setup instructions.
