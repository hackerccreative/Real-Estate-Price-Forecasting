const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const predictRoute = require('./routes/predict');
const localitiesRoute = require('./routes/localities'); // Added to support frontend

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/api', predictRoute);
app.use('/api', localitiesRoute);

// Health check
app.get('/', (req, res) => {
    res.send('Real Estate Prediction API is running');
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
