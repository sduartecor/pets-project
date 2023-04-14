"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Pet
from api.utils import generate_sitemap, APIException
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required, JWTManager
import hashlib
import json



api = Blueprint('api', __name__)

# ----------------------- Control ----------------------

# Registro
@api.route('/register', methods=['POST'])
def register():
    email = request.json.get('email')
    password = request.json.get('password')
    firstname = request.json.get('firstname')
    lastname = request.json.get('lastname')
    contact = request.json.get('contact')
    admin = request.json.get('admin')


    hashed_password = hashlib.sha256(password.encode()).hexdigest()

     # Verifico username que no exista
    user_query = User.query.filter_by(email=email).first() 

    if email == "":
        return jsonify({"msg": "Email can't be empty"}), 406
    if password == "":
        return jsonify({"msg": "Password can't be empty"}), 406
    if firstname == "":
        return jsonify({"msg": "Firstname can't be empty"}), 406
    if lastname == "":
        return jsonify({"msg": "Lastname can't be empty"}), 406
    if contact == "":
        return jsonify({"msg": "Contact can't be empty"}), 406

    if user_query is None:
        new_user = User(email=email, password=hashed_password,firstname=firstname,lastname=lastname,contact=contact,admin=admin)
        db.session.add(new_user)
        db.session.commit()
        return {'msg': 'New user created'}, 201
    
    return jsonify({"msg": "User exists"}), 406

# inicio de sesión
@api.route('/login', methods=['POST'])
def login():
    # 
    email = request.json.get('email')
    password = request.json.get('password')

    hashed_password = hashlib.sha256(password.encode()).hexdigest()

    user = User.query.filter_by(email=email, password=hashed_password).first()

    if user is None:
        return jsonify({"msg":"User doesn't exist"}), 404
    
    if email != user.email or not hashed_password:
        return jsonify({"msg": "Bad email or password"}), 401
    # Grants a token if login was successful
    else:
        access_token = create_access_token(identity=email)
            # Shows the token and the user info
        return jsonify({"msg": access_token,"user": user.serialize()}), 200

# Cambiar contraseña
@api.route('/users/change-password', methods=['PUT'])
def change_password():
    user_id = request.json.get('id')
    current_password = request.json.get('current_password')
    new_password = request.json.get('new_password')
    confirm_password = request.json.get('confirm_password')

    # Verificar que la nueva contraseña y la confirmación sean iguales
    if new_password != confirm_password:
        return {'message': 'La nueva contraseña y la confirmación no coinciden.'}, 400

    # Verificar que la contraseña actual sea correcta
    user = User.query.get(user_id)
    if not user or not user.check_password(current_password):
        return {'message': 'La contraseña actual es incorrecta.'}, 401

    # Cambiar la contraseña del usuario
    user.set_password(new_password)
    db.session.commit()

    return {'message': 'Contraseña actualizada correctamente.'}

# Validar token
@api.route("/valid-token", methods=["GET"])
@jwt_required()
def valid_token():
    # Access the identity of the current user with get_jwt_identity
    current_user = get_jwt_identity()
    user = User.query.filter_by(email=current_user).first()
    # Same as login, if the query brings nothing then it doesn't exist

    if current_user is None:
        return jsonify({"User not logged in"}), 402

    elif user is None:
        return jsonify({"status":False}), 404
    # If user is correct then it shows the user's info
    return jsonify({"status": True,"user": user.serialize()  }), 200

# ----------------------- Mascotas ----------------------

# Get - All Mascotas
@api.route('/pets', methods=['GET'])
def getPets():

    pets = Pet.query.all() 
    all_pets = list(map(lambda item: item.serialize(), pets))

    return jsonify(all_pets), 200

# Get - One Pets for ID
@api.route('/pets/<int:id>', methods=['GET'])
def getPet(id):

    pet = Pet.query.filter_by(id=id).first()

    if pet is not None:
        return jsonify(pet.serialize()), 200
    
    # Afuera del if
    response_body = {
            "msg": "Mascota no existe"
        }
    return jsonify(response_body), 400

# Post - Pets
@api.route('/pets', methods=['POST'])
def postPets():
    genero = request.json.get('genero')
    tamaño = request.json.get('tamaño')
    color = request.json.get('color')
    descripcion = request.json.get('descripcion')
    edad = request.json.get('edad')
    raza = request.json.get('raza')
    especie = request.json.get('especie')
    latitud = request.json.get('latitud')
    longitud = request.json.get('longitud')
    url = request.json.get('urlimage')
    user_id = request.json.get('usuario_id')
    # 

    
    if tamaño == "":
        return jsonify({"msg": "Debe seleccionar un tamaño"}), 406
    if color == "":
        return jsonify({"msg": "Color no puede estar vacio"}), 406
    if descripcion == "":
        return jsonify({"msg": "Descripción no puede estar vacio"}), 406
    if edad == "":
        return jsonify({"msg": "Debe seleccionar una edad"}), 406
    if especie == "":
        return jsonify({"msg": "Debe seleccionar una especie"}), 406
    if latitud == "" or longitud == "":
        return jsonify({"msg": "Debe seleccionar una ubicación"}), 406
    if len(url) == 0:
        return jsonify({"msg": "Debe subir una foto"}), 406


    newPets = Pet(genero=genero, tamaño=tamaño, color=color, descripcion=descripcion, edad=edad, raza=raza, especie=especie,latitud=latitud, longitud=longitud,url=url,user_id=user_id)
    db.session.add(newPets)
    db.session.commit()

    response_body = {
            "msg": "La mascota fue añadida con exito"
    }
    return jsonify(response_body), 200