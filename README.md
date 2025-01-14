# Luxury Travel Concierge

Luxury Travel Concierge is a platform designed to connect users with hotels, enabling users to book accommodations and view hotel details, while providing hotel owners the ability to manage listings and reservations. The platform integrates essential features such as user accounts, hotel listings, reservations, reviews, payment processing, and notifications.

## Tech Stack

- **Frontend**: React, TypeScript, Material UI
- **Backend**: Java, Spring Boot
- **Database**: AWS RDS
- **Authentication**: JWT Token 
- **Deployment**: Docker, AWS EC2, AWS S3
- **Build Tool**: Maven


## Features
### User Features:
- **Account Management**: Register, login, and manage your account.
- **Hotel Search**: Search and view hotel and room details.
- **Filters**: Filter hotels by name, location and price range. And filter rooms by availability, type, and capacity.
- **Booking**: Make hotel reservations by selecting dates, room types, and number of guests.
- **Booking Management**: View, modify, or cancel reservations.
- **Notifications**: Receive booking confirmations and updates via email or push notifications
- **Reviews**: Provide reviews for hotels you’ve stayed at.
- **Favorites**: Save hotels as favorites for future reference.
- **Payments**: Pay for Hotel Booking through payment gateway.
### Hotel Owner Features:
- **Account Management**: Register as a seller and manage your business details.
- **Hotel Listings**: Manage hotel listings, including images, descriptions, and location
- **Reservation Management:**: Accept or reject reservations and receive notifications for new bookings.
- **Review Management**: Respond to user reviews and feedback.
- **Room Inventory**: Manage room inventory and availability.
- **Analytics**: View booking statistics and analytics.

## Setup Instructions
### Prerequisites

- **Node.js**: Download and install Node.js.
- **Java JDK**: Install Java Development Kit (JDK) version 11 or above. You can download it from Oracle or OpenJDK.
- **Maven**: Install Apache Maven for managing the Spring Boot backend dependencies.
- **Git**: Install Git for version control. 
- **IDE/Text Editor**: Use an IDE like IntelliJ IDEA for the backend and VS Code for the frontend.
- **Docker**: Download and Install Docker.

### Installation
- **Clone the Respository**
```bash
git clone https://github.com/your-repository/luxury-travel-concierge.git
```
-- **Backend Setup**
```bash
mvn clean install
```
-- **Frontend Setup**
```bash
npm install
npm run dev
```

