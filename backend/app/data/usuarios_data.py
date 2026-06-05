"Base de datos simulado"

from app.models.usuario_model import Usuario

usuarios_db: list[Usuario] = [

    Usuario(
        id = 1,
        userName= "Gibran",
        password= "gibran"
    ),
    Usuario(
        id = 2,
        userName = "Abi",
        password = "abi123456789"
    )
]