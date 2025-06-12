import chai from 'chai';
import chaiHttp from 'chai-http';

chai.use(chaiHttp);
const expect = chai.expect;
const request = chai.request;

describe('FlightService API', function () {
  // Test GET /flights
  it('should get all flights', async function () {
    const res = await request('http://localhost:12877').get('/flights');
    expect(res).to.have.status(200);
    expect(res.body).to.be.an('array');
    if (res.body.length > 0) {
      expect(res.body[0]).to.have.property('flightNumber');
      expect(res.body[0]).to.have.property('origin');
      expect(res.body[0]).to.have.property('destination');
    }
  });

  // Test POST /bookings (success)
  it('should create a booking', async function () {
    const flightsRes = await request('http://localhost:12877').get('/flights');
    const flight = flightsRes.body.find(f => f.available_seats > 0);
    if (!flight) this.skip();

    const booking = {
      flight_number: flight.flightNumber,
      passenger_name: 'Test User',
      passenger_email: 'test@example.com',
      passenger_id: 'TESTPASS123',
      total_price: flight.price
    };

    const res = await request('http://localhost:12877')
      .post('/bookings')
      .send(booking);

    expect(res).to.have.status(201);
    expect(res.body).to.have.property('flight_number', flight.flightNumber);
  });

  // Test POST /bookings (duplicate)
  it('should not allow duplicate booking for same passenger and flight', async function () {
    const flightsRes = await request('http://localhost:12877').get('/flights');
    const flight = flightsRes.body.find(f => f.available_seats > 0);
    if (!flight) this.skip();

    const booking = {
      flight_number: flight.flightNumber,
      passenger_name: 'Test User',
      passenger_email: 'test@example.com',
      passenger_id: 'TESTPASS123',
      total_price: flight.price
    };

    await request('http://localhost:12877').post('/bookings').send(booking);
    const res = await request('http://localhost:12877').post('/bookings').send(booking);

    expect(res).to.have.status(400);
    expect(res.body).to.have.property('error').that.includes('already booked');
  });

  // Test GET /books
  it('should get all bookings with flight info', async function () {
    const res = await request('http://localhost:12877').get('/books');
    expect(res).to.have.status(200);
    expect(res.body).to.be.an('array');
    if (res.body.length > 0) {
      expect(res.body[0]).to.have.property('flight_number');
      expect(res.body[0]).to.have.property('passenger_name');
    }
  });
});
