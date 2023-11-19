FROM golang:1.20

# Set destination for COPY
WORKDIR /app

# Download Go modules
COPY go.mod go.sum ./

# Install app dependencies
RUN go mod download

COPY . .

RUN mkdir /app/logs

# Build
RUN CGO_ENABLED=0 GOOS=linux go build -o /main

EXPOSE 3000

# Run
CMD ["/main"]
