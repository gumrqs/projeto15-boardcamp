import { Router } from "express";
import { allRentals, finishRental, rental } from "../controllers/rentalsControllers.js";

const rentalRouter = Router();

rentalRouter.get('/rentals', allRentals );
rentalRouter.post('/rentals', rental );
rentalRouter.put('/rentals/:id/return', finishRental);

export default rentalRouter