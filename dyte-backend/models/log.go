package models

import (
	"time"

	"gorm.io/gorm"
)

type Log struct {
	gorm.Model
	Level            string    `json:"level" gorm:"index:idx_level"`
	Message          string    `json:"message"`
	ResourceID       string    `json:"resourceId" gorm:"index:idx_resource_id"`
	Timestamp        time.Time `json:"timestamp" gorm:"index:idx_timestamp"`
	TraceID          string    `json:"traceId" gorm:"index:idx_trace_id"`
	SpanID           string    `json:"spanId" gorm:"index:idx_span_id"`
	Commit           string    `json:"commit"`
	ParentResourceID string    `json:"parentResourceId" gorm:"index:idx_parent_resource_id"`
}

type MetaData struct {
	ParentResourceID string `json:"parentResourceId"`
}

type LogEntrySchema struct {
	Level      string    `json:"level"`
	Message    string    `json:"message"`
	ResourceID string    `json:"resourceId"`
	Timestamp  time.Time `json:"timestamp"`
	TraceID    string    `json:"traceId"`
	SpanID     string    `json:"spanId"`
	Commit     string    `json:"commit"`
	MetaData   MetaData  `json:"metadata"`
}
