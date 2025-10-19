#!/bin/bash
# create-sample-jira-data.sh - Create realistic sample data for Jira project

echo "🎯 Creating Sample Jira Data for COMM Project"
echo "============================================="
echo ""

# Business Requirements & Features
echo "📋 Creating Business Requirements & Features..."

curl -s -X POST http://localhost:3000/api/integrations/jira/ticket \
  -H "Content-Type: application/json" \
  -d '{
    "project_key": "COMM",
    "summary": "Implement User Authentication System",
    "description": "**Business Requirement**\n\nAs a user, I want to be able to log in securely so that I can access my personalized dashboard.\n\n**Acceptance Criteria:**\n- Users can register with email and password\n- Users can log in with valid credentials\n- Password reset functionality\n- Session management\n- Two-factor authentication (optional)\n\n**Business Value:**\n- Enables personalized user experience\n- Protects user data and privacy\n- Foundation for premium features",
    "issue_type": "Submit a request or incident",
    "priority": "High",
    "labels": ["business-requirement", "authentication", "user-management"]
  }' > /dev/null

curl -s -X POST http://localhost:3000/api/integrations/jira/ticket \
  -H "Content-Type: application/json" \
  -d '{
    "project_key": "COMM",
    "summary": "Add Payment Processing Integration",
    "description": "**Business Feature**\n\nIntegrate Stripe payment processing to enable subscription billing for premium features.\n\n**Requirements:**\n- Monthly/yearly subscription plans\n- Credit card processing\n- Invoice generation\n- Payment failure handling\n- Refund processing\n\n**Business Impact:**\n- Revenue generation\n- Customer retention\n- Scalable billing model",
    "issue_type": "Submit a request or incident",
    "priority": "High",
    "labels": ["business-feature", "payment", "revenue", "stripe"]
  }' > /dev/null

curl -s -X POST http://localhost:3000/api/integrations/jira/ticket \
  -H "Content-Type: application/json" \
  -d '{
    "project_key": "COMM",
    "summary": "Implement Analytics Dashboard",
    "description": "**Business Intelligence**\n\nCreate comprehensive analytics dashboard for business stakeholders to track key metrics.\n\n**Metrics to Track:**\n- User engagement\n- Feature usage\n- Revenue metrics\n- Performance indicators\n- Customer satisfaction\n\n**Stakeholders:**\n- Product managers\n- Business executives\n- Marketing team",
    "issue_type": "Submit a request or incident",
    "priority": "Medium",
    "labels": ["business-intelligence", "analytics", "dashboard", "metrics"]
  }' > /dev/null

# Technical Tasks
echo "🔧 Creating Technical Tasks..."

curl -s -X POST http://localhost:3000/api/integrations/jira/ticket \
  -H "Content-Type: application/json" \
  -d '{
    "project_key": "COMM",
    "summary": "Optimize Database Performance",
    "description": "**Technical Task**\n\nDatabase queries are running slowly, affecting user experience. Need to optimize performance.\n\n**Issues Identified:**\n- Slow query execution (>2s)\n- Missing database indexes\n- Inefficient joins\n- Large result sets\n\n**Solution:**\n- Add proper indexes\n- Optimize query structure\n- Implement query caching\n- Database connection pooling",
    "issue_type": "Submit a request or incident",
    "priority": "High",
    "labels": ["technical", "performance", "database", "optimization"]
  }' > /dev/null

curl -s -X POST http://localhost:3000/api/integrations/jira/ticket \
  -H "Content-Type: application/json" \
  -d '{
    "project_key": "COMM",
    "summary": "Implement API Rate Limiting",
    "description": "**Technical Enhancement**\n\nImplement rate limiting to prevent API abuse and ensure fair usage.\n\n**Requirements:**\n- 1000 requests per hour per user\n- 100 requests per minute per IP\n- Graceful error responses\n- Rate limit headers in responses\n\n**Implementation:**\n- Redis-based rate limiting\n- Middleware integration\n- Configurable limits",
    "issue_type": "Submit a request or incident",
    "priority": "Medium",
    "labels": ["technical", "api", "security", "rate-limiting"]
  }' > /dev/null

