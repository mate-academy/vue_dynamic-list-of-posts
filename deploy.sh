set -e

npm run build-only

cd dist

echo > .nojekyll

git init
git checkout -B main

git config core.autocrlf false

git add -A
git commit -m 'deploy'

git push -f https://github.com/denys2/vue_dynamic-list-of-posts.git main:gh-pages

cd -
