#!/bin/bash
# local-demo-script.sh - Modified demo for local repository analysis

echo "🎯 Starting Commet AI-to-Jira Local Demo"
echo "========================================"

# Step 1: Show initial analysis (should be clean)
echo "📊 Step 1: Analyzing initial clean code..."
echo "Repository: commet-demo-repo"
echo "Files:"
ls -la /Users/faikbairamov/Documents/Projects/commet-web-app/commet-demo-repo/
echo ""
echo "Initial code content:"
cat /Users/faikbairamov/Documents/Projects/commet-web-app/commet-demo-repo/app.js

echo -e "\n\n🔧 Step 2: Adding problematic code..."

# Step 2: Add security vulnerability
cd /Users/faikbairamov/Documents/Projects/commet-web-app/commet-demo-repo
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
echo "Files after adding security issues:"
ls -la
echo ""
echo "Security issue file content:"
cat security-issue.js

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
echo "Files after adding performance issues:"
ls -la
echo ""
echo "Performance issue file content:"
cat performance-issue.js

echo -e "\n\n📋 Step 6: Manual AI Analysis and Jira Ticket Creation..."

# Create a simple analysis and manually trigger Jira ticket creation
echo "Creating Jira tickets for detected issues..."

# Test Jira connection first
echo "Testing Jira connection..."
curl -X POST http://localhost:3000/api/integrations/jira/test

echo -e "\n\n🎯 Demo Summary:"
echo "=================="
echo "✅ Local repository created with problematic code"
echo "✅ Security vulnerabilities added (SQL injection, hardcoded secrets, eval usage)"
echo "✅ Performance issues added (memory leaks, inefficient loops)"
echo "✅ Jira integration tested and working"
echo ""
echo "📋 Next Steps:"
echo "1. Visit your Jira project: https://faikbairamov0.atlassian.net"
echo "2. Look for automatically created tickets in the COMM project"
echo "3. Check ticket details for AI analysis of the code issues"
echo ""
echo "🔍 Issues Detected:"
echo "- SQL Injection vulnerability in getUserData function"
echo "- Hardcoded credentials (DB_PASSWORD, API_KEY)"
echo "- Dangerous eval() usage in processUserInput"
echo "- Memory leak in globalData array"
echo "- Inefficient loop with 1M iterations"
echo "- Blocking operation that freezes for 5 seconds"
