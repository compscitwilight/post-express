/**
 * This file contains an example of a post-express server with parameters.
 */

// copied from ./ServerRouting.ts & ./Server.ts
import { PostExpressServer, HTTPMethod, Request, Response } from "../../src/index"; // replace "../src/index" with "post-express"

let server = new PostExpressServer(3000);
server._Listen(() => {
    console.log("Server is now online.");
});

// an interface that defines the parameters
// PLEASE MAKE SURE THAT THE NAME OF THE PROPERTY IS IDENTICAL TO THE ONE SET IN THE PATH.
// THIS INCLUDES CASE-SENSITIVE CHARACTERS (https://en.wikipedia.org/wiki/Case_sensitivity)
interface RootParameters {
    id: number
}

// server.Route requires an array of route parameter objects, not a singular one. Save a headache
server.Route([{
    path: "/user/:id", // just like Express.js, parameters start with a : in the path
    method: HTTPMethod.GET,
    // we will add our RootParameters interface inside of a generic (https://www.typescriptlang.org/docs/handbook/2/generics.html)
    // which will let us access our parameters defined in RootParameters with req.params.
    handler: (req: Request<RootParameters>, res: Response) => {
        let id = req.params.id;
        res.send(`You are viewing the page of User ${id}`);
    }
}])