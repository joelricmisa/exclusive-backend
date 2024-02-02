API Documentation

## Introduction

This API documentation is specifically for my e-commerce website, serving as the backend for my project intended to showcase my skills and capabilities as a developer.

### Purpose

Exclusively designed for personal use, this API powers the functionality of my simple e-commerce website. Tailored to meet the specific needs of my project, it emphasizes unique features and aspects that reflect my development expertise.

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

-  `status:` "error" : This status is either "success" or "error".
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

<br/>

## API Endpoints

### User Registration

#### Endpoint

-  **Method:** POST
-  **Path:** `/api/register`
-  **Description:** Create a new user account by submitting a POST request to /api/register with required information, such as username, email, and password, and receive a unique user identifier upon successful registration.

#### Request

```json
{
	"name": "example",
	"email": "example10@gmail.com",
	"password": "example123"
}
```

#### Response

```json
{
	"status": "success",
	"code": 201,
	"message": "User example123 is created!",
	"data": {
		"name": "example123",
		"email": "example123@gmail.com12",
		"password": "Encrypted",
		"roles": {
			"user": "user"
		},
		"wishlist": [],
		"orders": [],
		"_id": "65bb694f39cbdd21ef8597ed",
		"cart": [],
		"createdAt": "2024-02-01T09:50:07.678Z",
		"updatedAt": "2024-02-01T09:50:07.678Z",
		"__v": 0
	}
}
```

<br/>

---

### User Login

#### Endpoint

-  **Method:** POST
-  **Path:** `/api/auth`
-  **Description:** Authenticate and log in by submitting a POST request to `/api/auth` with valid credentials, such as email and password, receiving an authentication token for subsequent authorized access.

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

<br/>

---

### Refresh Token

#### Endpoint

-  **Method:** GET
-  **Path:** `/api/refresh`
-  **Description:** Obtain a new authentication token by sending a GET request to `/api/refresh` with a valid access token, allowing users to refresh their authentication session without re-entering credentials.

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

<br/>

---

### User Logout

#### Endpoint

-  **Method:** POST
-  **Path:** `/api/logout`
-  **Description:** Log out and invalidate tokens by submitting a POST request to `/api/logout`, effectively ending the user's authenticated session and requiring re-authentication for subsequent access.

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

<br/>

---

### Forgot Password

#### Endpoint

-  **Method:** POST
-  **Path:** `/api/forgot-password`
-  **Description:** Initiate the password reset process by sending a POST request to `/api/forgot-password` with the user's email, triggering a secure procedure to reset the password and providing instructions for further steps in the password recovery process.

#### Request Cookies

```json
{
	"email": "example10@gmail.com"
}
```

#### Response

```json
{
	"status": "success",
	"code": 200,
	"message": "Email for reset password sent successfully",
	"data": "example10"
}
```

<br/>

---

### Reset Password

#### Endpoint

-  **Method:** POST
-  **Path:** `/api/reset-password/{:token}`
-  **Description:** Complete the password reset process by submitting a POST request to `/api/reset-password/{token}` with the user's reset token and the new desired password, allowing users to securely reset their password and regain access to their account.

#### Request Cookies

```json
{
	"currentPassword": "example123",
	"newPassword": "newpass123"
}
```

#### Response

```json
{
	"status": "success",
	"code": 200,
	"message": "Password reset successfully",
	"data": "example10"
}
```

<br/>

---

### Change Password

#### Endpoint

-  **Method:** POST
-  **Path:** `/api/change-password`
-  **Description:** Update the user's password by sending a POST request to `/api/change-password` with the current password and the new desired password, ensuring secure and authenticated modification of user account credentials.

#### Request Cookies

```json
{
	"currentPassword": "example123",
	"newPassword": "newpass123"
}
```

#### Response

```json
{
	"status": "success",
	"code": 200,
	"message": "Password updated successfully",
	"data": "example10"
}
```

<br/>

---

### Contact Form

#### Endpoint

-  **Method:** POST
-  **Path:** `/api/contact`
-  **Description:** Send a message or inquiry by submitting a POST request to `/api/contact`, providing relevant information such as name, email, message, and phone number, and allowing users to communicate with the platform through a secure contact form.

#### Request Cookies

```json
{
	"name": "john doe",
	"email": "johndoe@gmail.com",
	"message": "Hello, Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus congue nec risus in tempus. Sed quis lorem vitae libero convallis bibendum... ",
	"phone": "0976-555-7575"
}
```

#### Response

```json
{
	"status": "success",
	"code": 200,
	"message": "Message sent successfully!",
	"data": "johndoe@gmail.com"
}
```

<br/>

---

### Users - CRUD (Create, Read, Update, Delete)

### 1. Fetch Users

