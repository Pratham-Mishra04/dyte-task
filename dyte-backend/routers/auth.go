package routers

import (
	"github.com/Pratham-Mishra04/dyte/dyte-backend/controllers"
	"github.com/gofiber/fiber/v2"
)

func AuthRouter(app *fiber.App) {
	app.Post("/signup", controllers.SignUp)
	app.Post("/login", controllers.LogIn)
	app.Post("/refresh", controllers.Refresh)
}
