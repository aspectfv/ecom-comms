# Merca Finds E-Commerce Platform

Merca Finds is a full-stack e-commerce application designed as a one-stop platform for discovering a curated selection of both pre-owned and brand-new items. It features a role-based access system for customers, staff, and administrators, each with a tailored user experience.

The application is built with a modern tech stack, featuring a React frontend powered by Vite and Material-UI, and a robust Node.js/Express backend with a MongoDB database.

## Features

### Customer Features
*   **Browse & Discover:** A beautiful home page to explore "Pre-loved" and "Brand New" items.
*   **Advanced Filtering & Search:** Easily find items by name, category, or price range.
*   **Detailed Item View:** View multiple images, descriptions, conditions (for pre-loved items), and prices.
*   **Shopping Cart:** Add or remove items from a persistent shopping cart.
*   **Secure Checkout:** A streamlined checkout process with options for delivery or pickup, and multiple payment methods (including E-Wallet with proof of payment upload).
*   **Order History:** Customers can view a list of all their past and current orders and see their status.
*   **Real-time Notifications:** Receive notifications for order status updates (e.g., "Out for Delivery," "Ready for Pickup").

### Staff Features
*   **Management Dashboard:** A dedicated panel for managing store operations.
*   **Inventory Management:** View the full product inventory.
*   **Add New Listings:** Easily add new items to the store, including details like name, price, owner, category, description, and images.

### Admin Features
*   **All Staff Features Included.**
*   **Full CRUD on Inventory:** Admins have complete control to create, read, **update**, and **delete** any item listing.
*   **Order Management:** View all customer orders, check details, and update their status (e.g., mark as "Out for Delivery" or "Completed").
*   **Sales Analytics Dashboard:** A comprehensive sales report page with data visualizations (charts for sales by owner, sales trends) and powerful filters.
*   **Data Exporting:** Export sales and inventory data to CSV or PDF for record-keeping and analysis.
*   **Real-time Order Notifications:** Receive notifications whenever a new order is placed.

## Tech Stack

| Area      | Technology                                                                          |
| :-------- | :---------------------------------------------------------------------------------- |
| **Frontend**  | [React](https://reactjs.org/), [Vite](https://vitejs.dev/), [React Router](https://reactrouter.com/), [Material-UI (MUI)](https://mui.com/), [Axios](https://axios-http.com/) |
| **Backend**   | [Node.js](https://nodejs.org/), [Express](https://expressjs.com/), [MongoDB](https://www.mongodb.com/), [Mongoose](https://mongoosejs.com/)                   |
| **Authentication** | [JSON Web Tokens (JWT)](https://jwt.io/)                                                      |
| **File Uploads** | [Multer](https://github.com/expressjs/multer)                                                       |
| **Development**| [Concurrently](https://github.com/open-cli-tools/concurrently) (for running both servers at once)                                          |

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

*   **Node.js and npm:** Make sure you have Node.js (v18 or newer) and npm installed. You can download them from [nodejs.org](https://nodejs.org/).
*   **MongoDB:** You need a running MongoDB instance. You can use a local installation or a cloud service like [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).

### Installation and Setup

1.  **Clone the Repository**
    ```bash
    git clone <your-repository-url>
    cd <repository-folder>
    ```

2.  **Set Up Environment Variables**

    Create a `.env` file inside the `backend/` directory. Copy the contents of the example below and replace the placeholder values with your actual configuration.

    **File:** `backend/.env`
    ```env
    # MongoDB Connection String
    # Replace this with your local or cloud MongoDB URI
    MONGODB_URI=mongodb://localhost:27017/merca-finds

    # JSON Web Token Secret
    # Use a long, random, and secret string for security
    JWT_SECRET=your_super_secret_jwt_key

    # The base URL of the backend server.
    # This is used for constructing absolute URLs for images in the API response.
    # Ensure this matches the port your backend server is running on.
    BASE_URL=http://localhost:3000
    ```

3.  **Install Dependencies**

    From the **root directory** of the project, run the `install-all` script. This will install dependencies for the root, backend, and frontend projects in one step.
    ```bash
    npm run install-all
    ```

4.  **Seed the Database**

    The project includes a seeding script to populate the database with initial data (users, items, orders). This is essential for a working demo.

    From the **root directory**, run:
    ```bash
    npm run seed --prefix backend
    ```    This script will:
    *   Clear any existing data.
    *   Create default user accounts with different roles.
    *   Add sample product listings.
    *   Create sample carts and orders.

    **Pre-configured User Accounts:**
    *   **Admin:** `admin@mercafinds.com` / `password123`
    *   **Staff:** `staff@mercafinds.com` / `password123`
    *   **Customer:** `customer1@example.com` / `password123`

5.  **Run the Project**

    Once installation is complete, you can start the development servers for both the frontend and backend using a single command from the **root directory**.
    ```bash
    npm run dev
    ```
    This command uses `concurrently` to:
    *   Start the backend server (usually on `http://localhost:3000`).
    *   Start the frontend Vite development server (usually on `http://localhost:5173`).

    Your default browser should open to the application automatically. If not, navigate to `http://localhost:5173`.

## Project Structure

The codebase is organized into two main folders: `backend` and `frontend`.

```
/
├── backend/
│   ├── src/
│   │   ├── controllers/  # Handles request logic
│   │   ├── models/       # Mongoose schemas for the database
│   │   ├── routes/       # API route definitions
│   │   └── utils/        # Auth, error handlers, and other utilities
│   ├── public/         # Serves static files (e.g., uploaded images)
│   ├── app.js          # Express app configuration
│   └── server.js       # Server entry point
│
└── frontend/
    ├── src/
    │   ├── components/   # Reusable React components (UI and features)
    │   ├── routes/       # React Router loaders and actions
    │   ├── services/     # API call functions (using Axios)
    │   ├── App.jsx       # Main application component with routing
    │   └── main.jsx      # Frontend entry point
    │
    └── vite.config.js    # Vite configuration, including proxy for API calls
```

## Available Scripts

The following scripts can be run from the project's **root directory**:

*   `npm run install-all`: Installs all dependencies for the entire project.
*   `npm run dev`: Starts both the frontend and backend development servers with hot-reloading.
*   `npm run build`: Bundles the frontend application for production and prepares the backend.

---
