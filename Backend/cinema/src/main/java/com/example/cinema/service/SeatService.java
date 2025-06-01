package com.example.cinema.service;

import com.example.cinema.entity.Seat;

import java.util.List;

public interface SeatService {

    List<Seat> getAllSeats();

    boolean reserveSeat(String seatNumber, Long userId);

    boolean reserveSeats(List<Seat> seats);

    void addSeat(Seat seat);

    void createSeats();
}
