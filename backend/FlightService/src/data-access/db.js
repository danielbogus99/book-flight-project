import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

pool.connect()
  .then(() => console.log('✅ Connected to PostgreSQL Database'))
  .catch((err) => console.error('❌ Faile to connect to DB:', err.message));


  async function initDB() {
    try {
        const client = await pool.connect();

        console.log('🔄 Initializing database...');

        const flightTable = `
            CREATE TABLE IF NOT EXISTS flights (
                id SERIAL PRIMARY KEY,
                origin TEXT NOT NULL,
                destination TEXT NOT NULL,
                departure_time TIMESTAMP NOT NULL,
                arrival_time TIMESTAMP NOT NULL,
                flight_company TEXT NOT NULL,
                flight_number TEXT NOT NULL,
                price DECIMAL(10, 2) NOT NULL,
                available_seats INTEGER NOT NULL
            );
        `;

        const bookingTable = `
            CREATE TABLE IF NOT EXISTS bookings (
                id SERIAL PRIMARY KEY,
                flight_id INTEGER NOT NULL REFERENCES flights(id),
                passenger_name TEXT NOT NULL,
                passenger_email TEXT NOT NULL,
                passenger_id TEXT NOT NULL,
                total_price DECIMAL(10, 2) NOT NULL
            );
        `;


        await client.query(flightTable);
        await client.query(bookingTable);

        client.release();
        console.log('✅ Flights table initialized');
        console.log('✅ Bookings table initialized');
    } catch (err) {
        console.error('❌ Error initializing database:', err.message);
    }
  }

  initDB(); // Initialize the database tables

export default pool;