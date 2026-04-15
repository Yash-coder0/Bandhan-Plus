const jwt = require('jsonwebtoken');
require('dotenv').config(); // This pulls your secret from the .env file

// This is the data you want to hide inside the token
const payload = {
    id: "12345",
    username: "yashraj",
    role: "admin"
};

// This signs the data using your secret
const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

console.log("------------------------------------------");
console.log("YOUR GENERATED TOKEN:");
console.log(token);
console.log("------------------------------------------");