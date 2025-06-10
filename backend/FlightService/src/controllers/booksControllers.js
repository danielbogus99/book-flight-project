

export async function ctrlCreateBook(req, res) {
    try {
        console.log('📚\tGot a request to create a book');
        const book = req.body;
        if (!book || !book.name || !book.passport || !book.email) {
            return res.status(400).json({ error: 'Invalid book data' });
        }
        const createdBook = await FlightService.srvCreateBook(book);
        res.status(201).json(createdBook);
    } catch (error) {
        console.error('Error in ctrlCreateBook:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}