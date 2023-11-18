package main

import (
	"github.com/Pratham-Mishra04/dyte/dyte-backend/config"
	"github.com/Pratham-Mishra04/dyte/dyte-backend/initializers"
	"github.com/Pratham-Mishra04/dyte/dyte-backend/routers"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/helmet"
	"github.com/gofiber/fiber/v2/middleware/logger"
)

func init() {
	initializers.LoadEnv()
	initializers.ConnectToDB()
	initializers.ConnectToCache()
	initializers.AutoMigrate()

	// scripts.PopulateLogs()

	config.AddLogger()
}

func main() {
	defer config.LoggerCleanUp()
	app := fiber.New(fiber.Config{
		ErrorHandler: fiber.DefaultErrorHandler,
	})

	app.Use(helmet.New())
	app.Use(logger.New())
	app.Use(config.CORS())
	// app.Use(config.RATE_LIMITER())

	routers.LogRouter(app)

	app.Listen(":" + initializers.CONFIG.PORT)
}
