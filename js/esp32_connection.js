// Verbindungsparameter
const esp32IpAddress = '192.168.1.107';  // Beispiel-IP-Adresse deines ESP32
const esp32Port = 80;  // Beispiel-Port für den WebSocket-Server

let socket;  // WebSocket-Verbindungsobjekt

// Funktion zum Verbinden mit dem ESP32 über WebSocket
function connectToESP32() {
    // WebSocket-Verbindung aufbauen
    socket = new WebSocket(`ws://${esp32IpAddress}:${esp32Port}`);

    // Eventlistener für die Verbindung
    socket.onopen = function() {
        console.log('Verbindung zum ESP32 hergestellt.');
        // Hier könnten weitere Aktionen nach erfolgreicher Verbindung folgen
    };

    socket.onerror = function(error) {
        console.error('Fehler beim Verbinden zum ESP32:', error);
    };

    // Weitere Eventlistener für Nachrichten, Schließen etc. hinzufügen
    socket.onmessage = function(event) {
        console.log('Nachricht vom ESP32:', event.data);
        // Hier können Aktionen für empfangene Nachrichten ausgeführt werden
    };

    socket.onclose = function(event) {
        console.log('Verbindung zum ESP32 geschlossen:', event);
        // Hier könnten Aktionen für geschlossene Verbindung folgen
    };

    return socket;
}

// Funktion zum Steuern der LED am ESP32
function controlLED(status) {
    if (socket.readyState === WebSocket.OPEN) {
        const message = JSON.stringify({ command: 'led_control', status: status });
        socket.send(message);
        console.log('Nachricht an ESP32 gesendet:', message);
    } else {
        console.error('WebSocket-Verbindung nicht geöffnet.');
    }
}

// Beispiel: LED ein- und ausschalten
function turnOnLED() {
    controlLED(true);
}

function turnOffLED() {
    controlLED(false);
}

// Verbindung zum WebSocket-Server herstellen
connectToESP32();
// Funktion zum Überprüfen des Verbindungsstatus zum ESP32
function checkConnectionStatus() {
    if (socket.readyState === WebSocket.CONNECTING) {
        console.log('Verbindung wird aufgebaut...');
    } else if (socket.readyState === WebSocket.OPEN) {
        console.log('Verbindung ist geöffnet und bereit für Kommunikation.');
    } else if (socket.readyState === WebSocket.CLOSING) {
        console.log('Verbindung wird geschlossen...');
    } else if (socket.readyState === WebSocket.CLOSED) {
        console.log('Verbindung ist geschlossen.');
    } else {
        console.log('Unbekannter Verbindungsstatus:', socket.readyState);
    }
}

// Beispiel: Überprüfen des Verbindungsstatus
setInterval(checkConnectionStatus, 5000); // Alle 5 Sekunden den Verbindungsstatus überprüfen

