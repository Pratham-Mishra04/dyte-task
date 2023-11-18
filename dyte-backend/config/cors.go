package config

import (
	"github.com/Pratham-Mishra04/dyte/dyte-backend/initializers"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
)

func CORS() fiber.Handler {
	return cors.New(cors.Config{
		AllowOrigins:     initializers.CONFIG.FRONTEND_URL,
		AllowHeaders:     "Origin, Accept, Authorization",
		AllowMethods:     "GET",
		AllowCredentials: true,
	})
}