#### Endpoint

-  **Method:** GET
-  **Path:** `/api/users`
-  **Description:** Retrieve a list of users by sending a GET request to `/api/users`, allowing client admin to access and display user information.

#### Request

No request parameters required.

#### Response

```json
{
	"status": "success",
	"code": 200,
	"message": "Users displayed successfully",
	"data": {
		"usersCount": 1,
		"users": [
			{
				"roles": {
					"user": "user"
				},
				"_id": "65bc534f7467g60cb81bff82",
				"name": "example10",
				"email": "example10@gmail.com",
				"wishlist": [],
				"orders": [],
				"cart": [],
				"refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
				"createdAt": "2024-02-02T02:28:31.060Z",
				"updatedAt": "2024-02-02T02:32:10.222Z"
			}
		]
	}
}
```

### 2. Create Record

#### Endpoint

-  **Method:** POST
-  **Path:** `/api/users`
-  **Description:** Create a new user account by submitting a POST request to `/api/users` with the required user details, such as name, email, password, or any other necessary information, facilitating the addition of new users to the system.

#### Request

```json
{
	"name": "example10",
	"email": "example10@gmail.com",
	"password": "example10"
}
```

#### Response

```json
{
	"status": "success",
	"code": 201,
	"message": "User example10 is created!",
	"data": {
		"name": "example10",
		"email": "example10@gmail.com",
		"password": "Encrypted",
		"roles": {
			"user": "user"
		},
		"wishlist": [],
		"orders": [],
		"_id": "65bc534f7467g60cb81bff82",
		"cart": [],
		"createdAt": "2024-02-02T02:28:31.060Z",
		"updatedAt": "2024-02-02T02:28:31.060Z",
		"__v": 0
	}
}
```

### 3. Update Record

#### Endpoint

-  **Method:** PUT
-  **Path:** `/api/users/{:id}`
-  **Description:** Update user information by submitting a PUT request to `/api/users/{id}`, providing the user identifier and the revised details, allowing users to modify and manage their account information within the system.

#### Request

```json
{
	"name": "exampleUpdate",
	"email": "exampleUpdate@gmail.com"
}
```

#### Response

```json
{
	"status": "success",
	"code": 200,
	"message": "User exampleUpdate is updated sucessfully",
	"data": {
		"roles": {
			"user": "user"
		},
		"_id": "65bc534f7467g60cb81bff82",
		"name": "exampleUpdate",
		"email": "exampleUpdate@gmail.com",
		"wishlist": [],
		"orders": [],
		"cart": [],
		"createdAt": "2024-02-02T02:28:31.060Z",
		"updatedAt": "2024-02-02T02:31:43.119Z",
		"__v": 0
	}
}
```

### 4. Delete Record

#### Endpoint

-  **Method:** DELETE
-  **Path:** `/api/users/{:id}`
-  **Description:** Remove a user account by sending a DELETE request to `/api/users/{id}`, providing the necessary authentication and authorization, allowing the client admin to securely delete the account and associated information from the system.

#### Request

No request parameters required.

#### Response

```json
{
	"status": "success",
	"code": 200,
	"message": "User example10 is deleted sucessfully",
	"data": {
		"id": "65bc534f7467g60cb81bff82"
	}
}
```

<br/>

---

### Products - CRUD (Create, Read, Update, Delete)

### 1. Fetch Products

#### Endpoint

-  **Method:** GET
-  **Path:** `/api/products`
-  **Description:** Retrieve a list of products by sending a GET request to `/api/products`, enabling clients to access information about available products.

#### Request

No request parameters required.

#### Response

```json
{
	"status": "success",
	"code": 200,
	"message": "Products displayed successfully",
	"data": {
		"productsCount": 1,
		"products": [
			{
				"_id": "6554b242d9038c101ebcc967",
				"name": "IPS LCD Gaming Monitor",
				"image": "public\\uploads\\monitor.png",
				"price": 1150,
				"discount": 20,
				"quantity": 1,
				"rating": "5",
				"categories": [
					{
						"_id": "6554b1bfdb069acd41999b0d",
						"name": "Flash Sales"
					},
					{
						"_id": "6554c1cf8fe6e3ee03929db6",
						"name": "Gaming"
					}
				],
				"createdAt": "2023-11-15T11:57:54.584Z",
				"updatedAt": "2023-11-25T16:38:31.547Z",
				"description": "An in-plane switching (IPS) monitor is a type of LCD (liquid-crystal display) monitor...",
				"rate_count": 99
			}
		]
	}
}
```

### 2. Create Record

#### Endpoint

-  **Method:** POST
-  **Path:** `/api/products`
-  **Description:** Add a new product to the system by submitting a POST request to `/api/products` with the required product details, such as name, image, price, and any other necessary information, facilitating the addition of new products to the inventory.

