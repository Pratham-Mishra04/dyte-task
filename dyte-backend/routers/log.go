package routers

import (
	"github.com/Pratham-Mishra04/dyte/dyte-backend/controllers"
	"github.com/Pratham-Mishra04/dyte/dyte-backend/middlewares"
	"github.com/Pratham-Mishra04/dyte/dyte-backend/models"
	"github.com/gofiber/fiber/v2"
)

func LogRouter(app *fiber.App) {
	logRoutes := app.Group("/", middlewares.Protect)

	logRoutes.Get("/", controllers.GetLogs)
	logRoutes.Get("/filter_data", controllers.GetFilterData)
	logRoutes.Post("/", controllers.AddLog)

	logRoutes.Delete("/:logID", middlewares.UserAuthorization(models.Manager), controllers.DeleteLog)
}
