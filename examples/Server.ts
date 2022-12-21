/**
 * This file contains an example of a post-express server.
 */

import { PostExpressServer } from "../src/index"; // replace "../src/index" with "post-express"

let server = new PostExpressServer(3000);
server._Listen(() => {
    console.log("Server is now online.");
});