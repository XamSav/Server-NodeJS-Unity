const { getUsers } = require('../modules/user-data');
// Obtener tabla de clasificaciones
// Modificación de la función getLeaderboardHTTP

/**
 * Maneja la petición HTTP GET /api/leaderboard y devuelve la tabla de clasificaciones
 * en formato JSON.
 * @param {Express.Request} req - La petición HTTP.
 * @param {Express.Response} res - La respuesta HTTP.
 * @returns {void}
 */
function getLeaderboardHTTP(req, res) {
    const leaderboard = getLeaderboard(); // Usar la función getUsers que devuelve solo nombre y puntuación
    res.status(200).json({ leaderboard });
}

/**
 * Devuelve la tabla de clasificaciones, ordenada por puntuaci n descendente.
 * @returns {array} Un array con la tabla de clasificaciones, siendo cada elemento
 *                  un objeto con las propiedades id, username y score.
 */
function getLeaderboard() {
    var p = getUsers();
    if(p === undefined || p.length === 0) return [];

    p.sort((a, b) => b.score - a.score).map(({ id, username, score }) => ({ id, username, score }));
    return [p]
}

module.exports = { getLeaderboardHTTP };