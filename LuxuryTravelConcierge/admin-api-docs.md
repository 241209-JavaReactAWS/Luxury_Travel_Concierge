# Admin API Documentation

## Base Information
- Base URL: `http://localhost:8080/admin`
- Cross-Origin Resource Sharing (CORS): Enabled for `http://localhost:5173`
- Authentication: Session-based
- Response Format: JSON

## Endpoints

### 1. Get All Admins
Retrieves a list of all administrators.

**Request**
- Method: GET
- Path: `/`

**Response**
```json
{
    "status": 200,
    "data": [
        {
            "adminId": 1,
            "username": "admin1",
            "email": "admin1@example.com",
            "firstName": "John",
            "lastName": "Doe",
            "ownedHotels": []
        }
    ]
}
```

### 2. Register New Admin
Creates a new administrator account.

**Request**
- Method: POST
- Path: `/register`
- Content-Type: application/json

Request Body:
```json
{
    "username": "newadmin",
    "password": "password123",
    "email": "admin@example.com",
    "firstName": "John",
    "lastName": "Doe"
}
```

**Response**
- Status 201: Admin created successfully
- Status 400: Invalid request data

### 3. Admin Login
Authenticates an administrator and creates a session.

**Request**
- Method: POST
- Path: `/login`
- Content-Type: application/json

Request Body:
```json
{
    "username": "admin",
    "password": "password123"
}
```

**Response**
- Status 200: Login successful
  - Sets session attributes (username, adminId)
  - Sets Admin_Id cookie
- Status 401: Unauthorized (invalid credentials)

### 4. Admin Logout
Terminates the current admin session.

**Request**
- Method: POST
- Path: `/logout`

**Response**
- Status 204: Logout successful

### 5. Get Admin's Hotels
Retrieves all hotels owned by the currently logged-in admin.

**Request**
- Method: GET
- Path: `/hotels`
- Requires: Valid session

**Response**
```json
{
    "status": 200,
    "data": [
        {
            "hotelId": 1,
            "name": "Grand Hotel",
            "imageUrl": "http://example.com/image.jpg",
            "location": "New York"
        }
    ]
}
```
- Status 401: Unauthorized (no valid session)

### 6. Add Hotel to Admin
Adds a new hotel under the currently logged-in admin's management.

**Request**
- Method: POST
- Path: `/hotels`
- Requires: Valid session
- Content-Type: application/json

Request Body:
```json
{
    "name": "New Hotel",
    "imageUrl": "http://example.com/hotel.jpg",
    "location": "Los Angeles"
}
```

**Response**
```json
{
    "status": 200,
    "data": {
        "adminId": 1,
        "username": "admin",
        "ownedHotels": [
            {
                "hotelId": 1,
                "name": "New Hotel",
                "imageUrl": "http://example.com/hotel.jpg",
                "location": "Los Angeles"
            }
        ]
    }
}
```
- Status 401: Unauthorized (no valid session)
- Status 404: Admin not found

### 7. Cookie Management

#### Remove Login Cookie
**Request**
- Method: POST
- Path: `/cookie`

**Response**
- Status 200: "Logged Out"
- Removes Admin_Id cookie

#### Get Login Cookie
**Request**
- Method: GET
- Path: `/cookie`

**Response**
- Status 200: Cookie value
- Status 404: "No Cookie Found" (if cookie doesn't exist)

## Error Responses

The API may return the following status codes:

- 200 OK: Request successful
- 201 Created: Resource created successfully
- 204 No Content: Request successful (no content to return)
- 400 Bad Request: Invalid request data
- 401 Unauthorized: Authentication required or failed
- 404 Not Found: Resource not found

## Session Management

The API uses session-based authentication with the following attributes:
- username: Admin's username
- adminId: Admin's unique identifier

## Cookie Management

The API uses the following cookies:
- Admin_Id: Contains the admin's ID
- Max Age: 10000 seconds