#### Request

```json
{
	"name": "Example-Product",
	"image": "example-product.png",
	"price": 550,
	"discount": 0,
	"quantity": 1,
	"rating": "5",
	"categoryName": "Gaming"
}
```

#### Response

```json
{
	"status": "success",
	"code": 201,
	"message": "Product Example-Product is created!",
	"data": {
		"name": "Example-Product",
		"image": "public\\uploads\\example-product.png",
		"price": 550,
		"discount": 0,
		"quantity": 1,
		"rating": "5",
		"categories": ["6554c1cf8fe6e3ee03929db6"],
		"_id": "65bc597d30d504048d55f50a",
		"createdAt": "2024-02-02T02:54:53.808Z",
		"updatedAt": "2024-02-02T02:54:53.808Z",
		"__v": 0
	}
}
```

### 3. Update Record

#### Endpoint

-  **Method:** PUT
-  **Path:** `/api/products/{:id}`
-  **Description:** Modify an existing product's information by sending a PUT request to `/api/products/{id}`, providing the product identifier and the updated details, allowing the client admin to manage and update product information within the system.

#### Request

```json
{
	"name": "Example-Product",
	"image": "public\\uploads\\example-product.png",
	"price": 550,
	"discount": 0,
	"quantity": 1,
	"rating": "5",
	"categoryName": "Gaming",
	"rate_count": 990,
	"description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus congue nec risus in tempus. Sed quis lorem vitae libero convallis bibendum"
}
```

#### Response

```json
{
	"status": "success",
	"code": 200,
	"message": "Example-Product is updated successfully",
	"data": {
		"_id": "65bc597d30d504048d55f50a",
		"name": "Example-Product",
		"image": "public\\uploads\\example-product.png",
		"price": 550,
		"discount": 0,
		"quantity": 1,
		"rating": "5",
		"categories": ["6554c1cf8fe6e3ee03929db6"],
		"rate_count": 990,
		"description": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus congue nec risus in tempus. Sed quis lorem vitae libero convallis bibendum",
		"createdAt": "2024-02-02T02:54:53.808Z",
		"updatedAt": "2024-02-02T02:54:53.808Z",
		"__v": 0
	}
}
```

### 4. Delete Record

#### Endpoint

-  **Method:** DELETE
-  **Path:** `/api/products/{:id}`
-  **Description:** Remove a product from the inventory by sending a DELETE request to `/api/products/{id}`, providing the necessary authentication and authorization, enabling client admin to securely delete a product and associated information from the system.

#### Request

No request parameters required.

#### Response

```json
{
	"status": "success",
	"code": 200,
	"message": "Example-Product product is deleted successfully",
	"data": {
		"id": "65bc5bd740881b6fa075495d"
	}
}
```

<br/>

---

### Categories - CRUD (Create, Read, Update, Delete)

### 1. Fetch Categories

#### Endpoint

-  **Method:** GET
-  **Path:** `/api/categories`
-  **Description:** Retrieve a list of categories by sending a GET request to `/api/categories`, allowing clients to access information about available product categories.

#### Request

No request parameters required.

#### Response

```json
{
	"status": "success",
	"code": 200,
	"message": "Categories displayed successfully",
	"data": {
		"categoriesCount": 2,
		"categories": [
			{
				"_id": "6554b1bfdb069acd41999b0d",
				"name": "Flash Sales",
				"products": [
					{
						"_id": "6554b242d9038c101ebcc96b",
						"name": "IPS LCD Gaming Monitor",
						"image": "public\\uploads\\monitor.png",
						"price": 1150,
						"discount": 20,
						"quantity": 1,
						"rating": "5",
						"rate_count": 99
					}
				]
			},
			{
				"_id": "6554c1b98fe6e3ee03929db0",
				"name": "Electronics",
				"products": [
					{
						"_id": "6555b89abe32834a738b38f3",
						"name": "RGB liquid CPU Cooler",
						"image": "public\\uploads\\rgb-liquid-cooler.png",
						"price": 160,
						"discount": 0,
						"quantity": 1,
						"rating": "4.5",
						"rate_count": 238
					}
				]
			}
		]
	}
}
```

### 2. Create Record

#### Endpoint

-  **Method:** POST
-  **Path:** `/api/categories`
-  **Description:** Add a new category to the system by submitting a POST request to `/api/categories` with the required category name, facilitating the expansion and organization of product categories within the inventory.

#### Request

```json
{
	"name": "Example-Category"
}
```

#### Response

