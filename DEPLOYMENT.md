# 🚀 ULTRATHINK Terminal - Cloud Run Deployment Guide

## Prerequisites

1. **Google Cloud Account**: Create one at https://cloud.google.com
2. **gcloud CLI**: Install from https://cloud.google.com/sdk/docs/install
3. **Docker**: Install from https://www.docker.com/get-started

## Quick Deploy

### Option 1: Using the Deploy Script (Recommended)

```bash
# Make the script executable
chmod +x deploy.sh

# Run the deployment
./deploy.sh
```

The script will:
- Prompt for your GCP Project ID
- Enable required APIs
- Build and push the Docker image
- Deploy to Cloud Run
- Display your application URL

### Option 2: Manual Deployment

1. **Set your project ID**:
```bash
export PROJECT_ID=your-project-id
gcloud config set project $PROJECT_ID
```

2. **Enable required APIs**:
```bash
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable firestore.googleapis.com
```

3. **Build and deploy**:
```bash
gcloud builds submit --tag gcr.io/$PROJECT_ID/ultrathink-terminal

gcloud run deploy ultrathink-terminal \
  --image gcr.io/$PROJECT_ID/ultrathink-terminal \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars "GCP_PROJECT_ID=$PROJECT_ID,NODE_ENV=production"
```

### Option 3: Using Cloud Build Trigger (CI/CD)

1. **Connect your GitHub repository** in Cloud Console:
   - Go to Cloud Build > Triggers
   - Click "Connect Repository"
   - Select GitHub and authenticate
   - Choose your repository

2. **Create a trigger**:
   - Click "Create Trigger"
   - Name: `deploy-on-push`
   - Event: Push to branch
   - Branch: `main`
   - Build configuration: Cloud Build configuration file
   - Location: `/cloudbuild.yaml`

3. **Push to deploy**:
```bash
git push origin main
```

## 🎮 Fun Features

### Magic Word Detection 🪄
Applications containing the word "ULTRATHINK" trigger:
- Enhanced evaluation protocols
- Priority review status
- Special visual effects
- Maximum thinking budget allocation

### Celebration Animation 🎉
On successful submission:
- ASCII art celebration frames
- Confetti animation
- Matrix rain effect
- Rainbow glow effects

## 📊 Database Management

### Firestore Setup
The application automatically creates a Firestore collection called `applications`.

### View Applications
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Navigate to Firestore Database
4. View the `applications` collection

### Application Schema
```javascript
{
  id: "timestamp-based-id",
  timestamp: "ISO 8601 date",
  name: "Applicant Name",
  email: "email@example.com",
  github: "github.com/username",
  twitter: "@handle",
  project: "Project description",
  reason: "Motivation",
  skills: "Technical skills",
  magicWordDetected: true/false,
  status: "pending" | "priority_review"
}
```

## 🔧 Environment Variables

Create a `.env` file for local development:
```env
GCP_PROJECT_ID=your-project-id
NODE_ENV=development
PORT=8080
```

## 🧪 Testing the Deployment

1. **Health Check**:
```bash
curl https://your-service-url.run.app/health
```

2. **Submit Test Application**:
```bash
curl -X POST https://your-service-url.run.app/api/apply \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "github": "github.com/testuser",
    "project": "Testing ULTRATHINK deployment",
    "reason": "Testing the system",
    "skills": "Cloud Run, Firestore"
  }'
```

## 🛠️ Troubleshooting

### Common Issues

1. **Permission Denied**:
   - Ensure you have the necessary IAM roles
   - Run: `gcloud projects add-iam-policy-binding $PROJECT_ID --member="user:your-email@gmail.com" --role="roles/run.admin"`

2. **Firestore Not Working**:
   - Check if Firestore is in Native mode
   - Ensure the service account has Firestore access

3. **Build Fails**:
   - Check Docker configuration
   - Ensure all dependencies are in package.json

## 📈 Monitoring

### View Logs
```bash
gcloud run services logs read ultrathink-terminal --region us-central1
```

### View Metrics
Visit the [Cloud Run Console](https://console.cloud.google.com/run) to see:
- Request count
- Latency
- Error rate
- Active instances

## 🎯 Next Steps

1. **Custom Domain**: Add a custom domain in Cloud Run settings
2. **SSL Certificate**: Automatically provisioned with custom domain
3. **Scaling**: Adjust min/max instances based on traffic
4. **Alerts**: Set up monitoring alerts in Cloud Monitoring

## 🔐 Security Notes

- Applications are stored securely in Firestore
- No sensitive data in environment variables
- HTTPS enforced by Cloud Run
- Authentication can be added if needed

---

**🤖 ULTRATHINK**: For builders, by builders. Use the magic word wisely. 🚀