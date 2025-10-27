# Deployment Guide

# Deployment Guide - Heroku

This guide will help you deploy the Country Currency & Exchange API to Heroku.

## Prerequisites

1. A Heroku account (sign up at https://heroku.com)
2. Heroku CLI installed (https://devcenter.heroku.com/articles/heroku-cli)
3. Git installed and your code committed

## Step-by-Step Deployment

### 1. Install Heroku CLI (if not already installed)

Download and install from: https://devcenter.heroku.com/articles/heroku-cli

### 2. Login to Heroku

```bash
heroku login
```

This will open a browser window to authenticate.

### 3. Create a Heroku App

```bash
heroku create your-app-name
```

Replace `your-app-name` with your desired app name (must be unique globally). If you omit the name, Heroku will generate one for you.

### 4. Add MySQL Database (JawsDB)

```bash
heroku addons:create jawsdb:kitefin
```

This creates a free MySQL database and automatically sets the `JAWSDB_URL` environment variable.

**Note**: The free tier has limitations (5MB storage, 10 connections). For production, consider upgrading.

### 5. Verify Database Connection

```bash
heroku config:get JAWSDB_URL
```

This should show your MySQL connection URL.

### 6. Push Your Code to GitHub (Recommended)

```bash
git add .
git commit -m "Prepare for Heroku deployment"
git push origin main
```

### 7. Deploy to Heroku

**Option A: Deploy from GitHub (Recommended)**
1. Go to your Heroku dashboard: https://dashboard.heroku.com/apps
2. Select your app
3. Go to "Deploy" tab
4. Under "Deployment method", select "GitHub"
5. Connect your GitHub repository
6. Enable "Automatic deploys" from main branch (optional)
7. Click "Deploy Branch" to deploy manually

**Option B: Deploy via Git Push**
```bash
git push heroku main
```

### 8. Check Deployment Status

```bash
heroku logs --tail
```

Press Ctrl+C to exit logs.

### 9. Open Your App

```bash
heroku open
```

Or visit: `https://your-app-name.herokuapp.com`

### 10. Test Your Endpoints

Once deployed, test your API:

```bash
# Check status
curl https://your-app-name.herokuapp.com/status

# Refresh countries data
curl -X POST https://your-app-name.herokuapp.com/countries/refresh

# Get all countries
curl https://your-app-name.herokuapp.com/countries
```

## Important Notes

### Database Configuration

Your app is configured to automatically use Heroku's JawsDB via the `JAWSDB_URL` environment variable. The database config in `src/config/database.ts` handles this automatically:

- **On Heroku**: Uses `JAWSDB_URL`
- **Locally**: Uses your `.env` file variables

### Environment Variables

If you need to set additional environment variables:

```bash
heroku config:set VARIABLE_NAME=value
```

View all config vars:

```bash
heroku config
```

### Build Process

Heroku automatically:
1. Detects Node.js app
2. Runs `npm install`
3. Runs `npm run build` (compiles TypeScript)
4. Starts app with `npm start` (as defined in Procfile)

### Troubleshooting

**App crashes on startup:**
```bash
heroku logs --tail
```

**Database connection issues:**
```bash
heroku config:get JAWSDB_URL
```
Verify the URL is set correctly.

**Redeploy after changes:**
```bash
git add .
git commit -m "Fix: your changes"
git push heroku main
```

Or if using GitHub integration, just push to GitHub and it auto-deploys.

**Scale dynos (if needed):**
```bash
heroku ps:scale web=1
```

## Alternative: External Database

If you prefer to use an external MySQL database (like AWS RDS, Railway, etc.):

1. Don't add JawsDB addon
2. Set individual config vars:
```bash
heroku config:set DB_HOST=your-host
heroku config:set DB_PORT=3306
heroku config:set DB_USERNAME=your-user
heroku config:set DB_PASSWORD=your-password
heroku config:set DB_DATABASE=your-database
```

The app will automatically use these instead of JAWSDB_URL.

## Submission

Once deployed and tested:
1. Note your Heroku app URL: `https://your-app-name.herokuapp.com`
2. Submit this URL for the HNG Internship Stage 2 Backend Task
3. Ensure all endpoints work correctly before submitting

## Useful Commands

```bash
# View app info
heroku info

# Restart app
heroku restart

# Open app in browser
heroku open

# View logs
heroku logs --tail

# Run commands in Heroku environment
heroku run bash

# Check dyno status
heroku ps
```

## Cost Considerations

- Free tier includes 550-1000 dyno hours per month
- JawsDB free tier: 5MB storage, 10 connections
- App sleeps after 30 minutes of inactivity (first request after sleep takes longer)
- For production apps, consider upgrading to paid tiers

Good luck with your deployment! 🚀

## Prerequisites

Before deploying, ensure:
- ✅ Your code is pushed to GitHub
- ✅ All endpoints work locally
- ✅ Database is properly configured
- ✅ Environment variables are documented

---

## Option 1: Railway

Railway is a simple deployment platform with built-in MySQL support.

### Steps:

1. **Create Railway Account**
   - Go to [railway.app](https://railway.app)
   - Sign up with GitHub

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your repository

3. **Add MySQL Database**
   - In your project, click "New"
   - Select "Database" → "MySQL"
   - Railway will automatically provision a MySQL database

4. **Configure Environment Variables**
   - Click on your service
   - Go to "Variables" tab
   - Add the following:
     ```
     PORT=3000
     NODE_ENV=production
     DB_HOST=${{MYSQL.HOST}}
     DB_PORT=${{MYSQL.PORT}}
     DB_USERNAME=${{MYSQL.USER}}
     DB_PASSWORD=${{MYSQL.PASSWORD}}
     DB_DATABASE=${{MYSQL.DATABASE}}
     COUNTRIES_API_URL=https://restcountries.com/v2/all?fields=name,capital,region,population,flag,currencies
     EXCHANGE_RATE_API_URL=https://open.er-api.com/v6/latest/USD
     ```

5. **Deploy**
   - Railway will automatically deploy your app
   - Get your public URL from the settings

6. **Test Your Deployment**
   ```bash
   curl -X POST https://your-app.railway.app/countries/refresh
   curl https://your-app.railway.app/countries
   ```

---

## Option 2: Heroku

### Steps:

1. **Install Heroku CLI**
   ```bash
   npm install -g heroku
   ```

2. **Login to Heroku**
   ```bash
   heroku login
   ```

3. **Create Heroku App**
   ```bash
   heroku create your-app-name
   ```

4. **Add MySQL Addon**
   ```bash
   # ClearDB MySQL (Free tier available)
   heroku addons:create cleardb:ignite
   
   # Or JawsDB MySQL
   heroku addons:create jawsdb:kitefin
   ```

5. **Get Database URL**
   ```bash
   heroku config:get CLEARDB_DATABASE_URL
   # or
   heroku config:get JAWSDB_URL
   ```

6. **Set Environment Variables**
   ```bash
   # Parse the database URL and set individual variables
   heroku config:set NODE_ENV=production
   heroku config:set DB_HOST=your-db-host
   heroku config:set DB_PORT=3306
   heroku config:set DB_USERNAME=your-db-user
   heroku config:set DB_PASSWORD=your-db-password
   heroku config:set DB_DATABASE=your-db-name
   ```

7. **Create Procfile**
   Create a file named `Procfile` in your root directory:
   ```
   web: npm start
   ```

8. **Deploy**
   ```bash
   git push heroku main
   ```

9. **Open Your App**
   ```bash
   heroku open
   ```

---

## Option 3: AWS (Elastic Beanstalk)

### Steps:

1. **Install EB CLI**
   ```bash
   pip install awsebcli
   ```

2. **Initialize EB**
   ```bash
   eb init -p node.js your-app-name --region us-east-1
   ```

3. **Create Environment**
   ```bash
   eb create production-env
   ```

4. **Set Up RDS (MySQL)**
   - Go to AWS Console → RDS
   - Create MySQL database
   - Note the endpoint, username, password

5. **Set Environment Variables**
   ```bash
   eb setenv NODE_ENV=production \
     DB_HOST=your-rds-endpoint \
     DB_PORT=3306 \
     DB_USERNAME=admin \
     DB_PASSWORD=your-password \
     DB_DATABASE=countries_db
   ```

6. **Deploy**
   ```bash
   eb deploy
   ```

7. **Open Your App**
   ```bash
   eb open
   ```

---

## Option 4: DigitalOcean App Platform

### Steps:

1. **Create DigitalOcean Account**
   - Go to [digitalocean.com](https://www.digitalocean.com)

2. **Create New App**
   - Click "Create" → "Apps"
   - Connect your GitHub repository

3. **Add MySQL Database**
   - In your app settings, add a managed MySQL database
   - DigitalOcean will provide connection details

4. **Configure Environment Variables**
   - Add all required environment variables in the app settings
   - Use the database connection details provided

5. **Deploy**
   - DigitalOcean will automatically build and deploy

---

## Option 5: Google Cloud Platform (Cloud Run)

### Steps:

1. **Install gcloud CLI**
   - Follow instructions at [cloud.google.com/sdk](https://cloud.google.com/sdk)

2. **Create Dockerfile** (if needed)
   ```dockerfile
   FROM node:18-alpine
   WORKDIR /app
   COPY package*.json ./
   RUN npm install
   COPY . .
   RUN npm run build
   EXPOSE 3000
   CMD ["npm", "start"]
   ```

3. **Build and Push Container**
   ```bash
   gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/country-api
   ```

4. **Set Up Cloud SQL (MySQL)**
   - Create MySQL instance in Google Cloud Console
   - Note the connection details

5. **Deploy to Cloud Run**
   ```bash
   gcloud run deploy country-api \
     --image gcr.io/YOUR_PROJECT_ID/country-api \
     --platform managed \
     --region us-central1 \
     --set-env-vars DB_HOST=your-db-host,DB_PASSWORD=your-password
   ```

---

## Post-Deployment Checklist

After deploying, verify:

- [ ] **Health Check**: Visit your base URL
  ```bash
  curl https://your-app-url.com/
  ```

- [ ] **Database Connection**: Check if the app can connect to MySQL
  ```bash
  curl https://your-app-url.com/status
  ```

- [ ] **Refresh Endpoint**: Test the main functionality
  ```bash
  curl -X POST https://your-app-url.com/countries/refresh
  ```

- [ ] **Get Countries**: Verify data retrieval
  ```bash
  curl https://your-app-url.com/countries
  ```

- [ ] **Image Generation**: Check if image is generated
  ```bash
  curl https://your-app-url.com/countries/image --output test.png
  ```

- [ ] **Filtering**: Test filters
  ```bash
  curl https://your-app-url.com/countries?region=Africa
  ```

---

## Troubleshooting

### Database Connection Errors

**Problem**: `Error: connect ECONNREFUSED`

**Solutions**:
1. Verify database credentials
2. Check if database service is running
3. Ensure firewall rules allow connections
4. For cloud databases, whitelist your app's IP

### Port Issues

**Problem**: App doesn't start or crashes

**Solutions**:
1. Ensure `PORT` environment variable is set
2. Use `process.env.PORT` in your code
3. Most platforms assign a random port automatically

### Build Failures

**Problem**: Deployment fails during build

**Solutions**:
1. Check `package.json` scripts are correct
2. Ensure all dependencies are in `dependencies`, not `devDependencies`
3. Add build logs to identify specific errors
4. Verify Node.js version compatibility

### External API Timeouts

**Problem**: 503 errors when calling `/countries/refresh`

**Solutions**:
1. Increase timeout settings in your hosting platform
2. Add retry logic to external API calls
3. Consider caching responses

---

## Environment Variables Reference

Make sure these are set in your deployment platform:

```env
# Required
NODE_ENV=production
PORT=3000

# Database (adjust based on your provider)
DB_HOST=your-database-host
DB_PORT=3306
DB_USERNAME=your-username
DB_PASSWORD=your-password
DB_DATABASE=countries_db

# API URLs (usually don't need to change)
COUNTRIES_API_URL=https://restcountries.com/v2/all?fields=name,capital,region,population,flag,currencies
EXCHANGE_RATE_API_URL=https://open.er-api.com/v6/latest/USD
```

---

## Performance Tips

1. **Enable Database Indexing**: Ensure indexes on frequently queried columns
2. **Use Connection Pooling**: TypeORM handles this by default
3. **Add Caching**: Consider Redis for frequently accessed data
4. **Monitor**: Use platform monitoring tools
5. **CDN**: If serving images frequently, consider a CDN

---

## Security Recommendations

1. **Environment Variables**: Never commit `.env` to Git
2. **HTTPS**: Ensure your deployment uses HTTPS
3. **Database**: Use strong passwords
4. **Rate Limiting**: Consider adding rate limiting middleware
5. **Input Validation**: Already implemented in the API

---

## Monitoring

Set up monitoring to track:
- API response times
- Error rates
- Database connection status
- External API availability

Most platforms provide built-in monitoring tools.

---

## Cost Estimation

### Free Tier Options:
- **Railway**: $5 free credit monthly
- **Heroku**: Free tier with limitations
- **DigitalOcean**: $200 free credit for 60 days
- **Google Cloud**: $300 free credit

### Paid Tier (Estimated):
- **Database**: $5-15/month
- **Compute**: $5-20/month
- **Total**: ~$10-35/month

---

## Support

If you encounter issues:
1. Check platform-specific documentation
2. Review deployment logs
3. Test locally first
4. Consult platform community forums

---

## Final Steps for HNG Submission

1. ✅ Deploy your API
2. ✅ Test all endpoints
3. ✅ Update README with your deployment URL
4. ✅ Ensure GitHub repo is public
5. ✅ Go to #stage-2-backend channel in Slack
6. ✅ Run `/stage-two-backend` command
7. ✅ Submit:
   - Your API base URL
   - Your GitHub repo link
   - Your full name
   - Your email
   - Stack: Node.js/Express/TypeScript

Good luck! 🚀
