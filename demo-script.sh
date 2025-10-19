#!/bin/bash
# demo-script.sh

echo "🎯 Starting Commet AI-to-Jira Demo"
echo "=================================="

# Step 1: Show initial analysis (should be clean)
echo "📊 Step 1: Analyzing initial clean code..."
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "question": "What are the code quality issues in this repository?",
    "repo": "/Users/faikbairamov/Documents/Projects/commet-web-app/commet-demo-repo",
    "branch": "main",
    "commits_limit": 5
  }'

echo -e "\n\n🔧 Step 2: Adding problematic code..."

# Step 2: Add security vulnerability
cat > security-issue.js << 'EOF'
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
EOF

git add security-issue.js
git commit -m "Add user authentication module"

echo "🚨 Step 3: Analyzing code with security issues..."
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "question": "What security vulnerabilities exist in this repository?",
    "repo": "/Users/faikbairamov/Documents/Projects/commet-web-app/commet-demo-repo",
    "branch": "main",
    "commits_limit": 10
  }'

echo -e "\n\n🐛 Step 4: Adding performance issues..."

# Step 3: Add performance issues
cat > performance-issue.js << 'EOF'
// Performance issues
function inefficientLoop() {
  const data = [];
  for (let i = 0; i < 1000000; i++) {
    data.push(i * Math.random()); // Inefficient memory usage
  }
  return data;
}

// Memory leak
let globalData = [];
function addToGlobal(data) {
  globalData.push(data); // Never cleared - memory leak
}

// Blocking operation
function blockingOperation() {
  const start = Date.now();
  while (Date.now() - start < 5000) {
    // Block for 5 seconds
  }
}
EOF

git add performance-issue.js
git commit -m "Add data processing utilities"

echo "⚡ Step 5: Analyzing performance issues..."
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "question": "What performance issues exist in this codebase?",
    "repo": "/Users/faikbairamov/Documents/Projects/commet-web-app/commet-demo-repo",
    "branch": "main",
    "commits_limit": 15
  }'

echo -e "\n\n📋 Step 6: Check created Jira tickets..."
echo "Visit your Jira project to see the automatically created tickets!"
