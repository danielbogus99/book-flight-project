import db from '../data-access/db.js';

export async function getFlights() {
    try {
        const result = await db.query('SELECT * FROM flights');
        return result.rows.map(row => new Flight(
        row.id,
        row.origin,
        row.destination,
        row.departure_time,
        row.arrival_time,
        row.flight_company,
        row.flight_number,
        row.price,
        row.available_seats
        ));
    } catch (error) {
        console.error('Error fetching flights:', error);
        throw error;
    }
}