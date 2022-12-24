/**
 * This file contains an example of a post-express server with routing.
 */

// copied from ./Server.ts
import { PostExpressServer, HTTPMethod, Request, Response } from "../src/index"; // replace "../src/index" with "post-express"

let server = new PostExpressServer(3000);
server._Listen(() => {
    console.log("Server is now online.");
});

// server.Route requires an array of route parameter objects, not a singular one. Save a headache
server.Route([{
    path: "/home",
    method: HTTPMethod.GET,
    handler: (req: Request, res: Response) => {
        res.send("Hello, world!"); // display "Hello, world!" on the client
    }
}])