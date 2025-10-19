#!/bin/bash
# create-project-data.sh - Create realistic project management data for Jira

echo "🎯 Creating Project Management Data for COMM Project"
echo "=================================================="
echo ""

# Project Planning & Roadmap
echo "📋 Creating Project Planning & Roadmap Tickets..."

curl -s -X POST http://localhost:3000/api/integrations/jira/ticket \
  -H "Content-Type: application/json" \
  -d '{
    "project_key": "COMM",
    "summary": "Q1 2024 Product Roadmap Planning",
    "description": "**Project Planning Task**\n\nPlan and define the Q1 2024 product roadmap for the Commet platform.\n\n**Objectives:**\n- Define key features for Q1\n- Set realistic timelines\n- Align with business goals\n- Resource allocation planning\n\n**Deliverables:**\n- Product roadmap document\n- Feature prioritization matrix\n- Resource requirements\n- Risk assessment\n\n**Stakeholders:**\n- Product Manager\n- Engineering Lead\n- Business Stakeholders\n\n**Timeline:**\n- Start: January 1, 2024\n- Complete: January 15, 2024",
    "issue_type": "Submit a request or incident",
    "priority": "High",
    "labels": ["project-planning", "roadmap", "q1-2024", "strategic"]
  }' > /dev/null

curl -s -X POST http://localhost:3000/api/integrations/jira/ticket \
  -H "Content-Type: application/json" \
  -d '{
    "project_key": "COMM",
    "summary": "Sprint Planning for Sprint 23",
    "description": "**Sprint Planning**\n\nPlan Sprint 23 focusing on AI integration improvements and user experience enhancements.\n\n**Sprint Goals:**\n- Improve AI response accuracy\n- Enhance user interface\n- Fix critical bugs\n- Add new integrations\n\n**Capacity:**\n- 5 developers\n- 2 QA engineers\n- 1 designer\n- 40 story points capacity\n\n**Key Stories:**\n- AI model optimization (8 points)\n- UI/UX improvements (13 points)\n- Bug fixes (10 points)\n- New integrations (9 points)",
    "issue_type": "Submit a request or incident",
    "priority": "High",
    "labels": ["sprint-planning", "sprint-23", "agile", "capacity-planning"]
  }' > /dev/null

# Development Tasks
echo "🔧 Creating Development Tasks..."

curl -s -X POST http://localhost:3000/api/integrations/jira/ticket \
  -H "Content-Type: application/json" \
  -d '{
    "project_key": "COMM",
    "summary": "Implement Real-time Collaboration Features",
    "description": "**Development Task**\n\nImplement real-time collaboration features to allow multiple users to work on the same analysis simultaneously.\n\n**Technical Requirements:**\n- WebSocket integration\n- Real-time data synchronization\n- Conflict resolution\n- User presence indicators\n\n**Acceptance Criteria:**\n- Multiple users can edit simultaneously\n- Changes are synchronized in real-time\n- Conflict resolution works properly\n- Performance remains acceptable\n\n**Estimated Effort:**\n- 13 story points\n- 2 weeks development\n- 1 week testing",
    "issue_type": "Submit a request or incident",
    "priority": "High",
    "labels": ["development", "real-time", "collaboration", "websockets"]
  }' > /dev/null

curl -s -X POST http://localhost:3000/api/integrations/jira/ticket \
  -H "Content-Type: application/json" \
  -d '{
    "project_key": "COMM",
    "summary": "Refactor Authentication System",
    "description": "**Technical Debt**\n\nRefactor the authentication system to improve security and maintainability.\n\n**Current Issues:**\n- Legacy authentication code\n- Security vulnerabilities\n- Poor error handling\n- Difficult to maintain\n\n**Refactoring Goals:**\n- Implement OAuth 2.0\n- Add multi-factor authentication\n- Improve error handling\n- Better logging and monitoring\n\n**Impact:**\n- High security improvement\n- Better user experience\n- Easier maintenance\n- Future-proof architecture",
    "issue_type": "Submit a request or incident",
    "priority": "Medium",
    "labels": ["refactoring", "authentication", "security", "technical-debt"]
  }' > /dev/null

# Quality Assurance
echo "🧪 Creating Quality Assurance Tickets..."

curl -s -X POST http://localhost:3000/api/integrations/jira/ticket \
  -H "Content-Type: application/json" \
  -d '{
    "project_key": "COMM",
    "summary": "Performance Testing for Large Datasets",
    "description": "**QA Testing Task**\n\nConduct performance testing to ensure the system can handle large datasets efficiently.\n\n**Test Scenarios:**\n- 10,000+ repository analysis\n- 100+ concurrent users\n- Large file processing\n- Memory usage optimization\n\n**Performance Targets:**\n- Response time < 2 seconds\n- Memory usage < 2GB\n- CPU usage < 80%\n- No memory leaks\n\n**Test Environment:**\n- Production-like setup\n- Load testing tools\n- Monitoring dashboards\n- Performance metrics",
    "issue_type": "Submit a request or incident",
    "priority": "Medium",
    "labels": ["qa", "performance-testing", "load-testing", "optimization"]
  }' > /dev/null

