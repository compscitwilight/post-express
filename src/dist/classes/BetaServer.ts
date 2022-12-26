/**
 * An object based off of PostExpressServer which is used for beta features that
 * anyone is able to use by running PostExpressServer.enableBeta();
 */

import PostExpressServer from "./Server";

class PostExpressBetaServer {
    constructor(
        public readonly Server: PostExpressServer
    ) {}
}

export default PostExpressBetaServer;