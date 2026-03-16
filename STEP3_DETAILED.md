# Step 3: Push Your Code to GitHub - Detailed Guide

This guide walks you through pushing your LeadPulse code to GitHub step-by-step.

---

## Prerequisites

Before starting, make sure you have:
1. ✅ GitHub account created (from Step 1)
2. ✅ Repository created on GitHub (from Step 2)
3. ✅ Your repository URL ready (e.g., `https://github.com/YOUR_USERNAME/leadpulse-saas`)

---

## Part 1: Check if Git is Installed

Open your terminal and run:

```bash
git --version
```

**Expected output:**
```
git version 2.x.x
```

If you see an error, install Git:
- **Mac:** `brew install git`
- **Windows:** Download from https://git-scm.com
- **Linux:** `sudo apt-get install git`

---

## Part 2: Configure Git (First Time Only)

Run these commands once to set up your Git identity:

```bash
git config --global user.name "Your Full Name"
git config --global user.email "your-email@example.com"
```

**Replace:**
- `Your Full Name` with your actual name (e.g., "John Smith")
- `your-email@example.com` with your email (use the same email as your GitHub account)

**Example:**
```bash
git config --global user.name "Jane Doe"
git config --global user.email "jane.doe@realestate.com.au"
```

---

## Part 3: Navigate to Your Project

Open terminal and go to your LeadPulse project:

```bash
cd /home/ubuntu/leadpulse-saas
```

Verify you're in the right folder by running:

```bash
ls -la
```

You should see files like:
- `package.json`
- `server/`
- `client/`
- `db/`
- `Dockerfile`
- etc.

---

## Part 4: Initialize Git Repository

Now initialize Git in your project folder:

```bash
git init
```

**Expected output:**
```
Initialized empty Git repository in /home/ubuntu/leadpulse-saas/.git/
```

---

## Part 5: Add All Files

Add all your project files to Git:

```bash
git add .
```

This stages all files for commit. The `.` means "all files in this folder and subfolders".

**Verify it worked:**
```bash
git status
```

You should see a list of files in green (ready to commit).

---

## Part 6: Create Your First Commit

Create a commit with a message:

```bash
git commit -m "Initial LeadPulse MVP commit"
```

**Expected output:**
```
[main (root-commit) abc1234] Initial LeadPulse MVP commit
 50 files changed, 5000 insertions(+)
 create mode 100644 package.json
 create mode 100644 server/index.js
 ...
```

---

## Part 7: Add Your GitHub Repository as Remote

This tells Git where to push your code. Replace `YOUR_USERNAME` with your actual GitHub username:

```bash
git remote add origin https://github.com/YOUR_USERNAME/leadpulse-saas.git
```

**Example:**
```bash
git remote add origin https://github.com/jane-doe/leadpulse-saas.git
```

**Verify it worked:**
```bash
git remote -v
```

You should see:
```
origin  https://github.com/YOUR_USERNAME/leadpulse-saas.git (fetch)
origin  https://github.com/YOUR_USERNAME/leadpulse-saas.git (push)
```

---

## Part 8: Rename Branch to Main

GitHub uses `main` as the default branch name:

```bash
git branch -M main
```

This renames your current branch to `main`.

---

## Part 9: Push Your Code to GitHub

This is the final step! Push your code:

```bash
git push -u origin main
```

**What happens:**
- Git uploads all your files to GitHub
- The `-u` flag sets up tracking so future pushes are easier
- Takes 10-30 seconds depending on internet speed

**Expected output:**
```
Enumerating objects: 50, done.
Counting objects: 100% (50/50), done.
Delta compression using up to 8 threads
Compressing objects: 100% (45/45), done.
Writing objects: 100% (50/50), 500 KiB | 2.5 MiB/s, done.
Total 50 (delta 0), reused 0 (delta 0), pack-reused 0
To https://github.com/YOUR_USERNAME/leadpulse-saas.git
 * [new branch]      main -> main
Branch 'main' set up to track remote branch 'main' from 'origin'.
```

---

## Part 10: Verify on GitHub

1. Go to your GitHub repository: `https://github.com/YOUR_USERNAME/leadpulse-saas`
2. Refresh the page
3. You should see all your files listed!

---

## Complete Command Sequence (Copy & Paste)

If you want to do it all at once, here's the complete sequence:

```bash
# Navigate to project
cd /home/ubuntu/leadpulse-saas

# Configure Git (first time only)
git config --global user.name "Your Full Name"
git config --global user.email "your-email@example.com"

# Initialize repository
git init

# Add all files
git add .

# Create commit
git commit -m "Initial LeadPulse MVP commit"

# Add remote (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/leadpulse-saas.git

# Rename to main
git branch -M main

# Push to GitHub
git push -u origin main
```

---

## Troubleshooting

### Error: "fatal: not a git repository"
**Solution:** Make sure you're in the right folder
```bash
cd /home/ubuntu/leadpulse-saas
git init
```

### Error: "remote origin already exists"
**Solution:** You already added the remote. Skip that step or use:
```bash
git remote remove origin
git remote add origin https://github.com/YOUR_USERNAME/leadpulse-saas.git
```

### Error: "nothing to commit"
**Solution:** Make sure you ran `git add .` first
```bash
git add .
git status  # Check what's staged
git commit -m "Your message"
```

### Error: "Authentication failed"
**Solution:** GitHub now requires personal access tokens. Follow this:
1. Go to GitHub Settings → Developer settings → Personal access tokens
2. Click "Generate new token"
3. Select `repo` scope
4. Copy the token
5. When Git asks for password, paste the token instead

### Error: "fatal: The remote end hung up unexpectedly"
**Solution:** Usually a network issue. Try again:
```bash
git push -u origin main
```

---

## What Happens Next?

After Step 3 is complete:
1. Your code is now on GitHub
2. You can proceed to Step 5: Connect to Railway
3. Railway will automatically detect your repository
4. Your app will be deployed!

---

## Quick Reference

| Command | What It Does |
|---------|--------------|
| `git init` | Create Git repository |
| `git add .` | Stage all files |
| `git commit -m "msg"` | Create a commit |
| `git remote add origin URL` | Add GitHub repository |
| `git branch -M main` | Rename to main |
| `git push -u origin main` | Upload to GitHub |
| `git status` | Check status |
| `git log` | View commit history |

---

## Need Help?

If you get stuck:
1. Copy the exact error message
2. Check the Troubleshooting section above
3. Try the command again
4. If still stuck, you can share the error and I can help!

---

## Next Steps

Once Step 3 is complete:
1. ✅ Go to GitHub and verify your code is there
2. ✅ Proceed to Step 5: Connect to Railway
3. ✅ Deploy your application!

**You're almost there! 🚀**
