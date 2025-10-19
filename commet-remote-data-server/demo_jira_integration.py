#!/usr/bin/env python3
"""
Demo script showing Jira integration functionality
This script demonstrates how the integration works without requiring real credentials
"""

import os
import sys
import json
from datetime import datetime

# Add the current directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from integrations.project_management.jira import JiraIntegration

def demo_jira_integration():
    """Demonstrate Jira integration functionality"""
    
    print("🎭 Jira Integration Demo")
    print("=" * 50)
    print("This demo shows how the Jira integration works without requiring real credentials.")
    print()
    
    # Demo configuration (using example values)
    demo_config = {
        'base_url': 'https://demo.atlassian.net',
        'email': 'demo@example.com',
        'api_token': 'demo_token_12345',
        'project_key': 'DEMO',
        'enabled': True
    }
    
    print("📋 Demo Configuration:")
    print(f"   URL: {demo_config['base_url']}")
    print(f"   Email: {demo_config['email']}")
    print(f"   Project: {demo_config['project_key']}")
    print()
    
    try:
        # Initialize Jira integration
        jira = JiraIntegration(demo_config)
        print("✅ Jira integration initialized successfully!")
        print()
        
        # Demo 1: Extract ticket keys from commit messages
        print("1️⃣ Ticket Key Extraction Demo:")
        test_messages = [
            "PROJ-123: Fix authentication bug",
            "PROJ-456 Add user validation",
            "Update documentation",
            "PROJ-789: Implement new feature",
            "PROJ-999: WIP - working on performance optimization"
        ]
        
        for message in test_messages:
            ticket_key = jira.extract_ticket_key(message)
            print(f"   '{message}' → {ticket_key or 'No ticket key'}")
        print()
        
        # Demo 2: Time estimation
        print("2️⃣ Time Estimation Demo:")
        test_commits = [
            {"stats": {"total": 5}},      # Small change
            {"stats": {"total": 25}},     # Medium change
            {"stats": {"total": 100}},    # Large change
            {"stats": {"total": 0}},      # No changes
        ]
        
        for i, commit in enumerate(test_commits, 1):
            time_spent = jira._estimate_time_spent(commit)
            print(f"   Commit {i} ({commit['stats']['total']} lines) → {time_spent}")
        print()
        
        # Demo 3: Priority mapping
        print("3️⃣ Priority Mapping Demo:")
        severities = ['critical', 'high', 'medium', 'low', 'info']
        for severity in severities:
            priority = jira._map_severity_to_priority(severity)
            print(f"   Severity '{severity}' → Priority '{priority}'")
        print()
        
        # Demo 4: Quality issue formatting
        print("4️⃣ Quality Issue Formatting Demo:")
        sample_analysis = {
            "title": "SQL Injection Vulnerability",
            "severity": "high",
            "file_path": "src/auth/user.py",
            "line_number": 45,
            "description": "Direct string concatenation in SQL query",
            "recommendation": "Use parameterized queries",
            "code_snippet": "query = f\"SELECT * FROM users WHERE id = {user_id}\"",
            "quality_score": 65,
            "category": "security"
        }
        
        formatted_description = jira._format_quality_issue_description(sample_analysis)
        print("   Sample quality issue description:")
        print("   " + "=" * 40)
        for line in formatted_description.split('\n')[:10]:  # Show first 10 lines
            print(f"   {line}")
        print("   " + "=" * 40)
        print()
        
        # Demo 5: Auto-transition logic
        print("5️⃣ Auto-Transition Logic Demo:")
        test_commits = [
            {"message": "PROJ-123: Fix authentication bug"},
            {"message": "PROJ-456: WIP - working on validation"},
            {"message": "PROJ-789: Start implementing new feature"},
            {"message": "PROJ-999: Resolve performance issue"},
            {"message": "PROJ-111: Close security vulnerability"},
        ]
        
        for commit in test_commits:
            message = commit['message']
            if any(keyword in message.lower() for keyword in ['fix', 'resolve', 'close']):
                action = "→ Transition to 'Done'"
            elif any(keyword in message.lower() for keyword in ['wip', 'work in progress']):
                action = "→ Transition to 'In Progress'"
            elif any(keyword in message.lower() for keyword in ['start', 'begin']):
                action = "→ Transition to 'In Progress'"
            else:
                action = "→ No auto-transition"
            
            print(f"   '{message}' {action}")
        print()
        
        # Demo 6: API endpoint examples
        print("6️⃣ API Endpoint Examples:")
        endpoints = [
            ("GET", "/api/integrations/jira/status", "Get integration status"),
            ("POST", "/api/integrations/jira/test", "Test connection"),
            ("POST", "/api/integrations/jira/ticket", "Create ticket"),
            ("GET", "/api/integrations/jira/ticket/PROJ-123", "Get ticket"),
            ("PUT", "/api/integrations/jira/ticket/PROJ-123", "Update ticket"),
            ("POST", "/api/integrations/jira/ticket/PROJ-123/worklog", "Add worklog"),
            ("POST", "/api/integrations/jira/ticket/PROJ-123/transition", "Transition ticket"),
            ("POST", "/api/integrations/jira/sync-commit", "Sync commit"),
            ("POST", "/api/integrations/jira/quality-ticket", "Create quality ticket"),
            ("POST", "/api/integrations/jira/search", "Search tickets"),
            ("POST", "/webhooks/jira", "Handle webhooks"),
        ]
        
        for method, endpoint, description in endpoints:
            print(f"   {method:4} {endpoint:<50} - {description}")
        print()
        
        print("🎉 Demo completed successfully!")
        print()
        print("💡 To use with real Jira instance:")
        print("   1. Set up your .env file with real credentials")
        print("   2. Run: python test_jira_integration.py")
        print("   3. Start the server: python server.py")
        print("   4. Configure Jira webhook to point to your server")
        
        return True
        
    except Exception as e:
        print(f"❌ Error during demo: {str(e)}")
        return False

