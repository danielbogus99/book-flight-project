import { useEffect, useState } from 'react'
import axios from 'axios'
import './App.css'

function App() {
  const [flights, setFlights] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [departureFilter, setDepartureFilter] = useState('')
  const [destinationFilter, setDestinationFilter] = useState('')
  const [airlineFilter, setAirlineFilter] = useState('')
  const [priceFilter, setPriceFilter] = useState('')
  const [dateFilter, setDateFilter] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [myFlightsOpen, setMyFlightsOpen] = useState(false);
const [flightNumberQuery, setFlightNumberQuery] = useState('');
const [passportQuery, setPassportQuery] = useState('');
const [myFlightResult, setMyFlightResult] = useState(null);
const [myFlightError, setMyFlightError] = useState('');

  const [selectedFlight, setSelectedFlight] = useState(null)
  const [numSeats, setNumSeats] = useState(1)
  const [passengers, setPassengers] = useState([
    { fullName: '', passport: '', email: '' }
  ])
  const [orderLoading, setOrderLoading] = useState(false)

 const filteredFlights = flights
  .filter(flight => !!flight.departureTime)
  .filter(flight => flight.available_seats > 0)
  .filter(flight => {
    const matchesDeparture = flight.origin.toLowerCase().includes(departureFilter.toLowerCase());
    const matchesDestination = flight.destination.toLowerCase().includes(destinationFilter.toLowerCase());
    const matchesAirline = flight.airline.toLowerCase().includes(airlineFilter.toLowerCase());
    const matchesPrice = priceFilter === '' || flight.price <= Number(priceFilter);
    const matchesDate =
      !dateFilter ||
      new Date(flight.departureTime).toISOString().slice(0, 10) === dateFilter;
    return (
      matchesDeparture &&
      matchesDestination &&
      matchesAirline &&
      matchesPrice &&
      matchesDate
    );
  });

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

  // Open modal and set selected flight
  const handleCardClick = (flight) => {
    setSelectedFlight(flight)
    setNumSeats(1)
    setPassengers([{ fullName: '', passport: '', email: '' }])
    setModalOpen(true)
  }

  // Close modal and clear info
  const closeModal = () => {
    setModalOpen(false)
    setSelectedFlight(null)
    setNumSeats(1)
    setPassengers([{ fullName: '', passport: '', email: '' }])
  }

 const handleNumSeatsChange = (e) => {
  const value = Math.max(1, Math.min(5, Number(e.target.value)));
  const maxSeats = selectedFlight?.available_seats
 || 1;

  if (value > maxSeats) {
    alert(`❌ Not enough seats. Only ${maxSeats} left.`);
    return;
  }

  setNumSeats(value);
  setPassengers((prev) => {
    const arr = [...prev];
    while (arr.length < value) arr.push({ fullName: '', passport: '', email: '' });
    while (arr.length > value) arr.pop();
    return arr;
  });
};


  // Handle passenger field change
  const handlePassengerChange = (idx, field, value) => {
    setPassengers((prev) => {
      const arr = [...prev]
      arr[idx] = { ...arr[idx], [field]: value }
      return arr
    })
  }
const handleOrder = async () => {
  if (!selectedFlight || passengers.length === 0) return;

  setOrderLoading(true);

  try {
    for (const p of passengers) {
      const booking = {
        flight_number: selectedFlight.flightNumber,
        passenger_name: p.fullName,
        passenger_email: p.email,
        passenger_id: p.passport,
        total_price: selectedFlight.price * numSeats
      };

      await axios.post(import.meta.env.VITE_URL + '/bookings', booking);
    }

    alert('Order placed successfully!');
    closeModal();

    // Fetch flights again to update the UI
    const response = await axios.get(import.meta.env.VITE_URL + '/flights');
    setFlights(response.data);

  } catch (err) {
    if (err.response && err.response.data && err.response.data.error) {
      alert(err.response.data.error); // Show the error from backend
    } else {
      alert('Failed to place order.');
    }
  } finally {
    setOrderLoading(false);
  }
};

  return (
    <div className="app-container">
      <div className="sky-bg">
        <div className="cloud cloud1">
          <div className="cloud-part"></div>
          <div className="cloud-part"></div>
          <div className="cloud-part"></div>
        </div>
        <div className="cloud cloud2">
          <div className="cloud-part"></div>
          <div className="cloud-part"></div>
          <div className="cloud-part"></div>
        </div>
        <div className="cloud cloud3">
          <div className="cloud-part"></div>
          <div className="cloud-part"></div>
          <div className="cloud-part"></div>
        </div>
        <div className="cloud cloud4">
          <div className="cloud-part"></div>
          <div className="cloud-part"></div>
          <div className="cloud-part"></div>
        </div>
        <div className="cloud cloud5">
          <div className="cloud-part"></div>
          <div className="cloud-part"></div>
          <div className="cloud-part"></div>
        </div>
      </div>
      <h1 className="main-title">✈️ Quick Flight's</h1>
      
      <div className="filter-bar">
        <input
          type="text"
          placeholder="Departure"
          value={departureFilter}
          onChange={e => setDepartureFilter(e.target.value)}
        />
        <input
          type="text"
          placeholder="Destination"
          value={destinationFilter}
          onChange={e => setDestinationFilter(e.target.value)}
        />
        <input
          type="text"
          placeholder="Airline"
          value={airlineFilter}
          onChange={e => setAirlineFilter(e.target.value)}
        />
        <input
          type="number"
          placeholder="Max Price"
          value={priceFilter}
          onChange={e => setPriceFilter(e.target.value)}
          min={0}
        />
        <input
          type="date"
          value={dateFilter}
          onChange={e => setDateFilter(e.target.value)}
        />
        <button
  className="my-flights-btn"
  onClick={() => {
    setMyFlightsOpen(true);
    setFlightNumberQuery('');
    setPassportQuery('');
    setMyFlightResult(null);
    setMyFlightError('');
  }}
>
  My Flights
</button>

        <button className="reset-filters-btn" onClick={() => {
          setDepartureFilter('')
          setDestinationFilter('')
          setAirlineFilter('')
          setPriceFilter('')
          setDateFilter('')
        }}>Reset Filters</button>
      </div>
      {myFlightsOpen && (
  <div className="modal-overlay" onClick={() => setMyFlightsOpen(false)}>
    <div className="reservation-modal" onClick={e => e.stopPropagation()}>
      <button className="modal-close" onClick={() => setMyFlightsOpen(false)}>&times;</button>
      <h2>🔎 Find My Flights</h2>
      <input
  type="text"
  className="modal-input"
  placeholder="Flight Number"
  value={flightNumberQuery}
  onChange={e => setFlightNumberQuery(e.target.value)}
/>
<input
  type="text"
  className="modal-input"
  placeholder="Passport Number"
  value={passportQuery}
  onChange={e => setPassportQuery(e.target.value)}
/>
<button
  className="order-btn modal-search-btn"
  onClick={async () => {
    try {
      const res = await axios.get(import.meta.env.VITE_URL + '/books');

      const match = res.data.find(
        b => b.passenger_id === passportQuery && b.flight_number === flightNumberQuery
      );
      if (match) {
        setMyFlightResult(match);
        setMyFlightError('');
      } else {
        setMyFlightResult(null);
        setMyFlightError('❌ No matching booking found.');
      }
    } catch (err) {
      console.error(err);
      setMyFlightError('❌ Error fetching bookings.');
    }
  }}
>
  Search
</button>

      {myFlightError && <p style={{ color: 'red' }}>{myFlightError}</p>}

      {myFlightResult && (
        <div className="modal-flight-info">
          <h4>✈️ Flight #{myFlightResult.flight_number}</h4>
          <p><strong>From:</strong> {myFlightResult.origin}</p>
          <p><strong>To:</strong> {myFlightResult.destination}</p>
          <p><strong>Departure:</strong> {new Date(myFlightResult.departure_time).toLocaleString()}</p>
          <p><strong>Passenger:</strong> {myFlightResult.passenger_name} ({myFlightResult.passenger_id})</p>
          <p><strong>Email:</strong> {myFlightResult.passenger_email}</p>
          <p><strong>Total Paid:</strong> ${myFlightResult.total_price}</p>
        </div>
      )}
    </div>
  </div>
)}

      {loading ? (
        <div className="loader-container">
          <div className="loader"></div>
          <span>Loading flights...</span>
        </div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : filteredFlights.length === 0 ? (
        <div className="no-flights-message">
          No flights available at the moment.
        </div>
      ) : (
        <div className="flights-list">
         {[...filteredFlights]
  .sort((a, b) => new Date(a.departureTime) - new Date(b.departureTime))
  .map((flight, idx) => (

    <div
      className="flight-card"
      key={flight.id || idx}
      onClick={() => handleCardClick(flight)}
      tabIndex={0}
      style={{ cursor: 'pointer' }}
    >
              <div className="flight-header">
                <span className="flight-route">{flight.origin} → {flight.destination}</span>
                <span className="flight-price">${flight.price}</span>
              </div>
              <span className="flight-number-badge">
                Flight #{flight.flightNumber}
              </span>
              <div className="flight-details">
                <span>
                 Departure: {new Date(flight.departureTime).toLocaleString('en-GB', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false
})}

                </span>
                
                <span>
                  Arrival: {new Date(flight.arrivalTime).toLocaleString(undefined, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
                <span>Airline: {flight.airline}</span>
                <span>Seats left: {flight.available_seats}</span>

              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reservation Modal */}
      {modalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div
            className="reservation-modal"
            onClick={e => e.stopPropagation()}
            tabIndex={-1}
          >
            <button className="modal-close" onClick={closeModal} aria-label="Close">&times;</button>
            <h2>Reserve Seats</h2>
            <div className="modal-flight-info">
              <strong>{selectedFlight.origin} → {selectedFlight.destination}</strong>
              <span className="modal-flight-number">
                Flight #{selectedFlight.flightNumber}
              </span>
              <span>
                {new Date(selectedFlight.departureTime).toLocaleString(undefined, {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
              <span>Airline: {selectedFlight.airline}</span>
              <span>Price per ticket: ${selectedFlight.price}</span>
            </div>
            <label>
              Number of seats:
              <select value={numSeats} onChange={handleNumSeatsChange}>
                {[1,2,3,4,5].map(n => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </label>
            <div className="modal-passenger-fields">
              {passengers.map((p, idx) => (
                <div className="modal-passenger" key={idx}>
                  <h4>Passenger {idx + 1}</h4>
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={p.fullName}
                    onChange={e => handlePassengerChange(idx, 'fullName', e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Passport Number"
                    value={p.passport}
                    onChange={e => handlePassengerChange(idx, 'passport', e.target.value)}
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={p.email}
                    onChange={e => handlePassengerChange(idx, 'email', e.target.value)}
                  />
                </div>
              ))}
            </div>
            <div className="modal-total">
              Total: <strong>${selectedFlight.price * numSeats}</strong>
            </div>
            <button className="order-btn" onClick={handleOrder} disabled={orderLoading}>
              {orderLoading ? (
                <span className="order-spinner"></span>
              ) : (
                "Order"
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default App