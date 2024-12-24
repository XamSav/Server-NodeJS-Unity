const ErrorCodes = {
    USER_NOT_FOUND: { code: 404, message: "Usuario no encontrado" },
    INVALID_PASSWORD: { code: 401, message: "Contraseña incorrecta" },
    INVALID_FORMAT: { code: 400, message: "Formato de mensaje inválido" },
    UNKNOWN_EVENT: { code: 400, message: "Evento desconocido" },
    USER_ALREADY_EXISTS: { code: 409, message: "El usuario ya existe" },
    PASSWORD_COMPARISON_ERROR: {code: 500,message: "Error al comparar contraseñas."},
    INCORRECT_PASSWORD: {code: 401,message: "Contraseña incorrecta."},
    USER_FETCH_ERROR: {code: 500,message: "Error al obtener los datos del usuario."},
    MISSING_FIELDS: {code: 400,message: "Datos incompletos proporcionados."},
};

module.exports = { ErrorCodes };
