package com.example.cinema.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class RedisTestController {

      @Autowired
      private StringRedisTemplate redisTemplate;

      @GetMapping("/api/redis/test")
      public String testRedisConnection() {
            try {
                  redisTemplate.opsForValue().set("testKey", "helloRedis");
                  String value = redisTemplate.opsForValue().get("testKey");
                  return "Redis OK ✅ - Value from Redis: " + value;
            } catch (Exception e) {
                  e.printStackTrace();
                  return "Redis connection failed gghj❌: " + e.getMessage();
            }
      }
}
