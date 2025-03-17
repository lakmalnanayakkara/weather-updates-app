# Weather Updates App

## Setup Instructions

Follow these steps to set up the project locally.

### 1. Clone the Repository  
Run the following command to clone the project:  
```bash
git clone https://github.com/lakmalnanayakkara/weather-updates-app.git
```

### 2. Install Dependencies  
Navigate to the project folder and install the required dependencies:  
```bash
npm install
```

### 3. Configure Environment Variables  
Create a `.env` file in the root directory and add the following variables with your credentials:

```env
MONGODB_URI=mongodb://localhost/weatherApp
SECRET_KEY=E5rAq9V6rP3hMbD2LXp8zT5Nk2yFgPzWbYdQJ7oR3NvK9hJ4Tq2oZ7J6X8K1vPm
TOKEN_VALIDITY=3600
API_KEY=your_key
EMAIL_HOST=smtp.gmaill.com
EMAIL_PORT=465
EMAIL_USER=your_email
EMAIL_PASSWORD=your_pass
OPEN_API_KEY=your_key
```

### 4. Start the Application  
Run the application using:  
```bash
npm start
```

### 5. Access the Application  
Once the server is running, open your browser and visit:  
```
http://localhost:3000
```

---



