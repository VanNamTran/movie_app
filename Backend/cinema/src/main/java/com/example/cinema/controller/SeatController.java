package com.example.cinema.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.cinema.service.SeatService;

@RestController
@RequestMapping("/api/seats")
public class SeatController {

      @Autowired
      private SeatService seatService;

      @PostMapping("/book")
      public ResponseEntity<?> bookSeat(@RequestParam String showtimeId, @RequestParam String seatCode) {
            if (seatService.isSeatBooked(showtimeId, seatCode)) {
                  return ResponseEntity.status(HttpStatus.CONFLICT).body("Ghế đã được đặt");
            }
            seatService.bookSeat(showtimeId, seatCode, seatCode);
            return ResponseEntity.ok("Đặt ghế thành công");
      }
}
