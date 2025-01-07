import React, { useState } from "react";
import "./Bookingform.css"; // Add custom styling here

const BookingPage: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    cardName: "",
    cardNumber: "",
    expirationMonth: "",
    expirationYear: "",
    securityCode: "",
    zipCode: "",
  });

  const [priceDetails, setPriceDetails] = useState({
    pricePerNight: 1059.30,
    nights: 2,
    taxes: 454.04,
    total: 2572.63,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Booking Details: ", formData);
    alert("Booking Successful!");
  };

  return (
    <div className="booking-page">
      <div className="main-content">
        <h1>Secure Booking</h1>
        <form onSubmit={handleSubmit}>
          <div className="section">
            <h2>Who's Checking In?</h2>
            <div className="form-group">
              <label>First Name*</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Last Name*</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Email Address*</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Mobile Phone Number*</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="section">
            <h2>Payment Method</h2>
            <div className="form-group">
              <label>Name on Card*</label>
              <input
                type="text"
                name="cardName"
                value={formData.cardName}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Card Number*</label>
              <input
                type="text"
                name="cardNumber"
                value={formData.cardNumber}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Expiration Date*</label>
              <select
                name="expirationMonth"
                value={formData.expirationMonth}
                onChange={handleInputChange}
                required
              >
                <option value="">Month</option>
                {[...Array(12)].map((_, i) => (
                  <option key={i} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
              <select
                name="expirationYear"
                value={formData.expirationYear}
                onChange={handleInputChange}
                required
              >
                <option value="">Year</option>
                {[...Array(10)].map((_, i) => (
                  <option key={i} value={2025 + i}>
                    {2025 + i}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Security Code*</label>
              <input
                type="text"
                name="securityCode"
                value={formData.securityCode}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Billing ZIP Code*</label>
              <input
                type="text"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <button type="submit" className="submit-button">
            Confirm Booking
          </button>
        </form>
      </div>

      <div className="sidebar">
        <h2>Booking Summary</h2>
        <p><strong>Hotel:</strong> Le Blanc Resort Cancun</p>
        <p><strong>Room Type:</strong> Royale Deluxe Lagoon View</p>
        <p><strong>Check-In:</strong> Fri, Jan 3</p>
        <p><strong>Check-Out:</strong> Sun, Jan 5</p>
        <hr />
        <p>Price per Night: ${priceDetails.pricePerNight.toFixed(2)}</p>
        <p>Nights: {priceDetails.nights}</p>
        <p>Taxes: ${priceDetails.taxes.toFixed(2)}</p>
        <h3>Total: ${priceDetails.total.toFixed(2)}</h3>
      </div>
    </div>
  );
};

export default BookingPage;
