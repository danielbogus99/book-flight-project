import * as BookData from '../data-access/booksDataAccess.js';

export async function srvBookFlight() {
    try {
        const flights = await BookData.BookFlight();
        return flights;
    } catch (error) {
        console.error('Error in srvGetFlights:', error);
        throw error; // Re-throw the error to be handled by the controller
    }
}