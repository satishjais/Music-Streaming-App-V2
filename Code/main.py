from flask import Flask
from flask_security import SQLAlchemyUserDatastore, Security
from application.models import db, User, Role
from config import DevelopmentConfig
from application.resources import api
from application.sec import datastore
from application.instances import cache

from flask_mail import Mail, Message
from application.worker import make_celery
from celery.schedules import crontab



def create_app():
    app = Flask(__name__)
    app.config.from_object(DevelopmentConfig)
    db.init_app(app)
    api.init_app(app)
    app.security = Security(app, datastore)
    cache.init_app(app)


    

    with app.app_context():
        import application.views

    return app

app = create_app()
mail = Mail(app)
celery = make_celery(app)

@celery.on_after_finalize.connect
def setup_periodic_task(sender, **kwargs):
    sender.add_periodic_task(crontab(hour=23, minute =23), visit_reminder.s())
    sender.add_periodic_task(crontab(hour=23, minute =23), monthly_activity_report.s())

@celery.task()
def visit_reminder():
    users_to_remind= User.query.all()
    for user in users_to_remind:
        send_reminder(user)
    return "reminder sent successfully"

def send_reminder(user):
    with mail.connect() as conn:
        msg = Message(subject = "Reminder" , recipients = [user.email], sender = "satishjaiswalbackup2903@gmail.com") 
        msg.body = f"Hello {user.username}, \n\nhave you visited the music app today? Don't forget to visit the music app"
        conn.send(msg)

from sqlalchemy import func
from application.models import Song, Album, db
from datetime import datetime
from jinja2 import Template

def generate_monthly_report(user):
    songs_created = db.session.query(func.count(Song.id)).filter(Song.us_id == user.id).scalar()
    albums_created = db.session.query(func.count(Album.id)).filter(Album.user_id == user.id).scalar()
    total_ratings_received = db.session.query(func.sum(Song.ratings_count)).filter(Song.us_id == user.id).scalar()
    
    # Fetching the specific songs and albums for a particular user
    user_songs = Song.query.filter_by(us_id=user.id).all()
    user_albums = Album.query.filter_by(user_id=user.id).all()
    

    template = Template("""
    <h1>Monthly Activity Report for {{ user.username }}</h1>
    <p>Songs created: {{ songs_created }}</p>
    <p>Albums created: {{ albums_created }}</p>
    <p>Total ratings received: {{ total_ratings_received }}</p>
    <h2>Songs</h2>
    <ul>
    {% for song in user_songs %}
        <li>{{ song.song_name }}</li>
    {% endfor %}
    </ul>
    <h2>Albums</h2>
    <ul>
    {% for album in user_albums %}
        <li>{{ album.name }}</li>
    {% endfor %}
    </ul>
    """)

    report_content = template.render(user=user, songs_created=songs_created, albums_created=albums_created, total_ratings_received=total_ratings_received, user_songs=user_songs, user_albums=user_albums)

    return report_content

@celery.task()
def monthly_activity_report():
    if datetime.now().day == 14:
        creator_role = Role.query.filter_by(name='creator').first()
        if not creator_role:
            return "Not a creator"
        
        creator_users = User.query.filter(User.roles.contains(creator_role)).all()
        
        with mail.connect() as conn:
            for user in creator_users:
                report_content = generate_monthly_report(user)
                # send_email(user.email, 'Monthly Activity Report', report_content)
                msg = Message(subject = "Monthly Report" , recipients = [user.email], sender = "satishjaiswalbackup2903@gmail.com", html =generate_monthly_report(user))
                conn.send(msg)

            
        return 'Monthly activity reports have been generated and sent successfully.'
    else:
        return 'Monthly activity report will be generated on the first day of the month.'



# def test_mail():
#     with mail.connect() as conn:
#         msg = Message(subject = "Testing Mail" , recipients = ["XYZ@gmail.com"], sender = "XYZ@gmail.com") 
#         msg.body = "Hello Message"
#         conn.send(msg)

if __name__ == '__main__':
    # with app.app_context():
        # test_mail()
    app.run(debug=True)
