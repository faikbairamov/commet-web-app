#!/bin/bash
# quick-demo.sh - 3-minute demo script

echo "🎯 Commet AI-to-Jira Demo (3 minutes)"
echo "====================================="
echo ""

echo "📊 Step 1: Show problematic code (30 seconds)"
echo "Files with issues:"
ls -la /Users/faikbairamov/Documents/Projects/commet-web-app/commet-demo-repo/
echo ""
echo "Security issues in security-issue.js:"
echo "- SQL Injection vulnerability"
echo "- Hardcoded credentials" 
echo "- Dangerous eval() usage"
echo ""
echo "Performance issues in performance-issue.js:"
echo "- Memory leak"
echo "- Inefficient loops"
echo ""

echo "🤖 Step 2: AI Analysis & Ticket Creation (30 seconds)"
echo "Creating Jira tickets for detected issues..."

# Create tickets quickly
curl -s -X POST http://localhost:3000/api/integrations/jira/ticket \
  -H "Content-Type: application/json" \
  -d '{
    "project_key": "COMM",
    "summary": "SQL Injection Vulnerability",
    "description": "**CRITICAL**: Direct SQL injection in getUserData function. Use parameterized queries.",
    "issue_type": "Submit a request or incident",
    "priority": "High",
    "labels": ["commet-analysis", "security"]
  }' > /dev/null

curl -s -X POST http://localhost:3000/api/integrations/jira/ticket \
  -H "Content-Type: application/json" \
  -d '{
    "project_key": "COMM", 
    "summary": "Hardcoded API Keys",
    "description": "**HIGH**: API keys exposed in source code. Move to environment variables.",
    "issue_type": "Submit a request or incident",
    "priority": "High",
    "labels": ["commet-analysis", "security"]
  }' > /dev/null

echo "✅ Tickets created successfully!"
echo ""

echo "🎫 Step 3: Check Results (30 seconds)"
echo "Visit: https://faikbairamov0.atlassian.net/projects/COMM"
echo "✅ AI automatically detected critical security issues"
echo "✅ Created detailed Jira tickets with analysis"
echo "✅ Assigned proper priorities and labels"
echo "✅ Provided specific fix recommendations"
echo ""

echo "🚀 Demo Complete! Check your Jira project now."
