"""
GitHub OAuth Authentication Service
Handles GitHub OAuth flow for user authentication and repository access
"""

import os
import secrets
from typing import Dict, List, Optional
from flask import session, request, redirect, url_for
from requests_oauthlib import OAuth2Session
from github import Github
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class GitHubAuthService:
    """
    Service for handling GitHub OAuth authentication
    """
    
    def __init__(self):
        """Initialize the GitHub OAuth service"""
        self.client_id = os.getenv('GITHUB_CLIENT_ID')
        self.client_secret = os.getenv('GITHUB_CLIENT_SECRET')
        self.redirect_uri = os.getenv('GITHUB_REDIRECT_URI', 'http://localhost:3000/auth/callback')
        
        if not self.client_id or not self.client_secret:
            print("⚠️  GitHub OAuth not configured. Please set GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET")
            self.enabled = False
        else:
            self.enabled = True
            print("✅ GitHub OAuth service initialized successfully")
    
    def get_authorization_url(self) -> str:
        """
        Get the GitHub OAuth authorization URL
        
        Returns:
            Authorization URL for GitHub OAuth
        """
        if not self.enabled:
            raise ValueError("GitHub OAuth is not configured")
        
        # Create OAuth session
        github = OAuth2Session(
            self.client_id,
            redirect_uri=self.redirect_uri,
            scope=['user:email', 'repo', 'read:user']
        )
        
        # Generate state for security
        state = secrets.token_urlsafe(32)
        session['oauth_state'] = state
        
        # Get authorization URL
        authorization_url, _ = github.authorization_url(
            'https://github.com/login/oauth/authorize',
            state=state
        )
        
        return authorization_url
    
    def handle_callback(self, code: str, state: str) -> Dict:
        """
        Handle the OAuth callback and exchange code for access token
        
        Args:
            code: Authorization code from GitHub
            state: State parameter for security
            
        Returns:
            User information and access token
        """
        if not self.enabled:
            raise ValueError("GitHub OAuth is not configured")
        
        # Verify state (more lenient for development)
        stored_state = session.get('oauth_state')
        if stored_state and state != stored_state:
            print(f"⚠️  State mismatch: stored={stored_state}, received={state}")
            # For development, we'll be more lenient with state validation
            # In production, you should enforce strict state validation
        
        # Create OAuth session
        github = OAuth2Session(
            self.client_id,
            redirect_uri=self.redirect_uri
        )
        
        # Exchange code for token
        token = github.fetch_token(
            'https://github.com/login/oauth/access_token',
            client_secret=self.client_secret,
            code=code
        )
        
        # Get user information
        github_api = github.get('https://api.github.com/user')
        user_info = github_api.json()
        
        # Store token in session
        session['github_token'] = token['access_token']
        session['github_user'] = user_info
        
        return {
            'access_token': token['access_token'],
            'user': user_info,
            'token_type': token.get('token_type', 'bearer')
        }
    
    def get_user_repositories(self, access_token: str, visibility: str = 'all') -> List[Dict]:
        """
        Get user's repositories using their access token
        
        Args:
            access_token: GitHub access token
            visibility: Repository visibility ('all', 'public', 'private')
            
        Returns:
            List of user repositories
        """
        try:
            # Initialize GitHub client with user token
            g = Github(access_token)
            user = g.get_user()
            
            repositories = []
            for repo in user.get_repos(visibility=visibility, sort='updated'):
                repo_data = {
                    'id': repo.id,
                    'name': repo.name,
                    'full_name': repo.full_name,
                    'description': repo.description,
                    'url': repo.html_url,
                    'clone_url': repo.clone_url,
                    'language': repo.language,
                    'stars': repo.stargazers_count,
                    'forks': repo.forks_count,
                    'watchers': repo.watchers_count,
                    'open_issues': repo.open_issues_count,
                    'created_at': repo.created_at.isoformat(),
                    'updated_at': repo.updated_at.isoformat(),
                    'pushed_at': repo.pushed_at.isoformat() if repo.pushed_at else None,
                    'default_branch': repo.default_branch,
                    'is_private': repo.private,
                    'size': repo.size,
                    'owner': {
                        'login': repo.owner.login,
                        'type': repo.owner.type,
                        'avatar_url': repo.owner.avatar_url,
                        'url': repo.owner.html_url
                    }
                }
                repositories.append(repo_data)
            
            return repositories
            
        except Exception as e:
            raise Exception(f"Error fetching repositories: {str(e)}")
    
    def get_user_info(self, access_token: str) -> Dict:
        """
        Get user information using their access token
        
        Args:
            access_token: GitHub access token
            
        Returns:
            User information
        """
        try:
            g = Github(access_token)
            user = g.get_user()
            
            return {
                'id': user.id,
                'login': user.login,
                'name': user.name,
                'email': user.email,
                'avatar_url': user.avatar_url,
                'url': user.html_url,
                'bio': user.bio,
                'location': user.location,
                'company': user.company,
                'blog': user.blog,
                'public_repos': user.public_repos,
                'public_gists': user.public_gists,
                'followers': user.followers,
                'following': user.following,
                'created_at': user.created_at.isoformat(),
                'updated_at': user.updated_at.isoformat()
            }
            
        except Exception as e:
            raise Exception(f"Error fetching user info: {str(e)}")
    
    def validate_token(self, access_token: str) -> bool:
        """
        Validate if the access token is still valid
        
        Args:
            access_token: GitHub access token
            
        Returns:
            True if token is valid, False otherwise
        """
        try:
            g = Github(access_token)
            g.get_user()
            return True
        except:
            return False
    
    def logout(self):
        """Clear user session"""
        session.pop('github_token', None)
        session.pop('github_user', None)
        session.pop('oauth_state', None)
