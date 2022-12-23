import HTTPMethod from "../types/HTTPMethod";
import { Express, RequestHandler } from "express";
import { StateConsole, StateConsoleState } from "./StateConsole";

export function routeFromHTTPMethod(method: HTTPMethod, server: Express, route: string, handler: RequestHandler) {
    switch (method) {
        case (HTTPMethod.ANY):
            server.all(route, handler);
            break;
        case (HTTPMethod.DELETE):
            server.delete(route, handler);
            break;
        case (HTTPMethod.GET):
            server.get(route, handler);
            break;
        case (HTTPMethod.PATCH):
            server.patch(route, handler);
            break;
        case (HTTPMethod.POST):
            server.post(route, handler);
            break;
        case (HTTPMethod.PUT):
            server.put(route, handler);
            break;
    }
    
    StateConsole(StateConsoleState.CREATE, `Created ${String(method)} route ${route}`);
}