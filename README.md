# Product API

A RESTful API for managing products built with Express.js for Week 2 assignment.

## Setup
1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install   # Product API
   
   A RESTful API for managing products built with Express.js for the Week 2 assignment.
   
   ## 🚀 Features
   
   - Standard CRUD operations for products
   - Filtering, searching, and pagination
   - Product statistics by category
   - Middleware for logging, authentication, and validation
   - Comprehensive error handling
   
   ## 🛠️ Setup
   
   1. **Clone the repository**
      - Use your preferred method to clone the repository and navigate into the project folder.
   
   2. **Install dependencies**
      ```bash
      npm install
      ```
   
   3. **Configure environment variables**
      - Create a `.env` file in the root directory and add:
        ```
        PORT=3000
        API_KEY=your-secret-api-key-123
        ```
   
   4. **Start the server**
      ```bash
      npm start
      ```
      Or, for auto-reload on code changes (if nodemon is installed):
      ```bash
      npm run dev
      ```
   
   ## 📚 API Endpoints
   
   All `/api/products` endpoints require an `x-api-key` header with your API key.
   
   ### Root
   
   - `GET /`
     - Returns a welcome message.
   
   ### Products
   
   - `GET /api/products`
     - List all products (supports `search`, `category`, `page`, `limit` query params).
   - `GET /api/products/:id`
     - Get a specific product by ID.
   - `POST /api/products`
     - Create a new product.
   - `PUT /api/products/:id`
     - Update an existing product.
   - `DELETE /api/products/:id`
     - Delete a product.
   
   ### Statistics
   
   - `GET /api/products/stats`
     - Returns product counts by category.
   
   ## 🧪 Testing the API with Postman
   
   1. **Open Postman** and create a new request for each endpoint you want to test.
   
   2. **Set the request method** (GET, POST, PUT, DELETE) and the request URL (e.g., `http://localhost:3000/api/products`).
   
   3. **Add the required header**:
      - Go to the **Headers** tab.
      - Add a key: `x-api-key`
      - Value: `your-secret-api-key-123` (or the value from your `.env` file)
   
   4. **For POST and PUT requests**:
      - Go to the **Body** tab.
      - Select **raw** and choose **JSON**.
      - Enter the product data, for example:
        ```json
        {
          "name": "Tablet",
          "description": "Android tablet",
          "price": 300,
          "category": "electronics",
          "inStock": true
        }
        ```
   
   5. **Click "Send"** to make the request and view the response.
   
   ### Example Test Cases in Postman
   
   - **Get all products:**  
     - Method: GET  
     - URL: `http://localhost:3000/api/products`  
     - Headers: `x-api-key: your-secret-api-key-123`
   
   - **Create a product:**  
     - Method: POST  
     - URL: `http://localhost:3000/api/products`  
     - Headers: `x-api-key: your-secret-api-key-123`, `Content-Type: application/json`  
     - Body: (see above)
   
   - **Get product statistics:**  
     - Method: GET  
     - URL: `http://localhost:3000/api/products/stats`  
     - Headers: `x-api-key: your-secret-api-key-123`
   
   ## ⚠️ Error Handling
   
   - Returns appropriate HTTP status codes and error messages for validation, authentication, and not found errors.
   
   ## 📄 .env.example
   
   ```
   PORT=3000
   API_KEY=your-secret-api-key-123
   ```
   
   ---
   
   **Assignment complete!**  