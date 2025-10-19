# Railway Deployment Guide

This guide will help you deploy the Commet Web App to Railway.

## Prerequisites

1. A Railway account (sign up at [railway.app](https://railway.app))
2. GitHub repository with your code
3. Required API keys and credentials

## Required Environment Variables

Set these environment variables in your Railway project:

### Required Variables

```bash
# Flask Configuration
FLASK_SECRET_KEY=your-secret-key-here
FLASK_ENV=production

# GitHub OAuth Configuration
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# OpenAI Configuration
OPENAI_API_KEY=your-openai-api-key
```

### Optional Variables

```bash
# Jira Integration (Optional)
JIRA_URL=https://your-domain.atlassian.net
JIRA_EMAIL=your-email@domain.com
JIRA_API_TOKEN=your-jira-api-token
JIRA_PROJECT_KEY=YOUR_PROJECT_KEY
JIRA_AUTO_CREATE_TICKETS=true

# Frontend URL (for CORS)
FRONTEND_URL=https://your-frontend-domain.com
```

### Railway Auto-Set Variables

Railway automatically sets these variables:

- `PORT` - The port your app should listen on

## Deployment Steps

### 1. Connect to Railway

1. Go to [railway.app](https://railway.app) and sign in
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your repository

### 2. Configure Environment Variables

1. In your Railway project dashboard, go to "Variables"
2. Add all the required environment variables listed above
3. Make sure to use strong, unique values for production

### 3. Deploy

1. Railway will automatically detect the Python project
2. It will use the `requirements.txt` file to install dependencies
3. The app will start using the `Procfile` or `railway.json` configuration

### 4. Configure GitHub OAuth

1. Go to your GitHub repository settings
2. Navigate to "Developer settings" > "OAuth Apps"
3. Create a new OAuth App or edit existing one
4. Set the Authorization callback URL to:
   ```
   https://your-railway-app-url.up.railway.app/auth/callback
   ```
5. Update the `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` in Railway

### 5. Configure Frontend (if deploying separately)

If you're deploying the frontend separately:

1. Update the frontend's API base URL to your Railway backend URL
2. Set the `FRONTEND_URL` environment variable in Railway to your frontend URL
3. Ensure CORS is properly configured

## Project Structure

```
commet-web-app/
├── railway.json              # Railway configuration
├── Procfile                  # Process definition
├── env.example              # Environment variables template
├── commet-remote-data-server/
│   ├── server.py            # Main Flask application
│   ├── requirements.txt     # Python dependencies
│   ├── ai_service.py        # AI service
│   ├── github_auth.py       # GitHub authentication
│   └── integrations/        # Jira integration
└── commet-web-app-frontend/ # Frontend React app
```

## Health Check

Railway will automatically check the health of your app using:

- **Health Check Path**: `/health`
- **Health Check Timeout**: 100 seconds

## Monitoring

1. Check the Railway dashboard for deployment logs
2. Monitor the `/health` endpoint for application status
3. Use Railway's built-in metrics and logging

## Troubleshooting

### Common Issues

1. **Port Issues**: Make sure your app listens on the `PORT` environment variable
2. **CORS Issues**: Verify `FRONTEND_URL` is set correctly
3. **Environment Variables**: Double-check all required variables are set
4. **Dependencies**: Ensure `requirements.txt` includes all necessary packages

### Logs

View logs in the Railway dashboard:

1. Go to your project
2. Click on the service
3. View the "Deployments" tab for build logs
4. View the "Logs" tab for runtime logs

## Security Notes

1. Use strong, unique values for `FLASK_SECRET_KEY`
2. Never commit API keys to your repository
3. Use Railway's environment variables for all sensitive data
4. Regularly rotate your API keys and secrets

## Scaling

Railway automatically handles:

- Load balancing
- SSL certificates
- Domain management
- Auto-scaling based on traffic

## Support

- Railway Documentation: [docs.railway.app](https://docs.railway.app)
- Railway Discord: [discord.gg/railway](https://discord.gg/railway)
- Project Issues: Create an issue in your GitHub repository
