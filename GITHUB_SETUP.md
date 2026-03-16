# GitHub Setup Guide for LeadPulse

This guide walks you through setting up GitHub and connecting your LeadPulse project for Railway deployment.

## Step 1: Create a GitHub Account

1. Go to [GitHub.com](https://github.com)
2. Click **Sign up**
3. Enter your email address
4. Create a password (strong password recommended)
5. Choose a username (e.g., `your-name` or `your-company`)
6. Click **Create account**
7. Verify your email address
8. Complete the setup wizard

**Your GitHub profile is now ready!**

---

## Step 2: Create a New Repository

### 2.1 Create Repository on GitHub
1. Go to [GitHub New Repository](https://github.com/new)
2. Fill in the details:
   - **Repository name:** `leadpulse-saas`
   - **Description:** `AI-powered lead response and follow-up automation for Australian real estate agents`
   - **Visibility:** Select **Public** (free tier) or **Private** (if you have GitHub Pro)
   - **Initialize repository:** Leave unchecked (we have files already)
3. Click **Create repository**

You'll see a page with instructions. Keep this page open!

---

## Step 3: Push Your Code to GitHub

### 3.1 Install Git (if not already installed)

**On Mac:**
```bash
brew install git
```

**On Windows:**
Download from [git-scm.com](https://git-scm.com)

**On Linux:**
```bash
sudo apt-get install git
```

### 3.2 Configure Git (First Time Only)
```bash
git config --global user.name "Your Name"
git config --global user.email "your-email@example.com"
```

### 3.3 Initialize and Push Your Project
```bash
cd /home/ubuntu/leadpulse-saas

# Initialize git repository
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial LeadPulse MVP commit"

# Add remote repository (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/leadpulse-saas.git

# Rename branch to main (GitHub default)
git branch -M main

# Push to GitHub
git push -u origin main
```

**Your code is now on GitHub!**

---

## Step 4: Verify Your GitHub Repository

1. Go to your repository: `https://github.com/YOUR_USERNAME/leadpulse-saas`
2. You should see all your files:
   - `server/` - Backend code
   - `client/` - Frontend code
   - `db/` - Database schema
   - `package.json` - Dependencies
   - `Dockerfile` - Container config
   - All documentation files

---

## Step 5: Connect GitHub to Railway

### 5.1 Create Railway Account
1. Go to [Railway.app](https://railway.app)
2. Click **Start Free**
3. Click **Sign up with GitHub**
4. Authorize Railway to access your GitHub account
5. Complete the setup

### 5.2 Deploy from GitHub
1. In Railway dashboard, click **New Project**
2. Select **Deploy from GitHub repo**
3. You'll be asked to authorize Railway
4. Select your `leadpulse-saas` repository
5. Click **Deploy**

Railway will automatically:
- Build your application
- Create a PostgreSQL database
- Deploy your backend
- Provide a public URL

---

## Step 6: Make Updates (Future Deployments)

Once everything is set up, updating your app is simple:

```bash
# Make changes to your code
# Edit files as needed

# Stage changes
git add .

# Commit changes
git commit -m "Description of what changed"

# Push to GitHub
git push origin main

# Railway automatically redeploys!
```

---

## Troubleshooting

### Issue: "fatal: not a git repository"
**Solution:**
```bash
cd /home/ubuntu/leadpulse-saas
git init
```

### Issue: "Permission denied (publickey)"
**Solution:** Set up SSH keys
```bash
# Generate SSH key
ssh-keygen -t ed25519 -C "your-email@example.com"

# Add to GitHub: Settings → SSH and GPG keys → New SSH key
# Paste the public key from: cat ~/.ssh/id_ed25519.pub
```

### Issue: "Repository not found"
**Solution:**
- Check your repository URL is correct
- Verify you have access to the repository
- Make sure you're using the right GitHub username

### Issue: "Branch 'main' set up to track remote 'origin/main'"
**Solution:** This is normal! Your branch is now tracking the remote.

---

## GitHub Best Practices

### 1. Create a .gitignore File
```bash
# Already included in your project
# It prevents sensitive files from being committed
```

### 2. Write Meaningful Commit Messages
```bash
# Good
git commit -m "Add HubSpot CRM integration"

# Bad
git commit -m "updates"
```

### 3. Never Commit Secrets
- `.env` file is already in `.gitignore`
- Never add API keys to code
- Use environment variables instead

### 4. Keep Your Repository Clean
```bash
# Delete unused branches
git branch -d old-branch

# View all branches
git branch -a
```

---

## GitHub Workflow for Team Collaboration (Future)

Once you have a team, use this workflow:

```bash
# Create a feature branch
git checkout -b feature/new-feature

# Make changes and commit
git add .
git commit -m "Add new feature"

# Push to GitHub
git push origin feature/new-feature

# Create Pull Request on GitHub
# Review and merge to main

# Delete feature branch
git branch -d feature/new-feature
```

---

## GitHub Resources

- **GitHub Docs:** https://docs.github.com
- **Git Basics:** https://git-scm.com/book/en/v2
- **GitHub Desktop (GUI):** https://desktop.github.com
- **GitHub CLI:** https://cli.github.com

---

## Next Steps

1. ✅ Create GitHub account
2. ✅ Create `leadpulse-saas` repository
3. ✅ Push your code to GitHub
4. ✅ Connect to Railway
5. ✅ Deploy your application

**You're ready to deploy LeadPulse!**

---

## Quick Reference

```bash
# First time setup
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/leadpulse-saas.git
git branch -M main
git push -u origin main

# Future updates
git add .
git commit -m "Your message"
git push origin main
```

For Railway deployment, see: `RAILWAY_QUICK_START.md`
