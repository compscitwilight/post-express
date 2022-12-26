/**
 * An object based off of PostExpressServer which is used for beta features that
 * anyone is able to use by running PostExpressServer.enableBeta();
 */

import PostExpressServer from "./Server";
import { Response } from "express";
import { render } from "../../renderer";
import RenderParameters from "../interfaces/RenderParameters";

class PostExpressBetaServer {
    constructor(
        public readonly Server: PostExpressServer
    ) {}

    public Render(res: Response, htmlRaw: string, renderParams?: RenderParameters[]) {
        render(res, htmlRaw, renderParams);
    }
}

export default PostExpressBetaServer;