curl -s -X POST http://localhost:3000/api/integrations/jira/ticket \
  -H "Content-Type: application/json" \
  -d '{
    "project_key": "COMM",
    "summary": "Set up CI/CD Pipeline",
    "description": "**DevOps Task**\n\nEstablish continuous integration and deployment pipeline for automated testing and deployment.\n\n**Pipeline Stages:**\n- Code quality checks\n- Unit tests\n- Integration tests\n- Security scanning\n- Automated deployment\n\n**Tools:**\n- GitHub Actions\n- Docker containers\n- AWS deployment",
    "issue_type": "Submit a request or incident",
    "priority": "Medium",
    "labels": ["devops", "ci-cd", "automation", "deployment"]
  }' > /dev/null

# Bug Reports
echo "🐛 Creating Bug Reports..."

curl -s -X POST http://localhost:3000/api/integrations/jira/ticket \
  -H "Content-Type: application/json" \
  -d '{
    "project_key": "COMM",
    "summary": "Login fails on mobile devices",
    "description": "**Bug Report**\n\nUsers are unable to log in when using mobile devices (iOS/Android).\n\n**Steps to Reproduce:**\n1. Open app on mobile device\n2. Enter valid credentials\n3. Tap login button\n4. Error message appears\n\n**Expected:**\nUser should be logged in successfully\n\n**Actual:**\nLogin fails with error: \"Authentication failed\"\n\n**Environment:**\n- iOS 15.0+\n- Android 11+\n- App version 2.1.0",
    "issue_type": "Submit a request or incident",
    "priority": "High",
    "labels": ["bug", "mobile", "authentication", "critical"]
  }' > /dev/null

curl -s -X POST http://localhost:3000/api/integrations/jira/ticket \
  -H "Content-Type: application/json" \
  -d '{
    "project_key": "COMM",
    "summary": "Data export feature returns corrupted files",
    "description": "**Bug Report**\n\nWhen users export their data, the generated CSV files are corrupted and cannot be opened.\n\n**Impact:**\n- Users cannot backup their data\n- Data loss concerns\n- Customer support tickets increasing\n\n**Root Cause:**\n- Character encoding issues\n- Special characters not handled\n- File format problems\n\n**Workaround:**\n- Manual data export via API\n- Contact support for assistance",
    "issue_type": "Submit a request or incident",
    "priority": "Medium",
    "labels": ["bug", "data-export", "csv", "encoding"]
  }' > /dev/null

# Customer Support
echo "🎧 Creating Customer Support Tickets..."

curl -s -X POST http://localhost:3000/api/integrations/jira/ticket \
  -H "Content-Type: application/json" \
  -d '{
    "project_key": "COMM",
    "summary": "Customer: Cannot access premium features after payment",
    "description": "**Customer Support Request**\n\nCustomer: john.doe@company.com\nSubscription: Premium Monthly\nPayment Date: 2024-01-15\n\n**Issue:**\nCustomer paid for premium subscription but still sees free tier limitations.\n\n**Investigation:**\n- Payment processed successfully\n- Subscription status not updated\n- User permissions not upgraded\n\n**Resolution:**\n- Manually update subscription status\n- Refresh user permissions\n- Send confirmation email\n- Follow up in 24 hours",
    "issue_type": "Submit a request or incident",
    "priority": "High",
    "labels": ["customer-support", "billing", "premium", "urgent"]
  }' > /dev/null

curl -s -X POST http://localhost:3000/api/integrations/jira/ticket \
  -H "Content-Type: application/json" \
  -d '{
    "project_key": "COMM",
    "summary": "Customer: Request for API documentation",
    "description": "**Customer Support Request**\n\nCustomer: developer@startup.com\nRequest: Complete API documentation\n\n**Details:**\nCustomer is building integration with our platform and needs comprehensive API documentation.\n\n**Current Status:**\n- Basic API docs available\n- Missing advanced endpoints\n- No code examples\n- No SDK documentation\n\n**Action Required:**\n- Update API documentation\n- Add code examples\n- Create SDK documentation\n- Schedule demo call",
    "issue_type": "Submit a request or incident",
    "priority": "Medium",
    "labels": ["customer-support", "documentation", "api", "integration"]
  }' > /dev/null

# Marketing & Growth
echo "📈 Creating Marketing & Growth Tasks..."

