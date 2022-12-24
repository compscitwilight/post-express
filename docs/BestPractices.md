# Best practices in post-express.js
This document contains some useful recommendations that may help your development experience while using the post-express library.

## File structure
We recommend a file structure that suits your use case, and that looks something like these.:

Of course, always remember that you are completely obligated to edit this documentation if you feel that there is a better way of doing things. Everyone has their own preferences.
### Web API (Application Programming Interface)
/node_modules
<br>
/public (contains assets that may be used)
<br>
/data (contains database related files)
<br>
/src
<br>
|- /routes
<br>
||- Animals.ts (returns an array of PostExpressRoutes, and adds them to group "/Animals")
<br>
|- index.ts (entry point for app)
<br> 
/package-lock.json
<br>
/package.json

### Fullstack post-express application
/node_modules
<br>
/public (contains assets that may be used)
<br>
/server (contains the back-end code (post-express))
<br>
|- /data (database related files)
<br>
|- index.ts (entry point for app)
<br>
/client (contains the front-end code (HTML))
<br>
|- /status (folder that contains HTML files related to status codes)
<br>
||- NotFound404.html
<br>
||- InternalError500.html
<br>
|- home.html
<br>
/package-lock.json
<br>
/package.json
