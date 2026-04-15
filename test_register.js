const http = require('http');

const data = JSON.stringify({
  email: 'testuser2@example.com',
  password: 'password123',
  name: 'Test User 2',
  gender: 'Female',
  dateOfBirth: '1998-05-15',
  city: 'Mumbai',
  state: 'Maharashtra',
  religion: 'Hindu'
});

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/auth/register',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, (res) => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('Body:', body);
  });
});

req.on('error', error => {
  console.error(error);
});

req.write(data);
req.end();
