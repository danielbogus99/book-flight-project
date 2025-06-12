import * as BookService from '../services/booksService.js';

export async function ctrlCreateBook(req, res) {
  try {
    const booking = await BookService.srvCreateBook(req.body);
    res.status(201).json(booking);
  } catch (error) {
    // If it's a known error, send a 400 with the message
    if (
      error.message === 'This passenger has already booked this flight.'
    ) {
      return res.status(400).json({ error: error.message });
    }
    // For other errors, send a generic 500
    res.status(500).json({ error: 'Internal server error' });
  }
}
export async function ctrlGetBooks(req, res) {
  try {
    const result = await BookService.srvGetBooksWithFlights();
    res.json(result);
  } catch (error) {
    console.error('Error in ctrlGetBooks:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

