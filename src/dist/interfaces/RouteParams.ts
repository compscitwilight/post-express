import HTTPMethod from "../types/HTTPMethod";
import { RequestHandler } from "express";

interface RouteParams {
    path: string,
    method: HTTPMethod | HTTPMethod.GET,
    handler: RequestHandler
}

export default RouteParams;