import { BookFlight } from '../data-access/booksDataAccess.js';
import db from '../data-access/db.js';

export async function srvCreateBook(book) {
  const {
    flight_id,
    passenger_name,
    passenger_email,
    passenger_id,
    total_price
  } = book;

  const client = await db.connect();
  try {
    await client.query('BEGIN');

    // שמירת ההזמנה
    const createdBooking = await BookFlight({
      flight_id,
      passenger_name,
      passenger_email,
      passenger_id,
      total_price
    });

    // הפחתה של מושב אחד
    await client.query(`
      UPDATE flights
      SET available_seats = available_seats - 1
      WHERE id = $1 AND available_seats > 0
    `, [flight_id]);

    await client.query('COMMIT');
    return createdBooking;
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error in srvCreateBook:', error);
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
    JOIN flights f ON b.flight_id = f.id
  `);
  return result.rows;
}


