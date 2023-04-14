from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.dialects.postgresql import ARRAY
import hashlib

db = SQLAlchemy()

class User(db.Model):

    id = db.Column(db.Integer, primary_key=True)
    firstname = db.Column(db.String(80), unique=False, nullable=False)
    lastname = db.Column(db.String(80), unique=False, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(80), unique=False, nullable=False)
    contact = db.Column(db.String(80), unique=False, nullable=False)
    admin = db.Column(db.Boolean, unique=False, nullable=False)
    pets = db.relationship('Pet', backref='user', lazy=True)

    def __repr__(self):
        return f'<User {self.id}>'

    def serialize(self):
        return {
            "id": self.id,
            "firstname": self.firstname,
            "lastname": self.lastname,
            "email": self.email,
            "contact": self.contact,
            "admin": self.admin,
        # do not serialize the password, its a security breach
        }
    
    def set_password(self, password):
        """Cifra y guarda la contraseña del usuario."""
        self.password = hashlib.sha256(password.encode()).hexdigest()

    def check_password(self, password):
        """Verifica si la contraseña proporcionada es correcta."""
        return self.password == hashlib.sha256(password.encode()).hexdigest()
    

class Pet(db.Model):

    id = db.Column(db.Integer, primary_key=True)
    genero = db.Column(db.String(120), unique=False, nullable=True)
    tamaño = db.Column(db.String(120), unique=False, nullable=False)
    color = db.Column(db.String(80), unique=False, nullable=False)
    descripcion = db.Column(db.String(250), unique=False, nullable=True)
    edad = db.Column(db.String(80), unique=False, nullable=True)
    raza = db.Column(db.String(80), unique=False, nullable=True)
    especie = db.Column(db.String(80), unique=False, nullable=False)
    latitud = db.Column(db.String(100), unique=False, nullable=True)
    longitud = db.Column(db.String(100), unique=False, nullable=True)
    url = db.Column(ARRAY(db.String))
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))


    def __repr__(self):
        return f'<Pet {self.id}>'

    def serialize(self):
        return {
            "id": self.id,
            "genero": self.genero,
            "tamaño": self.tamaño,
            "color": self.color,
            "descripcion": self.descripcion,
            "edad": self.edad,
            "raza": self.raza,
            "especie": self.especie,
            "latitud": self.latitud,
            "longitud": self.longitud,
            "url": self.url,
            "user_id": self.user_id,
            # -
        }
