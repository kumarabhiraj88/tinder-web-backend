//import express framework
const express = require('express');
require('dotenv').config(); // Load environment variables

// create an instance of express application
const app = express();
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`);
})