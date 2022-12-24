# Best practices in post-express.js
This document contains some useful recommendations that may help your development experience while using the post-express library.

## File structure
We recommend a file structure that suits your use case, and that looks something like these.:

Of course, always remember that you are completely obligated to edit this documentation if you feel that there is a better way of doing things. Everyone has their own preferences.
### Web API (Application Programming Interface)
/node_modules
/public (contains assets that may be used)
/data (contains database related files)
/src
|- /routes
||- Animals.ts (returns an array of PostExpressRoutes, and adds them to group "/Animals")
|- index.ts (entry point for app) 
/package-lock.json
/package.json

## Fullstack post-express application
/node_modules
/public (contains assets that may be used)
/server (contains the back-end code (post-express))
|- /data (database related files)
|- index.ts (entry point for app)
/client (contains the front-end code (HTML))
|- /status (folder that contains HTML files related to status codes)
||- NotFound404.html
||- InternalError500.html
|- home.html
/package-lock.json
/package.json