curl -s -X POST http://localhost:3000/api/integrations/jira/ticket \
  -H "Content-Type: application/json" \
  -d '{
    "project_key": "COMM",
    "summary": "Launch Referral Program",
    "description": "**Marketing Initiative**\n\nImplement referral program to drive user growth and increase customer acquisition.\n\n**Program Details:**\n- 30-day free trial for referrals\n- $50 credit for referrer\n- Track referral metrics\n- Automated email campaigns\n\n**Success Metrics:**\n- 20% increase in signups\n- 15% reduction in CAC\n- 25% increase in user engagement\n\n**Timeline:**\n- Development: 2 weeks\n- Testing: 1 week\n- Launch: Q1 2024",
    "issue_type": "Submit a request or incident",
    "priority": "Medium",
    "labels": ["marketing", "growth", "referral", "acquisition"]
  }' > /dev/null

curl -s -X POST http://localhost:3000/api/integrations/jira/ticket \
  -H "Content-Type: application/json" \
  -d '{
    "project_key": "COMM",
    "summary": "Create Product Demo Video",
    "description": "**Marketing Content**\n\nCreate professional product demo video for website and social media.\n\n**Content Requirements:**\n- 2-minute overview video\n- Feature highlights\n- Customer testimonials\n- Call-to-action\n\n**Distribution:**\n- Website homepage\n- YouTube channel\n- LinkedIn\n- Twitter\n- Email campaigns\n\n**Production:**\n- Professional voiceover\n- Screen recordings\n- Graphics and animations\n- Multiple language versions",
    "issue_type": "Submit a request or incident",
    "priority": "Low",
    "labels": ["marketing", "content", "video", "demo"]
  }' > /dev/null

# Compliance & Security
echo "🔒 Creating Compliance & Security Tasks..."

curl -s -X POST http://localhost:3000/api/integrations/jira/ticket \
  -H "Content-Type: application/json" \
  -d '{
    "project_key": "COMM",
    "summary": "GDPR Compliance Audit",
    "description": "**Compliance Task**\n\nConduct comprehensive GDPR compliance audit to ensure data protection standards.\n\n**Audit Areas:**\n- Data collection practices\n- User consent mechanisms\n- Data retention policies\n- Right to be forgotten\n- Data portability\n- Privacy policy updates\n\n**Deliverables:**\n- Compliance report\n- Action plan\n- Policy updates\n- Training materials\n\n**Deadline:**\n- Audit completion: March 2024\n- Implementation: June 2024",
    "issue_type": "Submit a request or incident",
    "priority": "High",
    "labels": ["compliance", "gdpr", "privacy", "audit"]
  }' > /dev/null

curl -s -X POST http://localhost:3000/api/integrations/jira/ticket \
  -H "Content-Type: application/json" \
  -d '{
    "project_key": "COMM",
    "summary": "Security Penetration Testing",
    "description": "**Security Task**\n\nConduct third-party penetration testing to identify security vulnerabilities.\n\n**Testing Scope:**\n- Web application security\n- API security\n- Infrastructure security\n- Social engineering\n- Physical security\n\n**Expected Outcomes:**\n- Vulnerability assessment report\n- Risk prioritization\n- Remediation recommendations\n- Security roadmap\n\n**Vendor:**\n- External security firm\n- Certified ethical hackers\n- Industry-standard tools",
    "issue_type": "Submit a request or incident",
    "priority": "High",
    "labels": ["security", "penetration-testing", "vulnerability", "audit"]
  }' > /dev/null

echo ""
echo "✅ Sample Jira Data Created Successfully!"
echo "========================================"
echo ""
echo "📊 Created Tickets:"
echo "- 3 Business Requirements & Features"
echo "- 3 Technical Tasks"
echo "- 2 Bug Reports"
echo "- 2 Customer Support Tickets"
echo "- 2 Marketing & Growth Tasks"
echo "- 2 Compliance & Security Tasks"
echo ""
echo "🎯 Total: 14 realistic tickets created"
echo ""
echo "🔗 View your tickets at: https://faikbairamov0.atlassian.net/projects/COMM"
echo ""
echo "📈 This data will provide rich history for AI summarization analysis!"
