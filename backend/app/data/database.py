from pymongo import MongoClient

MONGO_URL = "mongodb://localhost:27017"

client = MongoClient(MONGO_URL)

db = client["lune_db"]

usuarios_collection = db["usuarios"]
perfiles_collection = db["perfiles"]
contactos_collection = db["contactos"]
mensajes_collection = db["mensajes"]