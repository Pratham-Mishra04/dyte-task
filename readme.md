# Dyte SDE Internship Task

## Overview

Welcome to the Dyte **Log Ingestor** and **Query Interface** repository! This repository combines the frontend and backend components required for the task assigned during the SDE internship process at Dyte. The primary goal of this project is to create a comprehensive log ingestor along with a user-friendly web interface for efficient log querying.

## Repository Structure

- **Dyte-frontend:** This folder contains the frontend code for the web interface. It is implemented in TypeScript using Next.js and styled with Tailwind CSS.

- **Dyte-backend:** The backend logic resides in this folder. It is developed in Golang, utilizing the goFiber web framework and GORM as the Object-Relational Mapping (ORM) library. The backend integrates with PostgreSQL for the main database and utilizes Redis for caching.

## Task Description

The task assigned for the SDE internship process at Dyte involves the creation of a log ingestor capable of efficiently handling logs and a web interface to facilitate the querying of these logs. The goal is to design a system that is both performant and user-friendly.

## Technologies Used

#### Frontend

- **Language:** TypeScript
- **Framework:** Next.js
- **CSS Framework:** Tailwind CSS

#### Backend

- **Language:** Golang
- **Web Framework:** goFiber
- **ORM:** GORM
- **Databases:** PostgreSQL (main database), Redis (caching)

## Usage

To utilize the Dyte Log Ingestor and Query Interface, follow these steps:

#### Clone the Repository

```bash
git clone https://github.com/Pratham-Mishra04/dyte-task
cd dyte-task
```

- Then follow the commands mentioned in the this document later

# Web Interface (Frontend)

## Directory Structure

The frontend of the Dyte Log Ingestor project is organized with the following directory structure:

- **/public:** Public assets and files.

- **/src/components:** React components used throughout the application.

- **/src/handlers:** Request handlers responsible for connecting with the backend.

- **/src/pages:** Individual pages of the web application.

- **/src/styles:** Styling files, including CSS or other styling languages.

- **/src/utils:** Utility functions and helper files.

## Environment Variables

Copy the `env.sample` file to `.env` and customize it according to your needs. This file contains environment variables used by the frontend.

## Running the Frontend

To run the Dyte Log Ingestor Frontend, follow these steps:

1. Ensure you have Docker installed on your system.

2. Open a terminal and navigate to the root directory of the frontend.

3. Run the following commands:

    ```bash
    sudo docker compose build
    sudo docker compose up
    ```

4. The application will be accessible at `http://localhost:8000` by default.

## Screenshots

#### Dashboard

![Dashboard](path/to/dashboard-screenshot.png)

*Caption: Screenshot of the Dashboard page.*

#### Log Viewer

![Log Viewer](path/to/log-viewer-screenshot.png)

*Caption: Screenshot of the Log Viewer page.*

# API (Backend)

## Log Model

The `Log` model is structured as follows:

- **Level:** Log severity level.
- **Message:** Log message.
- **ResourceID:** Unique identifier for the resource associated with the log.
- **Timestamp:** Timestamp when the log was recorded.
- **TraceID:** Unique identifier for tracing purposes.
- **SpanID:** Unique identifier for the span of the log.
- **Commit:** Commit identifier.
- **ParentResourceID:** Unique identifier for the parent resource.

## Endpoints

### 1. Get All Logs

- **Endpoint:** `GET /`
- **Description:** Retrieve all logs, with optional query parameters for pagination and filtering.
- **Query Parameters:**
  - `page`: Page number for paginated queries (default: 1).
  - `limit`: Number of logs per page in paginated queries (default: 10).
  - `message`: Search logs by message.
  - `level`: Filter logs by severity level.
  - `resource_id`: Filter logs by resource ID.
  - `trace_id`: Filter logs by trace ID.
  - `span_id`: Filter logs by span ID.
  - `commit`: Filter logs by commit.
  - `parent_resource_id`: Filter logs by parent resource ID.
  - `start`: Filter logs starting from a specific time.
  - `end`: Filter logs up to a specific time.
- **Sample Request**
    `/?page=1&limit=10&level=error&message=user&commit=5e5342f`
  <small>*- Multiple queries are supported*</small>
