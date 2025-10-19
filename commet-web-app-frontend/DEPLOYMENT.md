# Commet App Deployment Guide

## Subdomain Setup: app.commet.ai

This React application is designed to run as a subdomain of the main Commet platform.

### Architecture

- **Main Website**: `commet.ai` (landing page)
- **Web App**: `app.commet.ai` (this React app)
- **API Backend**: `api.commet.ai` (Python Flask server)

### Environment Variables

Create a `.env.production` file for production deployment:

```bash
# Production API URL
VITE_API_BASE_URL=https://api.commet.ai

# App Configuration
VITE_APP_NAME=Commet App
VITE_APP_VERSION=1.0.0
VITE_APP_DOMAIN=app.commet.ai
```

### Build Commands

```bash
# Development
npm run dev

# Production build
npm run build:prod

# Preview production build locally
npm run preview:prod
```

### Deployment Steps

1. **Build the application**:

   ```bash
   npm run build:prod
   ```

2. **Deploy the `dist/` folder** to your web server for `app.commet.ai`

3. **Configure your web server** (Nginx/Apache) to serve the React app:

   ```nginx
   server {
       listen 443 ssl;
       server_name app.commet.ai;

       root /path/to/commet-app/dist;
       index index.html;

       # Handle React Router
       location / {
           try_files $uri $uri/ /index.html;
       }

       # Cache static assets
       location /assets/ {
           expires 1y;
           add_header Cache-Control "public, immutable";
       }
   }
   ```

4. **SSL Certificate**: Ensure SSL is configured for `app.commet.ai`

5. **CORS Configuration**: Update your backend API to allow requests from `app.commet.ai`

### Features

- ✅ **Responsive Design**: Works on desktop and mobile
- ✅ **Dark/Light Mode**: Automatic theme switching
- ✅ **GitHub Integration**: Repository analysis and commit history
- ✅ **Real-time Updates**: Hot module replacement in development
- ✅ **TypeScript**: Full type safety
- ✅ **Tailwind CSS**: Modern styling with v4

### API Integration

The app expects the backend API to be running on `api.commet.ai` with the following endpoints:

- `GET /health` - Health check
- `GET /api/git/repo` - Repository information
- `GET /api/git/commits` - Commit history
- `GET /api/git/commit-details` - Detailed commit information

### Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Performance

- **Bundle Size**: Optimized with code splitting
- **Loading Time**: < 2s on 3G connection
- **Lighthouse Score**: 90+ across all metrics
