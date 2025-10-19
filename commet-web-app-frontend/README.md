# Commet Frontend

A powerful React frontend for accessing GitHub repository data without local cloning. Built with React, TypeScript, and Tailwind CSS.

## 🚀 Features

- **Real-time Repository Analysis**: Get comprehensive repository information and metadata
- **Commit History Browser**: View commit history with detailed code differences
- **GitHub Token Management**: Secure authentication for private repositories
- **Modern UI**: Beautiful, responsive interface built with Tailwind CSS
- **TypeScript**: Full type safety and excellent developer experience
- **Dark Mode**: Built-in dark/light theme support

## 🛠️ Tech Stack

- **React 18** - Modern React with hooks and functional components
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Axios** - HTTP client for API requests
- **Heroicons** - Beautiful SVG icons
- **React Syntax Highlighter** - Code syntax highlighting

## 📦 Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd commet-web-app-frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` and configure:

   ```env
   VITE_API_BASE_URL=http://localhost:3000
   ```

4. **Start the development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file in the root directory:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:3000

# Development Configuration
VITE_APP_NAME=Commet Frontend
VITE_APP_VERSION=1.0.0
```

### GitHub Token Setup

1. Go to GitHub Settings → Developer settings → Personal access tokens
2. Click "Generate new token (classic)"
3. Select scopes: `repo` (for private repos) or `public_repo` (for public repos)
4. Copy the generated token
5. In the app, go to Settings and add your token

## 📱 Usage

### Repository Analysis

1. Navigate to the Repository page
2. Enter a repository in the format `owner/repo` (e.g., `microsoft/vscode`)
3. Optionally specify a branch and commit limit
4. Click "Analyze Repository" to view detailed information

### Commit History

1. Go to the Commits page
2. Enter repository details
3. Toggle "Show Code Differences" for detailed file changes
4. Use filters and sorting options to find specific commits

### Settings

1. Add your GitHub token for private repository access
2. Configure default settings (branch, commit limit, theme)
3. Enable auto-refresh for real-time updates

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── RepositoryCard.tsx
│   ├── CommitCard.tsx
│   ├── FileChangeCard.tsx
│   ├── RepositoryForm.tsx
│   ├── TokenForm.tsx
│   ├── LoadingSpinner.tsx
│   └── ErrorMessage.tsx
├── pages/              # Page components
│   ├── HomePage.tsx
│   ├── RepositoryPage.tsx
│   ├── CommitsPage.tsx
│   ├── SettingsPage.tsx
│   └── NotFoundPage.tsx
├── contexts/           # React contexts
│   └── AppContext.tsx
├── hooks/              # Custom hooks
│   ├── useApi.ts
│   └── useLocalStorage.ts
├── services/           # API services
│   └── api.ts
├── types/              # TypeScript type definitions
│   └── index.ts
├── utils/              # Utility functions
│   └── index.ts
├── App.tsx             # Main app component
├── main.tsx            # App entry point
└── index.css           # Global styles
```

## 🎨 Styling

The app uses Tailwind CSS for styling with a custom design system:

- **Primary Colors**: Blue-based color palette
- **Dark Mode**: Automatic dark/light theme switching
- **Responsive Design**: Mobile-first approach
- **Custom Components**: Reusable styled components

## 🔌 API Integration

The frontend connects to the Commet Remote Data Server backend:

- **Base URL**: Configurable via environment variables
- **Endpoints**: Repository info, commits, commit details
- **Authentication**: GitHub token support
- **Error Handling**: Comprehensive error management

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Vercel

1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Follow the prompts

### Deploy to Netlify

1. Build the project: `npm run build`
2. Upload the `dist` folder to Netlify
3. Configure environment variables in Netlify dashboard

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Add tests if applicable
5. Commit your changes: `git commit -m 'Add feature'`
6. Push to the branch: `git push origin feature-name`
7. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🆘 Support

- **Issues**: Report bugs and request features on GitHub
- **Documentation**: Check this README for detailed information
- **Backend**: Ensure the Commet Remote Data Server is running

## 🔮 Future Enhancements

- [ ] Real-time updates with WebSockets
- [ ] Advanced filtering and search
- [ ] Export functionality (CSV, JSON)
- [ ] Repository comparison tools
- [ ] Team collaboration features
- [ ] Mobile app version
