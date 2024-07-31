#!/usr/bin/env sh

# przerywaj na błędach
set -e

# budowanie
npm run build

# przejdź do katalogu z wynikami budowania
cd dist

# dodaj .nojekyll, by pominąć przetwarzanie przez Jekyll
echo > .nojekyll

# jeśli wdrażasz na własną domenę
# echo 'www.przyklad.com' > CNAME

git init
git checkout -B main
git add -A
git commit -m 'wdrożenie'

# jeśli wdrażasz na https://<NAZWA_UŻYTKOWNIKA>.github.io
# git push -f git@github.com:<NAZWA_UŻYTKOWNIKA>/<NAZWA_UŻYTKOWNIKA>.github.io.git main

# jeśli wdrażasz na https://<NAZWA_UŻYTKOWNIKA>.github.io/<REPO>
# git push -f git@github.com:<NAZWA_UŻYTKOWNIKA>/<REPO>.git main:gh-pages
git push -f git@github.com:olafchuszno/vue_dynamic-list-of-posts.git main:gh-pages

cd -