curl -s -X POST http://localhost:3000/api/integrations/jira/ticket \
  -H "Content-Type: application/json" \
  -d '{
    "project_key": "COMM",
    "summary": "Security Penetration Testing",
    "description": "**Security Testing**\n\nConduct comprehensive security penetration testing to identify vulnerabilities.\n\n**Testing Areas:**\n- Authentication bypass\n- SQL injection\n- XSS vulnerabilities\n- API security\n- Data encryption\n\n**Deliverables:**\n- Security assessment report\n- Vulnerability list\n- Risk prioritization\n- Remediation recommendations\n\n**External Vendor:**\n- Certified security firm\n- Industry-standard tools\n- Detailed reporting",
    "issue_type": "Submit a request or incident",
    "priority": "High",
    "labels": ["security", "penetration-testing", "vulnerability", "compliance"]
  }' > /dev/null

# User Experience & Design
echo "🎨 Creating UX/Design Tickets..."

curl -s -X POST http://localhost:3000/api/integrations/jira/ticket \
  -H "Content-Type: application/json" \
  -d '{
    "project_key": "COMM",
    "summary": "Redesign Dashboard Interface",
    "description": "**UX/UI Design Task**\n\nRedesign the main dashboard to improve user experience and visual appeal.\n\n**Design Goals:**\n- Modern, clean interface\n- Better information hierarchy\n- Improved navigation\n- Mobile responsiveness\n\n**User Research:**\n- User interviews conducted\n- Pain points identified\n- Design requirements defined\n- Prototype created\n\n**Design Deliverables:**\n- Wireframes\n- High-fidelity mockups\n- Design system updates\n- Interactive prototypes",
    "issue_type": "Submit a request or incident",
    "priority": "Medium",
    "labels": ["ux", "ui", "design", "dashboard", "user-experience"]
  }' > /dev/null

curl -s -X POST http://localhost:3000/api/integrations/jira/ticket \
  -H "Content-Type: application/json" \
  -d '{
    "project_key": "COMM",
    "summary": "Accessibility Compliance Audit",
    "description": "**Accessibility Task**\n\nConduct accessibility audit and implement WCAG 2.1 AA compliance.\n\n**Compliance Requirements:**\n- WCAG 2.1 AA standards\n- Screen reader compatibility\n- Keyboard navigation\n- Color contrast ratios\n- Alternative text for images\n\n**Testing Tools:**\n- Automated accessibility scanners\n- Manual testing\n- Screen reader testing\n- User testing with disabilities\n\n**Timeline:**\n- Audit: 1 week\n- Implementation: 3 weeks\n- Testing: 1 week",
    "issue_type": "Submit a request or incident",
    "priority": "Medium",
    "labels": ["accessibility", "wcag", "compliance", "inclusive-design"]
  }' > /dev/null

# Infrastructure & DevOps
echo "🏗️ Creating Infrastructure & DevOps Tickets..."

curl -s -X POST http://localhost:3000/api/integrations/jira/ticket \
  -H "Content-Type: application/json" \
  -d '{
    "project_key": "COMM",
    "summary": "Implement Blue-Green Deployment",
    "description": "**DevOps Task**\n\nImplement blue-green deployment strategy to reduce downtime and improve reliability.\n\n**Implementation Plan:**\n- Set up parallel environments\n- Configure load balancer\n- Implement health checks\n- Create rollback procedures\n\n**Benefits:**\n- Zero-downtime deployments\n- Quick rollback capability\n- Reduced deployment risk\n- Better testing environment\n\n**Infrastructure:**\n- AWS/GCP setup\n- Docker containers\n- Kubernetes orchestration\n- CI/CD pipeline integration",
    "issue_type": "Submit a request or incident",
    "priority": "High",
    "labels": ["devops", "deployment", "infrastructure", "zero-downtime"]
  }' > /dev/null

curl -s -X POST http://localhost:3000/api/integrations/jira/ticket \
  -H "Content-Type: application/json" \
  -d '{
    "project_key": "COMM",
    "summary": "Database Performance Optimization",
    "description": "**Infrastructure Task**\n\nOptimize database performance to handle increased load and improve query response times.\n\n**Optimization Areas:**\n- Query optimization\n- Index improvements\n- Connection pooling\n- Caching strategies\n\n**Performance Metrics:**\n- Query response time < 100ms\n- Database CPU usage < 70%\n- Connection pool efficiency\n- Cache hit ratio > 90%\n\n**Tools & Monitoring:**\n- Database profiling tools\n- Performance monitoring\n- Query analysis\n- Real-time metrics",
    "issue_type": "Submit a request or incident",
    "priority": "Medium",
    "labels": ["database", "performance", "optimization", "infrastructure"]
  }' > /dev/null

# Business & Product Management
echo "💼 Creating Business & Product Management Tickets..."

