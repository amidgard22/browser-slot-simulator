package handlers

import (
	"context"
	"net/http"
	"strings"

	"slot-game/backend/internal/auth"
)

type contextKey string

const userClaimsKey contextKey = "userClaims"

func RequireAuth(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		header := r.Header.Get("Authorization")
		if header == "" || !strings.HasPrefix(header, "Bearer ") {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		tokenString := strings.TrimPrefix(header, "Bearer ")
		claims, err := auth.ValidateToken(tokenString)
		if err != nil {
			http.Error(w, "Unauthorized", http.StatusUnauthorized)
			return
		}

		ctx := context.WithValue(r.Context(), userClaimsKey, claims)
		next(w, r.WithContext(ctx))
	}
}

func claimsFromContext(r *http.Request) (*auth.Claims, bool) {
	claims, ok := r.Context().Value(userClaimsKey).(*auth.Claims)
	return claims, ok
}