def show_integration_benefits():
    """Show the benefits of the Jira integration"""
    
    print("\n" + "=" * 50)
    print("🚀 Integration Benefits")
    print("=" * 50)
    
    benefits = [
        {
            "title": "Automatic Commit Sync",
            "description": "Every commit with ticket reference automatically updates Jira",
            "example": "git commit -m 'PROJ-123: Fix bug' → Jira ticket updated"
        },
        {
            "title": "Time Tracking",
            "description": "Automatic worklog entries based on actual coding time",
            "example": "15 lines changed → 1.5m worklog entry added"
        },
        {
            "title": "Status Automation",
            "description": "Tickets auto-transition based on commit messages",
            "example": "'Fix bug' → Status: Done, 'WIP' → Status: In Progress"
        },
        {
            "title": "Quality Issue Tracking",
            "description": "Code analysis issues automatically become Jira tickets",
            "example": "Security vulnerability found → High priority ticket created"
        },
        {
            "title": "Real-time Updates",
            "description": "Webhook integration for live project updates",
            "example": "Jira ticket updated → Team notified instantly"
        },
        {
            "title": "Complete Traceability",
            "description": "Every code change linked to business requirements",
            "example": "Commit → Ticket → User Story → Epic"
        }
    ]
    
    for i, benefit in enumerate(benefits, 1):
        print(f"\n{i}. {benefit['title']}")
        print(f"   {benefit['description']}")
        print(f"   Example: {benefit['example']}")

def main():
    """Main demo function"""
    success = demo_jira_integration()
    
    if success:
        show_integration_benefits()
    
    print("\n" + "=" * 50)
    print("📚 Documentation")
    print("=" * 50)
    print("• JIRA_INTEGRATION.md - Complete setup guide")
    print("• INTEGRATION_SUMMARY.md - Feature overview")
    print("• test_jira_integration.py - Test with real credentials")
    print("• server.py - API endpoints and webhook handlers")

if __name__ == "__main__":
    main()
