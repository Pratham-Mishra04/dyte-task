package scripts

import (
	"encoding/json"
	"fmt"
	"log"
	"os"
	"time"

	"github.com/Pratham-Mishra04/dyte/dyte-backend/config"
	"github.com/Pratham-Mishra04/dyte/dyte-backend/initializers"
	"github.com/Pratham-Mishra04/dyte/dyte-backend/models"
	"golang.org/x/crypto/bcrypt"
)

func PopulateUsers() {
	log.Println("----------------Populating Users----------------")

	jsonFile, err := os.Open("scripts/users.json")
	if err != nil {
		log.Fatalf("Failed to open the JSON file: %v", err)
	}
	defer jsonFile.Close()

	var entries []models.UserCreateSchema
	jsonDecoder := json.NewDecoder(jsonFile)
	if err := jsonDecoder.Decode(&entries); err != nil {
		log.Fatalf("Failed to decode JSON: %v", err)
	}

	for i, entry := range entries {
		hash, err := bcrypt.GenerateFromPassword([]byte(entry.Password), 12)
		if err != nil {
			fmt.Println("Error while hashing Password.")
			go config.Logger.Errorw("Error while hashing Password.", "Error:", err)
		}

		user := models.LogUser{
			Username: entry.Username,
			Password: string(hash),
			Role:     entry.Role,
		}

		if err := initializers.DB.Create(&user).Error; err != nil {
			log.Printf("%d : Failed to insert user: %v", i, err)
		} else {
			log.Printf("%d : User inserted", i)
		}
	}
}

func PopulateLogs() {
	log.Println("----------------Populating Logs----------------")

	jsonFile, err := os.Open("scripts/logs.json")
	if err != nil {
		log.Fatalf("Failed to open the JSON file: %v", err)
	}
	defer jsonFile.Close()

	var entries []models.LogEntrySchema
	jsonDecoder := json.NewDecoder(jsonFile)
	if err := jsonDecoder.Decode(&entries); err != nil {
		log.Fatalf("Failed to decode JSON: %v", err)
	}

	for i, entry := range entries {
		var newLog models.Log

		newLog.Level = entry.Level
		newLog.Message = entry.Message
		newLog.ResourceID = entry.ResourceID
		newLog.TraceID = entry.TraceID
		newLog.SpanID = entry.SpanID
		newLog.Commit = entry.Commit
		newLog.ParentResourceID = entry.MetaData.ParentResourceID

		timestamp, err := time.Parse(time.RFC3339, entry.Timestamp)
		if err == nil {
			newLog.Timestamp = timestamp
		}

		if err := initializers.DB.Create(&newLog).Error; err != nil {
			log.Printf("%d : Failed to insert log: %v", i, err)
		} else {
			log.Printf("%d : Log inserted", i)
		}
	}
}
