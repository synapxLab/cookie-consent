
npm install
npm run dev


su - synapxlab
cd /var/www/vhosts/cookie/

git ls-files | tree --fromfile
npm run dev

git rm -r --cached vendor node_modules temps app
git rm --cached readme.txtq
npm run build
git add .
git commit -m "build"


git status
git add .

git status
git rebase --abort   

# voir ce qui traîne
git status --porcelain

npm run build
# stage + commit de tout (dist/ inclus si tu le publies sur npm)
git add -A
git commit -m "chore: prep release"
npm version patch -m "chore(release): %s"

git push origin main --follow-tags



# depuis la branche main
git checkout --orphan temp_branch
git add -A
git commit -m "chore: initial clean history"
git branch -D main
git branch -m main
git push -f origin main


git pull --rebase origin main 
