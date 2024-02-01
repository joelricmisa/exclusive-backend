# API Documentation

## Introduction

API documentation for my personal ecommerce website backend. This API serves as the backbone for a personal project designed to showcase my skills and capabilities as a developer.

### Purpose

The primary purpose of this API is to support the functionality of my simple ecommerce website.

### Key Features

1. User Management:

   -  Registration: Allow users to create accounts.
   -  Authentication: Secure endpoints using JWT-based token authentication.
   -  Password Management:
      -  Forgot Password: Enable users to request a password reset.
      -  Reset Password: Allow users to reset their passwords securely.

2. Product Management:

   -  View Products: Retrieve information about available products.
   -  Categories: Organize products into categories for easy navigation.

3. Contact:

   -  Contact Form: Provide a route for users to submit inquiries or feedback.

4. Token Management:

   -  Access Token: Obtain access tokens upon authentication.
   -  Refresh Token: Implement token refresh mechanism for prolonged user sessions.

## Base URL

The base URL for all API endpoints is `https://exclusive-backend-te81.onrender.com/`.

## Authentication

### JWT Token Authentication

The API uses JSON Web Tokens (JWT) for authentication. Both access and refresh tokens are required for secure access to protected endpoints.

#### 1.Obtain Access Token

**Endpoint**

-  **Method:** POST
-  **Path:** `/api/auth`
-  **Description:** Obtain an access token

#### Request

```json
{
	"email": "example10@gmail.com",
	"password": "example123"
}
```

#### Response

```json
{
	"status": "success",
	"code": 200,
	"message": "Authenticated",
	"data": {
		"user": "example10@gmail.com",
		"accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
		"role": ["user"]
	}
}
```

#### 2. Refresh Access Token

**Endpoint**

-  **Method:** GET
-  **Path:** `/api/refresh`
-  **Description:** Refresh the access token using the refresh token.

#### Request Cookies

-  **jwt:** - `{refreshToken}`

#### Response

```json
{
	"status": "success",
	"code": 200,
	"message": "Displayed refresh token successfully",
	"data": {
		"user": "example10@gmail.com",
		"accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
		"role": ["user"]
	}
}
```

### Authentication Header

For protected endpoints, include the Authorization header with the Bearer token.

Example

-  **Authorization:** Bearer `{accessToken}`

### Token Expiry

Access tokens have a short lifespan (1hr). When an access token expires, use the refresh token to obtain a new one.

### Logout

To invalidate tokens and log out:

**Endpoint**

-  **Method:** POST
-  **Path:** `/api/logout`
-  **Description:** Log out and invalidate tokens.

#### Request Cookies

-  **jwt:** - `{refreshToken}`

#### Response

```json
{
	"status": "success",
	"code": 200,
	"message": "Logout Successfully!",
	"data": "example10@gmail.com"
}
```

## Error Handling

The API follows a standard error response format to provide clear information about issues encountered during requests.

### General Error Response Format

In case of an error, the API will respond with a JSON object containing the following fields:

-  `status:` "error" : A brief error message.
-  `code:` (number): A machine-readable error code.
-  `message:` (string): A generic description of the error.
-  `details:` (string): A detailed description of the error.

Example

```json
{
	"status": "error",
	"code": 500,
	"message": "An internal server error occurred",
	"details": "Cast to ObjectId failed for value \"4124\" (type string) at path \"_id\""
}
```

### Common Error Codes

-  `400 Bad Request`: The request was invalid or malformed.
-  `401 Unauthorized`: Authentication failed or the user doesn't have permission.
-  `403 Forbidden`: The authenticated user doesn't have access to the requested resource.
-  `404 Not Found`: The requested resource was not found.
-  `429 Too Many Requests`: Rate limit exceeded.
-  `500 Internal Server Error`: An unexpected error occurred on the server.
