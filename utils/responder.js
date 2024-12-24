function sendResponse(ws, eventName, data) {
    ws.send(JSON.stringify({ eventName, ...data }));
}

function sendError(ws, error) {
    ws.send(JSON.stringify({
        eventName: 'error',
        code: error.code,
        message: error.message
    }));
}

module.exports = { sendResponse, sendError };