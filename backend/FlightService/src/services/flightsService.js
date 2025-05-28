import * as FlightData from '../data-access/flightsDataAccess.js';

export async function srvGetFlights() {
    try {
        const flights = await FlightData.getFlights();
        return flights;
    } catch (error) {
        console.error('Error in srvGetFlights:', error);
        throw error; // Re-throw the error to be handled by the controller
    }
}