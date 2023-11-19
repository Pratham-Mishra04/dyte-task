package controllers

import (
	"time"

	"github.com/Pratham-Mishra04/dyte/dyte-backend/config"
	"github.com/Pratham-Mishra04/dyte/dyte-backend/initializers"
	"github.com/Pratham-Mishra04/dyte/dyte-backend/models"
	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

func CreateSendToken(c *fiber.Ctx, user models.User, statusCode int, message string) error {
	access_token_claim := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"sub": user.ID,
		"crt": time.Now().Unix(),
		"exp": time.Now().Add(config.ACCESS_TOKEN_TTL).Unix(),
	})

	refresh_token_claim := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"sub": user.ID,
		"crt": time.Now().Unix(),
		"exp": time.Now().Add(config.REFRESH_TOKEN_TTL).Unix(),
	})

	access_token, err := access_token_claim.SignedString([]byte(initializers.CONFIG.JWT_SECRET))
	if err != nil {
		go config.Logger.Errorw("Error while decrypting JWT Token.", "Error:", err)
		return &fiber.Error{Code: 500, Message: config.SERVER_ERROR}
	}

	refresh_token, err := refresh_token_claim.SignedString([]byte(initializers.CONFIG.JWT_SECRET))
	if err != nil {
		go config.Logger.Errorw("Error while decrypting JWT Token.", "Error:", err)
		return &fiber.Error{Code: 500, Message: config.SERVER_ERROR}
	}

	c.Cookie(&fiber.Cookie{
		Name:     "refresh_token",
		Value:    refresh_token,
		Expires:  time.Now().Add(config.REFRESH_TOKEN_TTL),
		HTTPOnly: true,
		Secure:   true,
	})

	return c.Status(statusCode).JSON(fiber.Map{
		"status":  "success",
		"message": message,
		"token":   access_token,
		"user":    user,
	})
}

func SignUp(c *fiber.Ctx) error {
	var reqBody models.UserCreateSchema

	c.BodyParser(&reqBody)

	hash, err := bcrypt.GenerateFromPassword([]byte(reqBody.Password), 12)
	if err != nil {
		go config.Logger.Errorw("Error while hashing Password.", "Error:", err)
		return &fiber.Error{Code: 500, Message: config.SERVER_ERROR}
	}

	newUser := models.User{
		Password: string(hash),
		Username: reqBody.Username,
	}

	result := initializers.DB.Create(&newUser)
	if result.Error != nil {
		config.Logger.Errorw("Error while adding a user", "Error:", result.Error)
		return &fiber.Error{Code: 500, Message: config.DATABASE_ERROR}
	} else {
		return CreateSendToken(c, newUser, 201, "Account Created")
	}
}

func LogIn(c *fiber.Ctx) error {
	var reqBody struct {
		Username string `json:"username"`
		Password string `json:"password"`
	}

	if err := c.BodyParser(&reqBody); err != nil {
		return &fiber.Error{Code: 400, Message: "Validation Failed"}
	}

	var user models.User
	if err := initializers.DB.First(&user, "username = ? ", reqBody.Username).Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return &fiber.Error{Code: 400, Message: "No account with these credentials found."}
		} else {
			return &fiber.Error{Code: 500, Message: config.DATABASE_ERROR}
		}
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(reqBody.Password)); err != nil {
		return &fiber.Error{Code: 400, Message: "No account with these credentials found."}
	}

	return CreateSendToken(c, user, 200, "Logged In")
}
