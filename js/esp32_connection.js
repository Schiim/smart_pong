// esp32_connection.js

// Verbindungsparameter
const esp32IpAddress = '192.168.1.107';  // Beispiel-IP-Adresse deines ESP32
const esp32Port = 80;  // Beispiel-Port für den WebSocket-Server

// Funktion zum Verbinden mit dem ESP32
function connectToESP32() {
    // WebSocket-Verbindung aufbauen
    const socket = new WebSocket(`ws://${esp32IpAddress}:${esp32Port}`);

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

// Export der Funktion, falls das Modul unterstützt wird
// export { connectToESP32 };