```json
{
	"status": "success",
	"code": 201,
	"message": "Example-Category category is created!",
	"data": {
		"name": "Example-Category",
		"products": [],
		"_id": "65bc5fae40881b6fa0754965",
		"createdAt": "2024-02-02T03:21:18.239Z",
		"updatedAt": "2024-02-02T03:21:18.239Z",
		"__v": 0
	}
}
```

### 3. Update Record

#### Endpoint

-  **Method:** PUT
-  **Path:** `/api/categories/{:id}`
-  **Description:** Modify an existing category's information by sending a PUT request to `/api/categories/{id}`, providing the category identifier and the updated details, allowing the client admin to manage and update category information within the system.

#### Request

```json
{
	"name": "Update-Category"
}
```

#### Response

```json
{
	"status": "success",
	"code": 200,
	"message": "Update-Category category is updated successfully",
	"data": {
		"_id": "65bc5fae40881b6fa0754965",
		"name": "Update-Category",
		"products": [],
		"createdAt": "2024-02-02T03:21:18.239Z",
		"updatedAt": "2024-02-02T03:22:25.662Z",
		"__v": 0
	}
}
```

### 4. Delete Record

#### Endpoint

-  **Method:** DELETE
-  **Path:** `/api/categories/{:id}`
-  **Description:** Remove a category from the system by sending a DELETE request to `/api/categories/{id}`, providing the necessary authentication and authorization, enabling client admin to securely delete a category and associated information.

#### Request

No request parameters required.

#### Response

```json
{
	"status": "success",
	"code": 200,
	"message": "Update-Category category is deleted successfully",
	"data": {
		"id": "65bc5fae40881b6fa0754965"
	}
}
```

<br/>

---

### Orders - CRUD (Create, Read, Update, Delete)

### 1. Fetch Orders

#### Endpoint

-  **Method:** GET
-  **Path:** `/api/orders`
-  **Description:** Retrieve a list of orders by sending a GET request to `/api/orders`, allowing clients to access information about existing orders.

#### Request

No request parameters required.

#### Response

```json
{
	"status": "success",
	"code": 200,
	"message": "OK",
	"data": [
		{
			"_id": "65bc61e30587932fa83ab4b6",
			"user_id": "657468f64418c1af82fc0db7",
			"products": [
				{
					"quantity": 1,
					"price": 960,
					"_id": "6554baeedf321405e61dcada"
				}
			],
			"total_price": 960,
			"status": "Processing",
			"order_date": "2024-02-02T03:30:43.985Z",
			"__v": 0
		}
	]
}
```

### 2. Create Record

#### Endpoint

-  **Method:** POST
-  **Path:** `/api/orders`
-  **Description:** Place a new order by submitting a POST request to `/api/orders` with the required order details, facilitating the process of creating and recording new orders within the system.

#### Request

```json
{
	"user_id": "657468f64418c1af82fc0db7",
	"products":[{"...product"}]
}
```

#### Response

```json
{
	"status": "success",
	"code": 201,
	"message": "Created",
	"data": {
		"user_id": "657468f64418c1af82fc0db7",
		"products": [
			{
				"quantity": 1,
				"price": 960,
				"_id": "6554baeedf321405e61dcada"
			}
		],
		"total_price": 960,
		"status": "Processing",
		"_id": "65bc61e30587932fa83ab4b6",
		"order_date": "2024-02-02T03:30:43.985Z",
		"__v": 0
	}
}
```

### 3. Update Record

#### Endpoint

-  **Method:** PUT
-  **Path:** `/api/orders/{:id}`
-  **Description:** Modify an existing order's information by sending a PUT request to `/api/orders/{id}`, providing the order identifier and the updated details, allowing the client admin to manage and update order information within the system.

#### Request

```json
{
	"status": "completed"
}
```

#### Response

```json
{
	"status": "success",
	"code": 200,
	"message": "OK",
	"data": {
		"_id": "65bc61e30587932fa83ab4b6",
		"user_id": "657468f64418c1af82fc0db7",
		"products": [
			{
				"quantity": 1,
				"price": 960,
				"_id": "6554baeedf321405e61dcada"
			}
		],
		"total_price": 960,
		"status": "completed",
		"order_date": "2024-02-02T03:30:43.985Z",
		"__v": 0
	}
}
```

### 4. Delete Record

#### Endpoint

-  **Method:** DELETE
-  **Path:** `/api/orders/{:id}`
-  **Description:** Remove an order from the system by sending a DELETE request to `/api/orders/{id}`, providing the necessary authentication and authorization, enabling client admin to securely delete an order and associated information.

#### Request

No request parameters required.

#### Response

```json
{
	"status": "success",
	"code": 200,
	"message": "Order is deleted successfully",
	"data": {
		"id": "65bc61e30587932fa83ab4b6"
	}
}
```
