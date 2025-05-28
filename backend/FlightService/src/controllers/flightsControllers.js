import * as FlightService from '../services/flightsService.js';

// in the controller, we will test user inputs.

export async function ctrlGetFlights(req, res) {
    try {
        
        const flights = await FlightService.srvGetFlights();
        res.status(200).json(flights);

    } catch (error) {
        console.error('Error in ctrlGetFlights:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}