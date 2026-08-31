package database

import (
    "database/sql"
    "fmt"
    "os"

    _ "github.com/jackc/pgx/v5/stdlib"
)

func Connect() (*sql.DB, error) {
    url := os.Getenv("DATABASE_URL")
    if url == "" {
        url = "postgres://slot:slot@localhost:5432/slotgame?sslmode=disable"
    }

    db, err := sql.Open("pgx", url)
    if err != nil {
        return nil, fmt.Errorf("open database: %w", err)
    }

    if err := db.Ping(); err != nil {
        db.Close()
        return nil, fmt.Errorf("ping database: %w", err)
    }

    return db, nil
}