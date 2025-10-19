# 🚀 Commet - AI-Powered GitHub Repository Intelligence

**Transform your GitHub repositories into actionable insights with AI-powered analysis, real-time collaboration, and intelligent automation.**

Commet is a comprehensive platform that bridges the gap between your code and actionable insights. Whether you're analyzing repository health, onboarding new team members, or tracking development progress, Commet provides the tools you need to understand and optimize your codebase.

## ✨ Key Features

### 🤖 **AI-Powered Repository Analysis**

- **Intelligent Code Insights**: Ask questions about your repositories and get AI-generated answers
- **Real-time Progress Tracking**: Watch as the AI analyzes your code with beautiful progress indicators
- **Smart Recommendations**: Get suggestions for code improvements, architecture patterns, and best practices
- **Natural Language Queries**: Ask questions like "What's the code quality like?" or "Who are the main contributors?"

### 📊 **Multi-Repository Analytics**

- **Comprehensive Dashboard**: Compare multiple repositories side by side
- **Visual Analytics**: Interactive charts and graphs showing development trends
- **Performance Metrics**: Track commits, contributors, and code quality over time
- **Branch Analysis**: Understand development patterns across different branches

### 🔍 **Advanced Commit Explorer**

- **Detailed Commit History**: Browse commits with full code differences and file changes
- **Code Diff Visualization**: See exactly what changed with syntax-highlighted diffs
- **Contributor Insights**: Track individual and team contributions
- **Commit Statistics**: Analyze additions, deletions, and change patterns
- **📖 Commit Stories**: Transform commit history into engaging narratives with AI-powered storytelling
- **Multiple View Modes**: Switch between detailed list view and story view
- **Story Styles**: Choose from narrative, technical, or casual storytelling approaches

### 👥 **Team Collaboration Tools**

- **Real-time Collaboration**: Share insights and discuss findings with your team
- **User Management**: Track team members and their repository access
- **Activity Monitoring**: See who's working on what and when
- **Shared Resources**: Collaborate on analysis and documentation

### 🔐 **Secure GitHub Integration**

- **OAuth Authentication**: Secure login with your GitHub account
- **Private Repository Support**: Access both public and private repositories
- **Token Management**: Manage GitHub tokens for enhanced API access
- **Permission Control**: Granular access control for team members

### 🎯 **Code Quality Intelligence**

- **Automated Analysis**: AI-powered code quality assessment
- **Security Scanning**: Identify potential security issues and vulnerabilities
- **Best Practice Recommendations**: Get suggestions for improving code quality
- **Technical Debt Tracking**: Monitor and manage technical debt over time

### 🔗 **Jira Integration**

- **Automatic Ticket Creation**: Generate Jira tickets from code analysis
- **Commit Synchronization**: Sync GitHub commits with Jira tickets
- **Worklog Tracking**: Automatic time tracking based on commit activity
- **Status Automation**: Auto-transition tickets based on commit messages
- **Real-time Webhooks**: Handle Jira events in real-time

## 🏗️ Architecture

Commet consists of two main components:

### **Project Structure**

```
commet-web-app/
├── railway.json              # Railway deployment configuration
├── Procfile                  # Process definition for Railway
├── nixpacks.toml            # Nixpacks build configuration
├── Dockerfile               # Docker container configuration
├── env.example              # Environment variables template
├── RAILWAY_DEPLOYMENT.md    # Detailed Railway deployment guide
├── commet-remote-data-server/
│   ├── server.py            # Main Flask application
│   ├── requirements.txt     # Python dependencies
│   ├── ai_service.py        # AI service with commit story generation
│   ├── github_auth.py       # GitHub authentication
│   └── integrations/        # Jira integration
└── commet-web-app-frontend/ # React frontend application
    ├── src/
    │   ├── components/      # React components
    │   │   ├── CommitStoryView.tsx    # Commit story display
    │   │   ├── EnhancedAIChatForm.tsx # Enhanced AI chat
    │   │   └── MultiProjectSelector.tsx # Multi-project selection
    │   ├── pages/           # Page components
    │   ├── services/        # API services
    │   └── types/           # TypeScript type definitions
    └── package.json         # Frontend dependencies
```

### **Frontend (React + TypeScript)**

- Modern, responsive web interface
- Real-time progress indicators
- Beautiful markdown rendering
- Dark/light theme support
- Mobile-friendly design

