package routers

import (
	"github.com/Pratham-Mishra04/dyte/dyte-backend/controllers"
	"github.com/gofiber/fiber/v2"
)

func LogRouter(app *fiber.App) {
	logRoutes := app.Group("/")

	logRoutes.Get("/", controllers.GetLogs)
	logRoutes.Post("/", controllers.AddLog)
}
