import express from 'express';
import {
    createCinema,
    purchaseSeat,
    purchaseConsecutiveSeats
} from './cinemaController';

//<<-- Create an instance of the Express Router -->>
const router = express.Router();

//<<-- Define the API routes and their corresponding handlers -->>
router.post('/cinemas', createCinema);
router.post('/cinemas/:cinemaId/purchase/:seatId', purchaseSeat);
router.post(
    '/cinemas/:cinemaId/purchase-consecutive',
    purchaseConsecutiveSeats
);

// <<-- Export the router -->>
export default router;
