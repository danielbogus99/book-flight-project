import express from 'express';
import * as FlightController from './controllers/flightsControllers.js';
import * as BooksController from './controllers/booksControllers.js';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
const port = process.env.PORT || 12877;

app.use(cors());
app.use(express.json());

// flights.
app.get('/flights', FlightController.ctrlGetFlights);
//app.post('/createflight', FlightController.ctrlCreateFlight);

// books.
app.get('/books', BooksController.ctrlGetBooks);
app.post('/bookings', BooksController.ctrlCreateBook);



app.listen(port, () => {
    console.log(`Flight Service is running on port ${port}`);
});