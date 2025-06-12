import * as BookService from '../services/booksService.js';

export async function ctrlCreateBook(req, res) {
  try {
    const book = req.body;
    if (!book || !book.passenger_name || !book.passenger_email || !book.passenger_id) {
      return res.status(400).json({ error: 'Invalid booking data' });
    }

    const createdBook = await BookService.srvCreateBook(book);
    res.status(201).json(createdBook);
  } catch (error) {
    console.error('Error in ctrlCreateBook:', error);
    res.status(500).json({ error: 'Internal Server Error' });
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

