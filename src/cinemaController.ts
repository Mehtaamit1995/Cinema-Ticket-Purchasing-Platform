import { Request, Response } from 'express';
import { Cinema, Seat } from './types';
import {
    InvalidInputError,
    CinemaNotFoundError,
    SeatNotFoundError,
    SeatAlreadyPurchasedError
} from './error-handler.service';

let nextCinemaId = 1;
const cinemas: Cinema[] = [];

// <<--Create a cinema with N seats -->>
export function createCinema(req: Request, res: Response): void {
    try {
        const numSeats: number = req.body.numSeats;

        // <<-- Check if the number of seats is valid -->>
        if (!numSeats || typeof numSeats !== 'number' || numSeats <= 0) {
            throw new InvalidInputError('Invalid number of seats');
        }

        // <<-- Create a new cinema object with the specified number of seats -->>
        const cinema: Cinema = {
            id: nextCinemaId,
            seats: Array.from({ length: numSeats }, (_, index) => ({
                id: index + 1,
                cinemaId: nextCinemaId,
                isPurchased: false
            }))
        };

        // <<-- Add the cinema to the list of cinemas and increment the ID for the next cinema -->>
        cinemas.push(cinema);
        nextCinemaId++;

        // <<-- Return the cinema ID as the response -->>
        res.json({ cinemaId: cinema.id });
    } catch (error) {
        // <<-- Handle and return the error if any exception occurs -->>
        if (error instanceof InvalidInputError) {
            res.status(400).json({
                error: error.message
            });
        } else {
            res.status(500).json({
                error: 'Internal server error'
            });
        }
    }
}

// <<-- Purchase a specific seat in a cinema -->>
export function purchaseSeat(req: Request, res: Response): void {
    try {
        const cinemaId: number = parseInt(req.params.cinemaId);
        const seatId: number = parseInt(req.params.seatId);

        // <<-- Check if the cinema ID is valid -->>
        if (!cinemaId || typeof cinemaId !== 'number' || cinemaId <= 0) {
            throw new InvalidInputError('Invalid cinema ID');
        }

        // <<-- Check if the seat ID is valid -->>
        if (!seatId || typeof seatId !== 'number' || seatId <= 0) {
            throw new InvalidInputError('Invalid seat ID');
        }

        // <<-- Find the cinema with the specified ID -->>
        const cinema: Cinema | undefined = cinemas.find(
            (c) => c.id === cinemaId
        );

        // <<-- Return an error if the cinema is not found -->>
        if (!cinema) {
            throw new CinemaNotFoundError();
        }

        // <<-- Find the seat with the specified ID in the cinema -->>
        const seat: Seat | undefined = cinema.seats.find(
            (s) => s.id === seatId
        );

        // <<-- Return an error if the seat is not found -->>
        if (!seat) {
            throw new SeatNotFoundError();
        }

        // <<-- Check if the seat has already been purchased -->>
        if (seat.isPurchased) {
            throw new SeatAlreadyPurchasedError();
        }

        // <<-- Mark the seat as purchased and return it as the response -->>
        seat.isPurchased = true;
        res.json({ seat });
    } catch (error) {
        // <<-- Handle and return the error if any exception occurs -->>
        if (
            error instanceof InvalidInputError ||
            error instanceof CinemaNotFoundError ||
            error instanceof SeatNotFoundError ||
            error instanceof SeatAlreadyPurchasedError
        ) {
            res.status(400).json({
                error: error.message
            });
        } else {
            res.status(500).json({
                error: 'Internal server error'
            });
        }
    }
}

// <<-- Purchase the first two free consecutive seats in a cinema -->>
export function purchaseConsecutiveSeats(req: Request, res: Response): void {
    try {
        const cinemaId: number = parseInt(req.params.cinemaId);

        // <<-- Check if the cinema ID is valid -->>
        if (!cinemaId || typeof cinemaId !== 'number' || cinemaId <= 0) {
            throw new InvalidInputError('Invalid cinema ID');
        }

        // <<-- Find the cinema with the specified ID -->>
        const cinema: Cinema | undefined = cinemas.find(
            (c) => c.id === cinemaId
        );

        // <<-- Return an error if the cinema is not found -->>
        if (!cinema) {
            throw new CinemaNotFoundError();
        }

        const seats: Seat[] = cinema.seats;
        let firstSeatIndex = -1;

        // <<-- Find the first two consecutive free seats -->>
        for (let i = 0; i < seats.length - 1; i++) {
            if (!seats[i].isPurchased && !seats[i + 1].isPurchased) {
                firstSeatIndex = i;
                break;
            }
        }

        // <<-- Return an error if no consecutive seats are available -->>
        if (firstSeatIndex === -1) {
            throw new Error('No consecutive seats available');
        }

        // <<-- Get the consecutive seats -->>
        const consecutiveSeats: Seat[] = seats.slice(
            firstSeatIndex,
            firstSeatIndex + 2
        );

        // <<-- Mark the consecutive seats as purchased -->>
        consecutiveSeats.forEach((seat) => {
            seat.isPurchased = true;
        });

        // <<-- Return the consecutive seats as the response -->>
        res.json({ seats: consecutiveSeats });
    } catch (error) {
        // <<-- Handle and return the error if any exception occurs -->>
        if (
            error instanceof InvalidInputError ||
            error instanceof CinemaNotFoundError ||
            error instanceof SeatNotFoundError ||
            error instanceof SeatAlreadyPurchasedError
        ) {
            res.status(400).json({
                error: 'Bad Request',
                message: (error as Error).message
            });
        } else {
            res.status(500).json({
                error: 'Internal server error'
            });
        }
    }
}
