# 🎯 Commet AI-to-Jira Demo Setup Guide

## 🚀 Demo Concept

**Real-time AI-powered issue detection and automatic Jira ticket creation**

The demo will show how Commet automatically detects code issues and creates Jira tickets in real-time as you commit problematic code to a repository.

## 📋 Prerequisites

### 1. **Jira Setup**

- Jira Cloud account (free tier works)
- Create a new project (e.g., "COMMET-DEMO")
- Generate API token
- Note your project key (e.g., "CD")

### 2. **GitHub Repository**

- Create a new public repository for the demo
- Add some initial code (can be simple)
- Get repository access token (optional, for private repos)

### 3. **Environment Setup**

- Commet backend running
- Jira integration configured
- OpenAI API key configured

## 🔧 Step-by-Step Demo Setup

### **Step 1: Configure Jira Integration**

1. **Get Jira API Token**:

   ```bash
   # Go to: https://your-domain.atlassian.net/secure/ViewProfile.jspa
   # Security → API tokens → Create API token
   ```

2. **Update Backend Environment**:

   ```bash
   # In commet-remote-data-server/.env
   JIRA_URL=https://your-domain.atlassian.net
   JIRA_EMAIL=your-email@company.com
   JIRA_API_TOKEN=your_jira_api_token_here
   JIRA_PROJECT_KEY=CD  # Your project key
   JIRA_AUTO_CREATE_TICKETS=true
   ```

3. **Test Jira Connection**:
   ```bash
   curl -X POST http://localhost:3000/api/integrations/jira/test
   ```

### **Step 2: Create Demo Repository**

1. **Create GitHub Repository**:

   ```bash
   # Create a new repository called "commet-demo-repo"
   # Add initial files
   ```

2. **Add Initial Code** (good code):

   ```javascript
   // app.js - Initial clean code
   const express = require("express");
   const app = express();

   app.get("/health", (req, res) => {
     res.json({ status: "healthy" });
   });

   app.listen(3000, () => {
     console.log("Server running on port 3000");
   });
   ```

### **Step 3: Demo Script**

Create a demo script that commits problematic code and shows the AI detection:

```bash
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
    "repo": "your-username/commet-demo-repo",
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
    "repo": "your-username/commet-demo-repo",
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
    "repo": "your-username/commet-demo-repo",
    "branch": "main",
    "commits_limit": 15
  }'

echo -e "\n\n📋 Step 6: Check created Jira tickets..."
echo "Visit your Jira project to see the automatically created tickets!"
```

## 🎬 Demo Flow

### **Live Demo Presentation**

1. **Setup (2 minutes)**:

   - Show Jira project (empty initially)
   - Show Commet interface
   - Explain the integration

2. **Initial Analysis (1 minute)**:

   - Analyze clean repository
   - Show "No issues detected" response
   - Demonstrate AI analysis capabilities

3. **Add Security Issues (2 minutes)**:

   - Commit code with SQL injection
   - Ask AI about security vulnerabilities
   - **Watch Jira tickets appear automatically!**
   - Show ticket details, priority, labels

4. **Add Performance Issues (2 minutes)**:

   - Commit code with memory leaks
   - Ask AI about performance issues
   - **More tickets created automatically!**
   - Show different ticket types

5. **Show Results (1 minute)**:
   - Jira dashboard with all created tickets
   - Ticket details and AI analysis
   - Demonstrate the complete workflow

## 🎯 Demo Repository Code Examples

### **Security Issues to Add**:

```javascript
// 1. SQL Injection
const query = `SELECT * FROM users WHERE id = ${userId}`;

// 2. Hardcoded Secrets
const API_KEY = "sk-1234567890abcdef";
const PASSWORD = "admin123";

// 3. XSS Vulnerability
document.innerHTML = userInput; // No sanitization

// 4. Weak Authentication
if (password === "password") {
  return true; // Weak password check
}
```

