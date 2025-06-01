package com.example.cinema.service;

import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

@Service
public class SeatService {

      private final StringRedisTemplate redisTemplate;

      public SeatService(StringRedisTemplate redisTemplate) {
            this.redisTemplate = redisTemplate;
      }

      public void bookSeat(String showtimeId, String seatCode, String userId) {
            String key = "showtime:" + showtimeId + ":seats";
            redisTemplate.opsForHash().put(key, seatCode, userId);
      }

      public boolean isSeatBooked(String showtimeId, String seatCode) {
            String key = "showtime:" + showtimeId + ":seats";
            return redisTemplate.opsForHash().hasKey(key, seatCode);
      }
}