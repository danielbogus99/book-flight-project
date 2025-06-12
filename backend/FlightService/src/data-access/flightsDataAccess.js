import db from '../data-access/db.js';


export const getFlights = async () => {
    try {
        const result = await db.query('SELECT * FROM flights');
        return result.rows.map(row => ({
            id: row.id,
            origin: row.origin,
            destination: row.destination,
            departureTime: row.departure_time,
            arrivalTime: row.arrival_time,
            airline: row.flight_company,
            flightNumber: row.flight_number,
            price: parseFloat(row.price),
        available_seats: row.available_seats
        }));
    } catch (error) {
        console.error('Error fetching flights:', error);
        throw error;
    }
}