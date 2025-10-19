// Security vulnerability - SQL injection
const mysql = require('mysql');

function getUserData(userId) {
  const query = `SELECT * FROM users WHERE id = ${userId}`;
  return mysql.query(query); // SQL injection vulnerability
}

// Hardcoded credentials
const DB_PASSWORD = "admin123";
const API_KEY = "sk-1234567890abcdef";

// No input validation
function processUserInput(input) {
  return eval(input); // Dangerous eval usage
}