- **Response Format:**
  ```json
  {
    "status": "success"|"failed",
    "message": "Message from the API",
    "logs": [
      {
        "level": "info",
        "message": "Log message",
        "resourceId": "server-123",
        "timestamp": "2023-09-15T08:00:00Z",
        "traceId": "abc-xyz-123",
        "spanId": "span-456",
        "commit": "5e5342f",
        "parentResourceId": "server-0987"
      },
      // Additional log entries...
    ]
  }
  ```


### 2. Add a Log

- **Endpoint:** `POST /`
- **Description:** Add a new log entry to the database.
- **Request Format:**
  ```json
  {
    "level": "error",
    "message": "Failed to connect to DB",
    "resourceId": "server-1234",
    "timestamp": "2023-09-15T08:00:00Z",
    "traceId": "abc-xyz-123",
    "spanId": "span-456",
    "commit": "5e5342f",
    "metadata": {
        "parentResourceId": "server-0987"
    }
  }

- **Response Format:** The response from the `POST /` endpoint is in JSON format and follows the structure below:

    ```json
    {
    "status": "success" | "failed",
    "message": "Message from the API"
    }
    ```

#### 3. Get Filter Metadata

- **Endpoint:** `GET /filter_data`
- **Description:** Used by the frontend to retrieve unique levels, resource IDs, trace IDs, span IDs, commits, and parent resource IDs.
- **Response Format:**
  ```json
  {
    "status": "success"|"failed",
    "message": "Message from the API",
    "filterData": {
      "levels": ["info", "error", ...],
      "resourceIds": ["server-123", "server-456", ...],
      "traceIds": ["abc-xyz-123", "abc-xyz-456", ...],
      "spanIds": ["span-456", "span-789", ...],
      "commits": ["5e5342f", "a1b2c3d", ...],
      "parentResourceIds": ["server-0987", "server-6543", ...]
    }
  }
    ```
    
## Caching

Redis is utilized for caching in this system. The filters used in queries are converted into a hash, serving as the key for the Redis storage. This approach ensures that redundant queries for the same filter do not incur additional processing time. The Redis storage also considers pagination, using the default limit of 10.

## Environment Variables

A sample of the environment file is provided in the root directory of the backend, named `.env.sample`.

## Running the Backend

To run the Dyte Log Ingestor Backend, follow these steps:

1. Ensure you have Docker installed on your system.

2. Open a terminal and navigate to the root directory of the backend.

3. Run the following commands:

    ```bash
    sudo docker compose build
    sudo docker compose up
    ```

4. The application will be accessible at `http://localhost:3000` by default.

## Efficiency

The architecture prioritizes speed and efficiency. Golang is chosen for its excellent support for multi-core processing. The POST endpoint uses goroutines to establish multiple concurrent connections to the database, leveraging multiple CPU cores to process requests rapidly. In case of any errors during log addition, they are logged in the logs folder.

PostgreSQL is chosen due to its ACID compliance, ensuring efficient and secure handling of multiple connections without concerns about transaction overhead or data integrity.

Redis is utilized for caching in this system. The filters used in queries are converted into a hash, serving as the key for the Redis storage. This approach ensures that redundant queries for the same filter do not incur additional processing time.

# Conclusion

In the span of just two days, building the Dyte Log Ingestor and Query Interface has been an exhilarating experience. The focus on speed and efficiency, coupled with technologies like Golang, PostgreSQL, and Redis, has allowed me to craft a robust and performant system.

Navigating through the intricacies of Golang's multi-core processing, leveraging Docker for seamless deployment, and implementing caching with Redis has been both challenging and rewarding. The choice of PostgreSQL for its ACID compliance has ensured a reliable foundation for handling multiple connections without compromising on transactional integrity.

As the codebase comes together, I'm eager to show it to the concerned authorities and know how can I improve on this. I really look forward to hearing back from Dyte and eagerly anticipate the opportunity to discuss and showcase my skills in the next stages of the selection process.

Thank you for the opportunity, and I'm enthusiastic about the possibility of contributing to the innovative work at Dyte!

Best Regards,
Pratham Mishra