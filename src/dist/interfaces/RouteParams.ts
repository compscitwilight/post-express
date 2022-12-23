import HTTPMethod from "../types/HTTPMethod";
import { RequestHandler } from "express";
import PostExpressServer from "../classes/Server";

interface RouteParams {
    path: string,
    method: HTTPMethod | HTTPMethod.GET,
    handler: RequestHandler,
    // RouteParams.misc
    // NOTE: Everything in this property must be optional (ending with ?)
    // otherwise, the changes may be breaking
    // - devrusty (12-23-22)
    misc?: {
        redirect?: string,
        originServer?: PostExpressServer
    }
}

export default RouteParams;