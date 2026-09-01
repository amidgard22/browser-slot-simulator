package database

import (
    "database/sql"
    "fmt"
)

type User struct {
    ID           int
    Email        string
    PasswordHash string
}

func CreateUser(db *sql.DB, email, passwordHash string) error {
    _, err := db.Exec(
        "INSERT INTO users (email, password_hash) VALUES ($1, $2)",
        email, passwordHash,
    )
    if err != nil {
        return fmt.Errorf("insert user: %w", err)
    }
    return nil
}

func GetUserByEmail(db *sql.DB, email string) (*User, error) {
    row := db.QueryRow("SELECT id, email, password_hash FROM users WHERE email = $1", email)

    var user User

    err := row.Scan(&user.ID, &user.Email, &user.PasswordHash)

    if err != nil {
        if err == sql.ErrNoRows {
            return nil, nil
        }
        return nil, fmt.Errorf("get user by email: %w", err)
    }
    return &user, nil
}