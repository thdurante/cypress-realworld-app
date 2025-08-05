# Heroku Deployment Guide

This guide will help you deploy the Cypress Real World App to Heroku.

## Prerequisites

1. Install the [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli)
2. Have a Heroku account
3. Have Git installed

## Deployment Steps

### 1. Login to Heroku

```bash
heroku login
```

### 2. Create a new Heroku app

```bash
heroku create your-app-name
```

Replace `your-app-name` with your desired app name.

### 3. Set environment variables

```bash
# Set the environment to production
heroku config:set NODE_ENV=production

# Set pagination size
heroku config:set PAGINATION_PAGE_SIZE=10

# Set the frontend URL (replace with your actual app URL)
heroku config:set FRONTEND_URL=https://your-app-name.herokuapp.com
```

### 4. Deploy to Heroku

```bash
git add .
git commit -m "Prepare for Heroku deployment"
git push heroku main
```

### 5. Open your app

```bash
heroku open
```

## Environment Variables

You can configure the following environment variables in Heroku:

### Required
- `NODE_ENV`: Set to "production"
- `PAGINATION_PAGE_SIZE`: Number of items per page (default: 10)
- `FRONTEND_URL`: Your app's URL for CORS configuration

### Optional (for authentication providers)
- `VITE_AUTH0`: Set to "true" to enable Auth0 authentication
- `VITE_OKTA`: Set to "true" to enable Okta authentication
- `VITE_AWS_COGNITO`: Set to "true" to enable AWS Cognito authentication
- `VITE_GOOGLE`: Set to "true" to enable Google OAuth

If you enable any authentication provider, you'll need to set the corresponding configuration variables.

## Authentication Setup

### Auth0
```bash
heroku config:set VITE_AUTH0=true
heroku config:set AUTH0_DOMAIN=your-domain.auth0.com
heroku config:set AUTH0_CLIENT_ID=your-client-id
heroku config:set AUTH0_CLIENT_SECRET=your-client-secret
```

### Okta
```bash
heroku config:set VITE_OKTA=true
heroku config:set OKTA_DOMAIN=your-domain.okta.com
heroku config:set OKTA_CLIENT_ID=your-client-id
heroku config:set OKTA_CLIENT_SECRET=your-client-secret
```

### AWS Cognito
```bash
heroku config:set VITE_AWS_COGNITO=true
heroku config:set AWS_REGION=us-east-1
heroku config:set AWS_USER_POOLS_ID=your-user-pool-id
heroku config:set AWS_USER_POOLS_WEB_CLIENT_ID=your-client-id
```

### Google OAuth
```bash
heroku config:set VITE_GOOGLE=true
heroku config:set GOOGLE_CLIENT_ID=your-google-client-id
heroku config:set GOOGLE_CLIENT_SECRET=your-google-client-secret
```

## Troubleshooting

### Check logs
```bash
heroku logs --tail
```

### Restart the app
```bash
heroku restart
```

### Check app status
```bash
heroku ps
```

### View config vars
```bash
heroku config
```

### Common Issues

#### React app not loading
If you see the backend API working but the React frontend doesn't load:

1. **Check if the build directory exists**: The `heroku-postbuild` script should create the `build` directory
2. **Verify static file serving**: The Express server should serve files from `../build`
3. **Check CORS settings**: Make sure the `FRONTEND_URL` environment variable is set correctly

#### API calls failing
If API calls are failing in production:

1. **Check API base URL**: The frontend now uses relative URLs in production
2. **Verify CORS configuration**: The backend allows requests from the same domain
3. **Check authentication**: Some endpoints require authentication

#### Build failures
If the build fails:

1. **Check Node.js version**: Ensure you're using Node.js 20+ (specified in package.json)
2. **Verify TypeScript compilation**: Run `yarn types` locally to check for errors
3. **Check dependencies**: Ensure all dependencies are properly installed

## Architecture

This deployment uses a **single-dyno architecture** where the Express.js backend serves both the API and the built React frontend:

1. **Build Process**: The `heroku-postbuild` script builds the React app and seeds the database
2. **Runtime**: The `start:production` script runs the Express.js server in production mode
3. **Static Files**: The built React app is served from the `/build` directory
4. **API Routes**: All API routes are handled by Express.js
5. **Frontend Routes**: All non-API routes serve the React app (SPA routing)

**Why this approach?**
- **Cost-effective**: Single dyno instead of two separate ones
- **Simplified deployment**: One process to manage
- **CORS-free**: Frontend and backend on same domain
- **Production-ready**: Express serves static files efficiently

## Database

The app uses a JSON file-based database (`data/database.json`) that gets seeded during the build process. For production use, consider migrating to a proper database like PostgreSQL.

## Custom Domains

To use a custom domain:

1. Add your domain in the Heroku dashboard
2. Update the `FRONTEND_URL` environment variable
3. Configure your DNS settings

## Scaling

To scale your app:

```bash
# Scale to multiple dynos
heroku ps:scale web=2

# Check current scaling
heroku ps
```

## Monitoring

Enable Heroku add-ons for monitoring:

```bash
# Add logging
heroku addons:create papertrail:choklad

# Add monitoring
heroku addons:create newrelic:wayne
``` 