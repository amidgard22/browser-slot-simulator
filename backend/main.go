package main

import (
    "fmt"
    "log"
    "net/http"

    "github.com/joho/godotenv"
    "slot-game/backend/internal/database"
    "slot-game/backend/internal/handlers"
)

func main() {
    if err := godotenv.Load(); err != nil {
        log.Println("no .env file loaded, using system environment")
    }

    db, err := database.Connect()
    if err != nil {
        log.Fatalf("database connection failed: %v", err)
    }
    defer db.Close()

    log.Println("connected to database")

    http.HandleFunc("/health", handlers.WithCORS(handlers.Health))
    authHandler := handlers.NewAuthHandler(db)
    http.HandleFunc("/register", handlers.WithCORS(authHandler.Register))
    http.HandleFunc("/login", handlers.WithCORS(authHandler.Login))
    http.HandleFunc("/me", handlers.WithCORS(handlers.RequireAuth(authHandler.Me)))
    fmt.Println("Server running on http://localhost:8080")
    if err := http.ListenAndServe(":8080", nil); err != nil {
        log.Fatal(err)
    }
}