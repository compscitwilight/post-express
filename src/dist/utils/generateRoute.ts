/**
 * generateRoute.ts - 12-19-2022
 * Methods to easily generate post-express routes without the hassle of dealing with
 * the RouteParams interface.
 */

import RouteParams from "../interfaces/RouteParams";
import HTTPMethod from "../types/HTTPMethod";
import PostExpressServer from "../classes/Server";
import { RequestHandler } from "express";

export interface RouteGenerationParams extends RouteParams {
    server: PostExpressServer
}

export function generateRoute(params: RouteGenerationParams) {
    let Server = params.server;
    let RouteData = new Array<RouteParams>(params);
    let Route = Server.Route(RouteData);
    return Route;
}

export function generateRoutes(arr: RouteGenerationParams[]) {
    arr.forEach((params: RouteGenerationParams) => {
        generateRoute(params);
    })
}