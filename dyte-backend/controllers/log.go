package controllers

import (
	"github.com/Pratham-Mishra04/dyte/dyte-backend/config"
	"github.com/Pratham-Mishra04/dyte/dyte-backend/initializers"
	"github.com/Pratham-Mishra04/dyte/dyte-backend/models"
	"github.com/Pratham-Mishra04/dyte/dyte-backend/utils"
	"github.com/gofiber/fiber/v2"
)

func AddEntry(body models.LogEntrySchema) {
	var log models.Log

	log.Level = body.Level
	log.Message = body.Message
	log.ResourceID = body.ResourceID
	log.Timestamp = body.Timestamp
	log.TraceID = body.TraceID
	log.SpanID = body.SpanID
	log.Commit = body.Commit
	log.ParentResourceID = body.MetaData.ParentResourceID

	result := initializers.DB.Create(&log)
	if result.Error != nil {
		config.Logger.Errorw("Error while adding a log", "Error:", result.Error)
	} else {
		config.FlushCache()
	}
}

func AddLog(c *fiber.Ctx) error {
	var reqBody models.LogEntrySchema
	if err := c.BodyParser(&reqBody); err != nil {
		return &fiber.Error{Code: 400, Message: err.Error()}
	}

	go AddEntry(reqBody)

	return c.Status(200).JSON(fiber.Map{
		"status": "success",
	})
}

func GetAllLogs(c *fiber.Ctx) error {
	paginatedDB := utils.Paginator(c)(initializers.DB)
	page := c.Query("page", "1")

	logsInCache := config.GetFromCache("all_logs_page_" + page)
	if logsInCache != nil {
		return c.Status(200).JSON(fiber.Map{
			"status": "success",
			"logs":   logsInCache,
		})
	}

	var logs []models.Log
	if err := paginatedDB.
		Order("timestamp DESC").
		Find(&logs).Error; err != nil {
		return &fiber.Error{Code: 500, Message: "Database Error"}
	}

	config.SetToCache("all_logs_page_"+page, logs)

	return c.Status(200).JSON(fiber.Map{
		"status": "success",
		"logs":   logs,
	})
}

func GetSearchLogs(c *fiber.Ctx) error {
	return nil
}
