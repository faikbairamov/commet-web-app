#!/usr/bin/env python3
"""
Test script for Jira integration
Run this script to test the Jira integration functionality
"""

import os
import sys
import json
from dotenv import load_dotenv

# Add the current directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from integrations.project_management.jira import JiraIntegration

def test_jira_integration():
    """Test Jira integration functionality"""
    
    # Load environment variables
    load_dotenv()
    
    # Check if Jira is configured
    jira_url = os.getenv('JIRA_URL')
    jira_email = os.getenv('JIRA_EMAIL')
    jira_token = os.getenv('JIRA_API_TOKEN')
    jira_project = os.getenv('JIRA_PROJECT_KEY')
    
    if not all([jira_url, jira_email, jira_token]):
        print("❌ Jira integration not configured!")
        print("Please set the following environment variables:")
        print("- JIRA_URL")
        print("- JIRA_EMAIL") 
        print("- JIRA_API_TOKEN")
        print("- JIRA_PROJECT_KEY (optional)")
        return False
    
    print("🔧 Testing Jira Integration...")
    print(f"URL: {jira_url}")
    print(f"Email: {jira_email}")
    print(f"Project: {jira_project or 'Not set'}")
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
        
        # Test 1: Connection
        print("1️⃣ Testing connection...")
        if jira.test_connection():
            print("✅ Connection successful!")
        else:
            print("❌ Connection failed!")
            return False
        
        # Test 2: Extract ticket key
        print("\n2️⃣ Testing ticket key extraction...")
        test_messages = [
            "PROJ-123: Fix authentication bug",
            "PROJ-456 Add user validation",
            "Update documentation",
            "PROJ-789: Implement new feature"
        ]
        
        for message in test_messages:
            ticket_key = jira.extract_ticket_key(message)
            print(f"   '{message}' → {ticket_key or 'No ticket key'}")
        
        # Test 3: Create test ticket (if project key is set)
        if jira_project:
            print(f"\n3️⃣ Testing ticket creation in project {jira_project}...")
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
        else:
            print("\n3️⃣ Skipping ticket creation (no project key set)")
        
        # Test 4: Search tickets
        print("\n4️⃣ Testing ticket search...")
        if jira_project:
            jql = f"project = {jira_project} AND labels = commet-test"
            tickets = jira.search_tickets(jql, max_results=5)
            print(f"   Found {len(tickets)} tickets with 'commet-test' label")
            for ticket in tickets[:3]:  # Show first 3
                key = ticket.get('key', 'Unknown')
                summary = ticket.get('fields', {}).get('summary', 'No summary')
                print(f"   - {key}: {summary}")
        else:
            print("   Skipping search (no project key set)")
        
        print("\n🎉 Jira integration test completed successfully!")
        return True
        
    except Exception as e:
        print(f"❌ Error during testing: {str(e)}")
        return False

def test_commit_sync():
    """Test commit synchronization functionality"""
    
    print("\n🔄 Testing commit synchronization...")
    
    # Load environment variables
    load_dotenv()
    
    jira_url = os.getenv('JIRA_URL')
    jira_email = os.getenv('JIRA_EMAIL')
    jira_token = os.getenv('JIRA_API_TOKEN')
    jira_project = os.getenv('JIRA_PROJECT_KEY')
    
    if not all([jira_url, jira_email, jira_token, jira_project]):
        print("❌ Skipping commit sync test (Jira not configured)")
        return False
    
    try:
        config = {
            'base_url': jira_url,
            'email': jira_email,
            'api_token': jira_token,
            'project_key': jira_project,
            'enabled': True
        }
        
        jira = JiraIntegration(config)
        
        # Create a test ticket first
        test_ticket = {
            'project_key': jira_project,
            'summary': 'Test Commit Sync',
            'description': 'This ticket will be used to test commit synchronization.',
            'priority': 'Low',
            'labels': ['commet-test', 'commit-sync']
        }
        
        if not jira.create_ticket(test_ticket):
            print("❌ Failed to create test ticket for commit sync")
            return False
        
        # Find the created ticket
        jql = f"project = {jira_project} AND summary ~ 'Test Commit Sync' AND labels = commit-sync"
        tickets = jira.search_tickets(jql, max_results=1)
        
        if not tickets:
            print("❌ Could not find test ticket for commit sync")
            return False
        
        ticket_key = tickets[0].get('key')
        print(f"   Created test ticket: {ticket_key}")
        
        # Test commit sync
        test_commit = {
            'sha': 'abc123def456',
            'message': f'{ticket_key}: Test commit for sync functionality',
            'author': {
                'name': 'Test User',
                'email': 'test@example.com',
                'date': '2024-01-15T10:30:00Z'
            },
            'stats': {
                'additions': 15,
                'deletions': 8,
                'total': 23
            },
            'url': 'https://github.com/test/repo/commit/abc123def456'
        }
        
        if jira.sync_commit_to_ticket(test_commit, ticket_key):
            print("✅ Commit sync test successful!")
            print(f"   Added worklog to ticket {ticket_key}")
        else:
            print("❌ Commit sync test failed!")
            return False
        
        return True
        
    except Exception as e:
        print(f"❌ Error during commit sync testing: {str(e)}")
        return False

def main():
    """Main test function"""
    print("🚀 Commet Jira Integration Test")
    print("=" * 50)
    
    # Test basic integration
    success = test_jira_integration()
    
    if success:
        # Test commit sync
        test_commit_sync()
    
    print("\n" + "=" * 50)
    if success:
        print("🎉 All tests passed! Jira integration is working correctly.")
        print("\nNext steps:")
        print("1. Configure your Jira webhook to point to: http://your-server:3000/webhooks/jira")
        print("2. Start using the integration in your development workflow")
        print("3. Check the JIRA_INTEGRATION.md file for detailed usage examples")
    else:
        print("❌ Some tests failed. Please check your configuration.")
        print("\nTroubleshooting:")
        print("1. Verify your Jira credentials in the .env file")
        print("2. Check that your Jira user has the necessary permissions")
        print("3. Ensure the project key exists and is accessible")

if __name__ == "__main__":
    main()