curl -s -X POST http://localhost:3000/api/integrations/jira/ticket \
  -H "Content-Type: application/json" \
  -d '{
    "project_key": "COMM",
    "summary": "Customer Feedback Analysis and Action Plan",
    "description": "**Product Management Task**\n\nAnalyze customer feedback and create action plan for product improvements.\n\n**Feedback Sources:**\n- User surveys (500+ responses)\n- Support tickets analysis\n- User interviews (20+ sessions)\n- App store reviews\n\n**Key Findings:**\n- 78% want better AI accuracy\n- 65% need faster response times\n- 45% want mobile app\n- 32% need better integrations\n\n**Action Plan:**\n- Prioritize AI improvements\n- Optimize performance\n- Plan mobile development\n- Expand integrations\n\n**Success Metrics:**\n- Customer satisfaction score\n- Feature adoption rates\n- Support ticket reduction",
    "issue_type": "Submit a request or incident",
    "priority": "High",
    "labels": ["product-management", "customer-feedback", "user-research", "action-plan"]
  }' > /dev/null

curl -s -X POST http://localhost:3000/api/integrations/jira/ticket \
  -H "Content-Type: application/json" \
  -d '{
    "project_key": "COMM",
    "summary": "Competitive Analysis and Market Positioning",
    "description": "**Business Strategy Task**\n\nConduct competitive analysis and refine market positioning strategy.\n\n**Competitors Analyzed:**\n- GitHub Copilot\n- CodeWhisperer\n- Tabnine\n- Kite\n\n**Analysis Areas:**\n- Feature comparison\n- Pricing analysis\n- Market share\n- User reviews\n- Strengths and weaknesses\n\n**Market Positioning:**\n- Unique value proposition\n- Target market segments\n- Pricing strategy\n- Go-to-market plan\n\n**Deliverables:**\n- Competitive analysis report\n- Market positioning document\n- Strategic recommendations",
    "issue_type": "Submit a request or incident",
    "priority": "Medium",
    "labels": ["business-strategy", "competitive-analysis", "market-research", "positioning"]
  }' > /dev/null

# Team & Process Management
echo "👥 Creating Team & Process Management Tickets..."

curl -s -X POST http://localhost:3000/api/integrations/jira/ticket \
  -H "Content-Type: application/json" \
  -d '{
    "project_key": "COMM",
    "summary": "Team Retrospective and Process Improvement",
    "description": "**Team Management Task**\n\nConduct team retrospective and implement process improvements.\n\n**Retrospective Focus:**\n- Sprint 22 performance review\n- Team collaboration assessment\n- Process bottlenecks identification\n- Communication improvements\n\n**Key Issues Identified:**\n- Code review delays\n- Inconsistent testing practices\n- Communication gaps\n- Documentation gaps\n\n**Improvement Actions:**\n- Implement code review guidelines\n- Standardize testing procedures\n- Improve daily standups\n- Create documentation templates\n\n**Success Metrics:**\n- Sprint velocity improvement\n- Code quality metrics\n- Team satisfaction scores",
    "issue_type": "Submit a request or incident",
    "priority": "Medium",
    "labels": ["team-management", "retrospective", "process-improvement", "agile"]
  }' > /dev/null

curl -s -X POST http://localhost:3000/api/integrations/jira/ticket \
  -H "Content-Type: application/json" \
  -d '{
    "project_key": "COMM",
    "summary": "Knowledge Sharing and Documentation Initiative",
    "description": "**Knowledge Management Task**\n\nEstablish comprehensive knowledge sharing and documentation system.\n\n**Documentation Areas:**\n- Technical architecture\n- API documentation\n- Deployment procedures\n- Troubleshooting guides\n- Best practices\n\n**Knowledge Sharing:**\n- Weekly tech talks\n- Code review sessions\n- Architecture discussions\n- Cross-team training\n\n**Tools & Platforms:**\n- Confluence wiki\n- GitHub documentation\n- Video recordings\n- Interactive tutorials\n\n**Timeline:**\n- Documentation audit: 1 week\n- Content creation: 4 weeks\n- Review and approval: 1 week",
    "issue_type": "Submit a request or incident",
    "priority": "Low",
    "labels": ["knowledge-management", "documentation", "training", "best-practices"]
  }' > /dev/null

echo ""
echo "✅ Project Management Data Created Successfully!"
echo "==============================================="
echo ""
echo "📊 Created Tickets by Category:"
echo "- 2 Project Planning & Roadmap"
echo "- 2 Development Tasks"
echo "- 2 Quality Assurance"
echo "- 2 UX/Design"
echo "- 2 Infrastructure & DevOps"
echo "- 2 Business & Product Management"
echo "- 2 Team & Process Management"
echo ""
echo "🎯 Total: 14 additional project management tickets"
echo ""
echo "🔗 View your tickets at: https://faikbairamov0.atlassian.net/projects/COMM"
echo ""
echo "📈 This data will provide rich project history for AI analysis!"
