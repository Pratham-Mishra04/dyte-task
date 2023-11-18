package main

import (
	"github.com/Pratham-Mishra04/dyte/dyte-backend/config"
	"github.com/Pratham-Mishra04/dyte/dyte-backend/initializers"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/helmet"
	"github.com/gofiber/fiber/v2/middleware/logger"
)

func init() {
	initializers.LoadEnv()
	initializers.ConnectToDB()
	initializers.ConnectToCache()
	initializers.AutoMigrate()

	config.AddLogger()
}

func main() {
	defer config.LoggerCleanUp()
	app := fiber.New(fiber.Config{
		ErrorHandler: fiber.DefaultErrorHandler,
		BodyLimit:    config.BODY_LIMIT,
	})

	app.Use(helmet.New())
	app.Use(logger.New())
	app.Use(config.CORS())
	// app.Use(config.RATE_LIMITER())

	app.Listen(":" + initializers.CONFIG.PORT)
}
