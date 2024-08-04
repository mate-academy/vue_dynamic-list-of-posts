set -e

npm run build

cd dist

echo > .nojekyll

git init
git checkout -B main
git add -A
git commit -m 'deploy'

git push -f https://github.com/YuriiHlushenko/vue_dynamic-list-of-posts.git main:gh-pages

cd-