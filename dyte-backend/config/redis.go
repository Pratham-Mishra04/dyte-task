package config

import (
	"context"
	"fmt"

	"github.com/Pratham-Mishra04/dyte/dyte-backend/initializers"
	"github.com/redis/go-redis/v9"
)

var ctx = context.TODO()

func GetFromCache(key string) (string, error) {
	data, err := initializers.RedisClient.Get(ctx, key).Result()
	if err != nil {
		if err == redis.Nil {
			return "", fmt.Errorf("item not found in cache")
		}
		Logger.Warnw("Error Getting from cache", "Error:", err)
		return "", fmt.Errorf("error getting from cache")
	}
	return data, nil
}

func SetToCache(key string, data []byte) error {
	if err := initializers.RedisClient.Set(ctx, key, data, initializers.CacheExpirationTime).Err(); err != nil {

		Logger.Warnw("Error Setting to cache", "Error:", err)
		return fmt.Errorf("error setting to cache")
	}
	return nil
}

func RemoveFromCache(key string) error {
	err := initializers.RedisClient.Del(ctx, key).Err()
	if err != nil {
		if err == redis.Nil {
			return nil
		}
		Logger.Warnw("Error Removing from cache", "Error:", err)
		return fmt.Errorf("error removing from cache")
	}
	return nil
}
