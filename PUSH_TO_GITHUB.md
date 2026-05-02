# Push StudyMate AI to GitHub

## Step 1: Initialize Git Repository (if not already)
Open terminal in `c:\Abhi\Hackazrds_3\studymate-ai`:

```bash
# If you don't have a git repo yet:
git init

# Or if you want to push the parent folder:
cd ..
git init
```

## Step 2: Add Remote Repository
```bash
git remote add origin https://github.com/TestingGuyz/StudyMate-AI.git
```

## Step 3: Create .gitignore
Create `c:\Abhi\Hackazrds_3\studymate-ai\.gitignore`:
```
# Dependencies
node_modules
.pnpm-store

# Build
dist
dist-ssr
*.local

# Environment
.env
.env.*

# Editor
.vscode/*
!.vscode/extensions.json
.idea
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

# OS
.DS_Store
Thumbs.db
```

## Step 4: Add, Commit, Push
```bash
# Add all files
git add .

# Commit
git commit -m "Initial commit: StudyMate AI - AI-powered study assistant for ICSE/CBSE"

# Push to main branch
git branch -M main
git push -u origin main
```

## Step 5: Verify
Go to https://github.com/TestingGuyz/StudyMate-AI to see your code!

## Optional: Deploy to Netlify
For a live demo link, deploy to Netlify:
1. Build: `npm run build`
2. Go to https://app.netlify.com/drop
3. Drag & drop the `dist` folder
4. Copy the live URL and update README.md

## Troubleshooting

### "remote already exists"
```bash
git remote remove origin
git remote add origin https://github.com/TestingGuyz/StudyMate-AI.git
```

### Authentication issues
Use GitHub token instead of password:
1. Go to https://github.com/settings/tokens
2. Generate new token (classic) with "repo" scope
3. Use token as password when pushing

Or use GitHub Desktop / VSCode GUI for easier auth.
