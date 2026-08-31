package main

import (
    "fmt"
    "log"
    "net/http"

    "slot-game/backend/internal/database"
    "slot-game/backend/internal/handlers"
)

func main() {
    db, err := database.Connect()
    if err != nil {
        log.Fatalf("database connection failed: %v", err)
    }
    defer db.Close()

    log.Println("connected to database")

    http.HandleFunc("/health", handlers.Health)

    fmt.Println("Server running on http://localhost:8080")
    if err := http.ListenAndServe(":8080", nil); err != nil {
        log.Fatal(err)
    }
}