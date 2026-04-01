set -e
npm run build
cd dist
touch .nojekyll
git init
git checkout main || git checkout -b main
git add -A
git config user.name "github-actions" && git config user.email "actions@github.com"
git commit -m 'deploy'
git push -f https://github.com/ElinaMrachkovska/Vue_d-list-of-posts.git main:gh-pages
cd -