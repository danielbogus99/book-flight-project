import db from '../data-access/db.js';

export const BookFlight = async ({
    flight_number,
    passenger_name,
    passenger_email,
    passenger_id,
    total_price
}) => {
    try {
        const insertQuery = `
            INSERT INTO bookings (flight_number, passenger_name, passenger_email, passenger_id, total_price)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *;
        `;
        const values = [flight_number, passenger_name, passenger_email, passenger_id, total_price];
        const result = await db.query(insertQuery, values);
        return result.rows[0];
    } catch (error) {
        console.error('Error booking flight:', error);
        throw error;
    }
}
