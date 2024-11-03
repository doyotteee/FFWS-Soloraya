package main

import (
    "log"
    "net/http"
    "github.com/gorilla/websocket"
)

// Upgrade connection to WebSocket
var upgrader = websocket.Upgrader{
    CheckOrigin: func(r *http.Request) bool {
        return true
    },
}

// Handle WebSocket connections
func handleConnections(w http.ResponseWriter, r *http.Request) {
    ws, err := upgrader.Upgrade(w, r, nil)
    if err != nil {
        log.Fatalf("Failed to upgrade HTTP connection: %v", err)
    }
    defer ws.Close()

    for {
        // Read message from WebSocket
        var msg map[string]interface{}
        err := ws.ReadJSON(&msg)
        if err != nil {
            log.Printf("Error reading JSON: %v", err)
            break
        }

        // Process the message (e.g., update water level)
        log.Printf("Received message: %v", msg)
    }
}

func main() {
    http.HandleFunc("/ws", handleConnections)

    // Serve static files (HTML, CSS, JS)
    fs := http.FileServer(http.Dir("./"))
    http.Handle("/", fs)

    log.Println("Server started on :3000")
    err := http.ListenAndServe(":3000", nil)
    if err != nil {
        log.Fatalf("Failed to start server: %v", err)
    }
}
