#!/bin/bash

echo "🚀 Deploying Vue Dynamic List of Posts..."

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📁 Initializing git repository..."
    git init
    git add .
    git commit -m "Initial commit"
    echo "✅ Git repository initialized"
else
    echo "📝 Adding all changes..."
    git add .
    git commit -m "Update: $(date)"
fi

# Check if remote origin exists
if ! git remote | grep -q origin; then
    echo "🔗 Please add your GitHub repository as remote origin:"
    echo "   git remote add origin https://github.com/yourusername/vue_dynamic-list-of-posts.git"
    echo "   Then run this script again."
    exit 1
fi

# Push to GitHub
echo "📤 Pushing to GitHub..."
git push origin main

echo "✅ Code pushed to GitHub!"
echo ""
echo "🌐 To enable GitHub Pages:"
echo "   1. Go to your repository on GitHub"
echo "   2. Settings → Pages"
echo "   3. Source: Deploy from a branch"
echo "   4. Branch: main, Folder: / (root)"
echo "   5. Save"
echo ""
echo "⏳ Wait 5-10 minutes for deployment"
echo "🔗 Your app will be available at:"
echo "   https://yourusername.github.io/vue_dynamic-list-of-posts/"
