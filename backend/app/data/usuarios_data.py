"Base de datos simulado"

from app.models.usuario_model import Usuario

usuarios_db: list[Usuario] = [

    Usuario(
        id=1,
        correo="gibran@gmail.com",
        userName="Gibran",
        password="gibran"
    ),
    Usuario(
        id=2,
        correo="abi@gmail.com",
        userName="Abi",
        password="abi123456789"
    )
]