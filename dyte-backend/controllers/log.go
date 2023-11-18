package controllers

import (
	"crypto/sha256"
	"fmt"
	"strings"
	"time"

	"github.com/Pratham-Mishra04/dyte/dyte-backend/config"
	"github.com/Pratham-Mishra04/dyte/dyte-backend/initializers"
	"github.com/Pratham-Mishra04/dyte/dyte-backend/models"
	"github.com/Pratham-Mishra04/dyte/dyte-backend/utils"
	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

func AddEntry(body models.LogEntrySchema) {
	var log models.Log

	log.Level = body.Level
	log.Message = body.Message
	log.ResourceID = body.ResourceID
	log.TraceID = body.TraceID
	log.SpanID = body.SpanID
	log.Commit = body.Commit
	log.ParentResourceID = body.MetaData.ParentResourceID

	timestamp, err := time.Parse(time.RFC3339, body.Timestamp)
	if err == nil {
		log.Timestamp = timestamp
	}

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

func GetLogs(c *fiber.Ctx) error {
	paginatedDB := utils.Paginator(c)(initializers.DB)
	page := c.Query("page", "1")

	searchHash := getHashFromSearches(c)

	logsInCache := config.GetFromCache(searchHash + "_page_" + page)
	if logsInCache != nil {
		return c.Status(200).JSON(fiber.Map{
			"status": "success",
			"logs":   logsInCache,
		})
	}

	searchedDB := utils.Search(c)(paginatedDB)

	var logs []models.Log
	if err := searchedDB.
		Order("timestamp DESC").
		Find(&logs).Error; err != nil {
		return &fiber.Error{Code: 500, Message: "Database Error"}
	}

	go config.SetToCache(searchHash+"_page_"+page, logs)

	return c.Status(200).JSON(fiber.Map{
		"status": "success",
		"logs":   logs,
	})
}

func GetFilterData(c *fiber.Ctx) error {
	filterDataInCache := config.GetFilterDataFromCache("filterData")
	if filterDataInCache != nil {
		return c.Status(200).JSON(fiber.Map{
			"status":     "success",
			"filterData": filterDataInCache,
		})
	}

	filterData := models.FilterData{}

	fields := []string{"level", "resource_id", "trace_id", "span_id", "commit", "parent_resource_id"}
	for _, field := range fields {
		if values, err := getAllUniqueValues(initializers.DB, field); err == nil {
			switch field {
			case "level":
				filterData.Levels = values
			case "resource_id":
				filterData.ResourceIds = values
			case "trace_id":
				filterData.TraceIds = values
			case "span_id":
				filterData.SpanIds = values
			case "commit":
				filterData.Commits = values
			case "parent_resource_id":
				filterData.ParentResourceIds = values
			}
		}
	}

	go config.SetFilterDataToCache("filterData", filterData)

	return c.JSON(fiber.Map{
		"status":     "success",
		"filterData": filterData,
	})
}
func getAllUniqueValues(db *gorm.DB, field string) ([]string, error) {
	var values []string
	result := db.Model(&models.Log{}).Select(field).Group(field).Find(&values)
	if result.Error != nil {
		return nil, result.Error
	}
	return values, nil
}

func getHashFromSearches(c *fiber.Ctx) string {
	fields := []string{"message", "level", "resource_id", "trace_id", "span_id", "commit", "parent_resource_id", "start", "end"}
	var values []string

	for _, field := range fields {
		values = append(values, c.Query(field, ""))
	}

	combinedString := strings.Join(values, ",")

	hash := sha256.New()
	hash.Write([]byte(combinedString))
	hashValue := fmt.Sprintf("%x", hash.Sum(nil))

	return hashValue
}
