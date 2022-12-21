# post-express server
<b>post-express</b> is an attempt to build an open-source library, built on top of express.js, to succeed the library and create a more advanced server-side library.

```ts
import { PostExpressServer } from "post-express";
let Server = new PostExpressServer(3000);
Server._Listen(() => {
    console.log("Server is now online");
});
```

## Contributing
Anyone is allowed to contribute to post-express. Just open a pull request if you would like to merge your own code into this repository, or open an issue if you would like changes to be made to the project.

### Command line
If you'd like to contribute to post-express on your local machine, then run the following commands.

NOTE: Please make sure that you have Node.js and Git installed.

`git clone (url-goes-here) post-express`
`cd post-express`
`npm install`

Whenever you're done making changes, run the following command.
`git add --all`
`git commit -m "State the changes that you made here."`
`git push`
After that, open up a pull request on this repository summarizing your changes!