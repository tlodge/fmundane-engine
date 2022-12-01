# Future mundane docs

This is the docusaurus repo for the Future Mundane docs.  To deploy the latest docs, do a:

```
git checkout master
npm run build
```

Then commit the changes

```
cd ..
git add .
git commit -m 'documentation changes'
git push
```

Then push changes to the gh-pages branch, which will then be served out og github:

```
git subtree push --prefix docs/build origin gh-pages
```
