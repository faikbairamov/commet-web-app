#!/usr/bin/env python3
"""
Test script to check Jira project configuration
"""

import os
import sys
from dotenv import load_dotenv

# Add the current directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from integrations.project_management.jira import JiraIntegration

def test_jira_project():
    """Test Jira project configuration"""
    
    # Load environment variables
    load_dotenv()
    
    jira_url = os.getenv('JIRA_URL')
    jira_email = os.getenv('JIRA_EMAIL')
    jira_token = os.getenv('JIRA_API_TOKEN')
    jira_project = os.getenv('JIRA_PROJECT_KEY')
    
    if not all([jira_url, jira_email, jira_token, jira_project]):
        print("❌ Jira configuration incomplete!")
        return False
    
    print(f"🔧 Testing Jira Project: {jira_project}")
    print(f"URL: {jira_url}")
    print(f"Email: {jira_email}")
    print()
    
    try:
        # Initialize Jira integration
        config = {
            'base_url': jira_url,
            'email': jira_email,
            'api_token': jira_token,
            'project_key': jira_project,
            'enabled': True
        }
        
        jira = JiraIntegration(config)
        
        # Test connection
        print("1️⃣ Testing connection...")
        if not jira.test_connection():
            print("❌ Connection failed!")
            return False
        print("✅ Connection successful!")
        print()
        
        # Get project issue types
        print("2️⃣ Getting project issue types...")
        issue_types = jira.get_project_issue_types(jira_project)
        
        if issue_types:
            print(f"✅ Found {len(issue_types)} issue types:")
            for issue_type in issue_types:
                name = issue_type.get('name', 'Unknown')
                description = issue_type.get('description', 'No description')
                print(f"   - {name}: {description}")
        else:
            print("❌ No issue types found!")
            return False
        print()
        
        # Get default issue type
        print("3️⃣ Getting default issue type...")
        default_type = jira.get_default_issue_type(jira_project)
        print(f"✅ Default issue type: {default_type}")
        print()
        
        # Test ticket creation with correct issue type
        print("4️⃣ Testing ticket creation...")
        test_ticket = {
            'project_key': jira_project,
            'summary': 'Commet Integration Test Ticket',
            'description': 'This is a test ticket created by Commet integration.',
            'priority': 'Low',
            'labels': ['commet-test', 'integration']
        }
        
        if jira.create_ticket(test_ticket):
            print("✅ Test ticket created successfully!")
        else:
            print("❌ Failed to create test ticket!")
            return False
        print()
        
        # Test search
        print("5️⃣ Testing ticket search...")
        jql = f"project = {jira_project} AND labels = commet-test"
        tickets = jira.search_tickets(jql, max_results=5)
        print(f"✅ Found {len(tickets)} tickets with 'commet-test' label")
        
        for ticket in tickets[:3]:  # Show first 3
            key = ticket.get('key', 'Unknown')
            summary = ticket.get('fields', {}).get('summary', 'No summary')
            print(f"   - {key}: {summary}")
        print()
        
        print("🎉 All tests passed! Your Jira project is properly configured.")
        return True
        
    except Exception as e:
        print(f"❌ Error during testing: {str(e)}")
        return False

if __name__ == "__main__":
    test_jira_project()
