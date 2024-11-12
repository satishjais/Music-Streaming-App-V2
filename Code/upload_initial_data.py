from main import app
from application.sec import datastore
from application.models import db, Role
from flask_security import hash_password
from werkzeug.security import generate_password_hash

with app.app_context():
    db.create_all()
    
    datastore.find_or_create_role(name="admin", description="User is an admin")
    datastore.find_or_create_role(name="listener", description="User is an Listener")
    datastore.find_or_create_role(name="creator", description="User is a Creator")
    db.session.commit()
    if not datastore.find_user(email="admin@email.com"):
        datastore.create_user(email="admin@email.com", password=generate_password_hash("admin"),username=('adminji'), roles=["admin"]) #username also added as nullable = false
    if not datastore.find_user(email="listener1@email.com"):
        datastore.create_user(email="listener1@email.com", password=generate_password_hash("listener1"),username='listener1',roles=["listener"])
    if not datastore.find_user(email="listener2@email.com"):
        datastore.create_user(email="listener2@email.com", password=generate_password_hash("listener2"),username='listener2', roles=["listener"])
    if not datastore.find_user(email="creator@email.com"):
        datastore.create_user(email="creator@email.com", password=generate_password_hash("creator"),username="creator", roles=["creator"], active=True)
    if not datastore.find_user(email="satishjaiswal90311@gmail.com"):
        datastore.create_user(email="satishjaiswal90311@gmail.com", password=generate_password_hash("12345"),username='satish', roles=["listener"])
    db.session.commit() 

