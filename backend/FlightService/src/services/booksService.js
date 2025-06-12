import { BookFlight } from '../data-access/booksDataAccess.js';
import db from '../data-access/db.js';

export async function srvCreateBook(book) {
  const {
    flight_number,
    passenger_name,
    passenger_email,
    passenger_id,
    total_price
  } = book;

  const client = await db.connect();
  try {
    await client.query('BEGIN');

    // Check if this passenger already booked this flight
    const existing = await client.query(
      `SELECT 1 FROM bookings WHERE flight_number = $1 AND passenger_id = $2`,
      [flight_number, passenger_id]
    );
    if (existing.rowCount > 0) {
      await client.query('ROLLBACK');
      throw new Error('This passenger has already booked this flight.');
    }

    // Save the booking
    const createdBooking = await BookFlight({
      flight_number,
      passenger_name,
      passenger_email,
      passenger_id,
      total_price
    });

    // Decrement seat count
    await client.query(`
      UPDATE flights
      SET available_seats = available_seats - 1
      WHERE flight_number = $1 AND available_seats > 0
    `, [flight_number]);

    await client.query('COMMIT');
    return createdBooking;
  } catch (error) {
    await client.query('ROLLBACK');
    // Only log unexpected errors
    if (error.message !== 'This passenger has already booked this flight.') {
      console.error('❌ Error in srvCreateBook:', error);
    }
    throw error;
  } finally {
    client.release();
  }
}


export async function srvGetBooksWithFlights() {
  const result = await db.query(`
    SELECT 
      b.id AS booking_id,
      b.passenger_name,
      b.passenger_email,
      b.passenger_id,
      b.total_price,
      f.flight_number,
      f.origin,
      f.destination,
      f.departure_time,
      f.arrival_time,
      f.flight_company AS airline
    FROM bookings b
    JOIN flights f ON b.flight_number = f.flight_number
  `);
  return result.rows;
}


