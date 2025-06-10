import { useEffect, useState } from 'react'
import axios from 'axios'
import './App.css'

function App() {
  const [flights, setFlights] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchFlights = async () => {
      setLoading(true)
      try {
        const response = await axios.get(import.meta.env.VITE_URL + '/flights')
        setFlights(response.data)
        setError(null)
      } catch (err) {
        setError('Error fetching flights')
      }
      setLoading(false)
    }
    fetchFlights()
  }, [])

  return (
    <div className="app-container">
      <h1 className="main-title">✈️ Book Flight</h1>
      {loading ? (
        <div className="loader-container">
          <div className="loader"></div>
          <span>Loading flights...</span>
        </div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : flights.length === 0 ? (
        <div className="no-flights-message">
          No flights available at the moment.
        </div>
      ) : (
        <div className="flights-list">
          {flights.map((flight, idx) => (
            <div className="flight-card" key={flight.id || idx}>
              <div className="flight-header">
                <span className="flight-route">{flight.origin} → {flight.destination}</span>
                <span className="flight-price">${flight.price}</span>
              </div>
              <div className="flight-details">
                <span>Departure: {flight.departureTime}</span>
                <span>Arrival: {flight.arrivalTime}</span>
                <span>Airline: {flight.airline}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default App