### **Performance Issues to Add**:

```javascript
// 1. Memory Leak
let globalArray = [];
function addData(data) {
  globalArray.push(data); // Never cleared
}

// 2. Inefficient Loops
for (let i = 0; i < 1000000; i++) {
  // Heavy computation without optimization
}

// 3. Blocking Operations
while (true) {
  // Infinite loop
}
```

### **Code Quality Issues to Add**:

```javascript
// 1. No Error Handling
function riskyOperation() {
  return dangerousFunction(); // No try-catch
}

// 2. Duplicate Code
function calculateTax1(amount) {
  return amount * 0.1;
}
function calculateTax2(amount) {
  return amount * 0.1; // Duplicate
}

// 3. Poor Naming
const a = 10;
const b = 20;
const c = a + b; // Unclear variable names
```

## 🔍 Expected AI Responses & Ticket Creation

### **Security Analysis Response**:

```
Based on the repository analysis, I've detected several critical security vulnerabilities:

### 1. **SQL Injection Vulnerability**
- **File**: security-issue.js, line 4
- **Issue**: Direct string interpolation in SQL query
- **Risk**: High - allows arbitrary SQL execution
- **Recommendation**: Use parameterized queries

### 2. **Hardcoded Credentials**
- **File**: security-issue.js, lines 8-9
- **Issue**: API keys and passwords in source code
- **Risk**: High - credential exposure
- **Recommendation**: Use environment variables

### 3. **Dangerous Eval Usage**
- **File**: security-issue.js, line 13
- **Issue**: Direct eval() execution of user input
- **Risk**: Critical - code injection
- **Recommendation**: Remove eval() usage
```

### **Automatically Created Jira Tickets**:

1. **Ticket 1**: "SQL Injection Vulnerability in User Authentication"

   - Priority: High
   - Labels: `commet-analysis`, `security`, `severity-high`
   - Description: Full AI analysis with code context

2. **Ticket 2**: "Hardcoded Credentials in Source Code"

   - Priority: High
   - Labels: `commet-analysis`, `security`, `credentials`
   - Description: AI analysis with recommendations

3. **Ticket 3**: "Dangerous Eval Usage in User Input Processing"
   - Priority: Critical
   - Labels: `commet-analysis`, `security`, `code-injection`
   - Description: Critical security issue analysis

## 🎪 Demo Tips

### **Presentation Tips**:

1. **Start with empty Jira project** - shows the "before" state
2. **Use screen sharing** - show both Commet and Jira simultaneously
3. **Explain each step** - what you're doing and why
4. **Highlight the automation** - emphasize that tickets are created automatically
5. **Show ticket details** - demonstrate the quality of AI analysis

### **Timing**:

- **Total demo time**: 8-10 minutes
- **Setup explanation**: 2 minutes
- **Live coding**: 4-5 minutes
- **Results showcase**: 2-3 minutes

### **Backup Plan**:

- Have screenshots of expected results
- Prepare a pre-recorded video as backup
- Test the demo flow beforehand

## 🚀 Advanced Demo Features

### **Real-time Webhook Demo**:

1. Set up Jira webhooks
2. Show real-time ticket updates
3. Demonstrate bidirectional sync

### **Team Collaboration Demo**:

1. Show multiple team members
2. Demonstrate shared analysis
3. Show collaborative ticket management

### **Custom AI Prompts Demo**:

1. Ask specific questions about different issue types
2. Show how AI adapts to different contexts
3. Demonstrate the intelligence of the analysis

## 📊 Success Metrics

### **Demo Success Indicators**:

- ✅ Jira tickets created automatically
- ✅ Accurate issue detection
- ✅ Proper priority assignment
- ✅ Detailed AI analysis in tickets
- ✅ Real-time workflow demonstration
- ✅ Audience engagement and questions

This demo will showcase the power of AI-driven development workflow automation and demonstrate real business value! 🎯