### **Backend (Python + Flask)**

- RESTful API design
- GitHub API integration
- AI service integration (OpenAI GPT-4o-mini)
- Jira integration support
- Rate limit management
- Comprehensive error handling

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Python 3.9+
- GitHub account
- OpenAI API key (for AI features)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/commet-web-app.git
   cd commet-web-app
   ```

2. **Start the backend server**

   ```bash
   cd commet-remote-data-server
   pip install -r requirements.txt
   cp env_example.txt .env
   # Edit .env with your API keys
   python server.py
   ```

3. **Start the frontend**

   ```bash
   cd commet-web-app-frontend
   npm install
   npm run dev
   ```

4. **Access the application**
   - Frontend: `http://localhost:5174`
   - Backend API: `http://localhost:3000`

## 🚀 Railway Deployment

Commet is ready for production deployment on Railway! 

### Quick Deploy to Railway

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/your-template-id)

### Manual Railway Setup

1. **Connect to Railway**
   - Go to [railway.app](https://railway.app) and sign in
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository

2. **Set Environment Variables**
   ```bash
   FLASK_SECRET_KEY=your-secret-key-here
   GITHUB_CLIENT_ID=your-github-client-id
   GITHUB_CLIENT_SECRET=your-github-client-secret
   OPENAI_API_KEY=your-openai-api-key
   FRONTEND_URL=https://your-frontend-domain.com
   ```

3. **Configure GitHub OAuth**
   - Update callback URL to: `https://your-railway-app.up.railway.app/auth/callback`

4. **Deploy**
   - Railway automatically detects the Python project
   - Uses `requirements.txt` and `railway.json` for configuration
   - Health checks at `/health` endpoint

📖 **Detailed deployment guide**: See [RAILWAY_DEPLOYMENT.md](RAILWAY_DEPLOYMENT.md)

## 📱 Core Pages & Features

### **🏠 Dashboard**

- Overview of all your repositories
- Quick access to key features
- Recent activity and insights
- Team collaboration status

### **📊 Repository Analysis**

- Multi-repository comparison
- Comprehensive statistics
- Language distribution
- Contributor analysis
- Development trends

### **🔍 Commit Explorer**

- Detailed commit history
- Code diff visualization
- File change tracking
- Author and committer insights
- Branch-specific analysis
- **📖 AI-Powered Commit Stories**: Transform commit history into engaging narratives
- **Multiple View Modes**: List view and story view options
- **Story Customization**: Choose from narrative, technical, or casual styles

### **🤖 AI Chat**

- Natural language repository queries
- Real-time analysis progress
- Beautiful markdown responses
- Smart recommendations
- Code quality insights

### **👥 Team Management**

- User analytics and insights
- Contribution tracking
- Activity monitoring
- Collaboration tools
- Permission management

### **📈 Analytics Dashboard**

- Visual charts and graphs
- Development trends
- Performance metrics
- Custom date ranges
- Export capabilities

### **🛡️ Code Quality**

- Automated quality assessment
- Security vulnerability scanning
- Best practice recommendations
- Technical debt analysis
- Improvement suggestions

### **🤝 Collaboration Hub**

- Team discussions
- Shared analysis
- Real-time updates
- Resource sharing
- Project coordination

## 🔧 Configuration

### Environment Variables

**Backend (.env)**

```bash
# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here

# GitHub Configuration
GITHUB_TOKEN=your_github_token_here
GITHUB_CLIENT_ID=your_github_oauth_client_id
GITHUB_CLIENT_SECRET=your_github_oauth_client_secret

# Jira Integration (Optional)
JIRA_URL=https://your-domain.atlassian.net
JIRA_EMAIL=your-email@company.com
JIRA_API_TOKEN=your_jira_api_token
JIRA_PROJECT_KEY=YOUR_PROJECT_KEY

# Server Configuration
SERVER_PORT=3000
DEBUG_MODE=true
```

**Frontend (.env.local)**

```bash
VITE_API_BASE_URL=http://localhost:3000
VITE_APP_NAME=Commet
```

## 🎯 Use Cases

### **For Development Teams**

- **Code Review**: Analyze pull requests and commits for quality
- **Onboarding**: Help new team members understand the codebase
- **Technical Debt**: Track and manage technical debt over time
- **Performance**: Monitor development velocity and patterns

### **For Project Managers**

- **Progress Tracking**: Monitor development progress and milestones
- **Resource Planning**: Understand team capacity and workload
- **Quality Assurance**: Ensure code quality standards are met
- **Reporting**: Generate insights for stakeholders

### **For Individual Developers**

- **Code Understanding**: Quickly understand unfamiliar codebases
- **Best Practices**: Get AI-powered suggestions for improvements
- **Documentation**: Generate and maintain project documentation
- **Learning**: Understand patterns and practices from other projects

## 🔌 Integrations

### **GitHub**

- Full repository access (public and private)
- OAuth authentication
- Webhook support
- Rate limit management

### **Jira**

- Automatic ticket creation
- Commit synchronization
- Worklog tracking
- Status automation
- Real-time webhooks

### **OpenAI**

- GPT-4o-mini integration
- Natural language processing
- Code analysis and insights
- Intelligent recommendations

## 📊 API Endpoints

### **Repository Data**

- `GET /api/git/repo` - Repository information
- `GET /api/git/commits` - Commit history
- `GET /api/git/commit-details` - Detailed commit analysis
- `GET /api/git/branches` - Repository branches

### **AI Analysis**

- `POST /api/chat` - AI-powered repository analysis
- `POST /api/chat/multi-project` - Multi-repository analysis
- `POST /api/git/commits/story` - Generate commit stories
- Real-time progress tracking
- Structured responses
- Error handling

### **Jira Integration**

- `GET /api/integrations/jira/status` - Integration status
- `POST /api/integrations/jira/test` - Connection test
- `POST /api/integrations/jira/sync-commit` - Commit sync
- `POST /webhooks/jira` - Webhook handler

## 🛠️ Development

### **Tech Stack**

- **Frontend**: React 18, TypeScript, Tailwind CSS, Vite
- **Backend**: Python 3.9+, Flask, PyGithub
- **AI**: OpenAI GPT-4o-mini
- **Database**: In-memory (extensible to PostgreSQL/MongoDB)
- **Authentication**: GitHub OAuth

### **Contributing**

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

### **Code Style**

- Frontend: ESLint + Prettier
- Backend: PEP 8 Python style
- TypeScript: Strict mode enabled
- React: Functional components with hooks

## 📈 Performance

- **Fast API Responses**: Optimized GitHub API calls
- **Efficient Caching**: Intelligent data caching
- **Rate Limit Management**: Smart handling of API limits
- **Real-time Updates**: WebSocket support for live data
- **Mobile Optimized**: Responsive design for all devices

## 🔒 Security

- **OAuth Authentication**: Secure GitHub integration
- **Token Management**: Secure API key handling
- **Rate Limiting**: Protection against abuse
- **Input Validation**: Comprehensive parameter validation
- **Error Handling**: Secure error messages

## 📚 Documentation

- **API Documentation**: Comprehensive endpoint documentation
- **Integration Guides**: Step-by-step setup instructions
- **User Manual**: Feature explanations and tutorials
- **Developer Guide**: Technical implementation details

## 🆘 Support

- **GitHub Issues**: Report bugs and request features
- **Documentation**: Comprehensive guides and tutorials
- **Community**: Join discussions and get help
- **Email Support**: Direct support for enterprise users

## 🚀 Roadmap

### **Upcoming Features**

- **VS Code Extension**: Native IDE integration
- **Slack Integration**: Team notifications and updates
- **Advanced Analytics**: Machine learning insights
- **Custom Dashboards**: Personalized analytics views
- **API Rate Optimization**: Enhanced performance
- **Multi-language Support**: Internationalization
- **Enhanced Story Features**: More storytelling styles and customization options
- **Story Export**: Export commit stories to various formats

### **Enterprise Features**

- **SSO Integration**: Single sign-on support
- **Advanced Security**: Enterprise-grade security features
- **Custom Integrations**: API for custom integrations
- **Priority Support**: Dedicated support team
- **On-premise Deployment**: Self-hosted options

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details on how to get started.

## 🙏 Acknowledgments

- **GitHub** for providing the amazing API
- **OpenAI** for the powerful AI capabilities
- **React** and **Python** communities for the excellent tools
- **All contributors** who help make Commet better

---

**Built with ❤️ for the developer community**

_Transform your GitHub repositories into actionable insights with Commet - the AI-powered platform that makes code analysis simple, intelligent, and collaborative._
