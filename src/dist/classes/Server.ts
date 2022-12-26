import Express, { NextFunction, Request, RequestHandler, Response } from "express"
import RouteParams from "../interfaces/RouteParams";
import { StateConsole, StateConsoleState } from "../utils/StateConsole";
import PostExpressRoute from "./Route";
import { routeFromHTTPMethod } from "../utils/routeFromHTTPMethod";
import RouteGroup from "./RouteGroup";
import ServerDBData from "../interfaces/ServerDBData";
import * as socketio from "socket.io";
import { Server } from "http";
import Sessions from "../../data/Sessions";

/**
 * A post-express server.
 */
class PostExpressServer {
    private expressRouter: Express.Express = Express();
    private httpServer: Server = new Server(this.expressRouter);
    private socketsEnabled: boolean = false;
    private socketServer?: socketio.Server;
    private globalHandler: RequestHandler = (req: Request, res: Response) => {};
    public routes: PostExpressRoute[] = [];
    public db?: ServerDBData;
    public constructor(
        public readonly port: number
    ) {
        this.expressRouter.use(Express.urlencoded({ extended: false }));
    }

    /**
     * 
     * @param params The schema for the routes that are being created
     * @param cb A function to be called whenever the routes are finished being created
     * @param cbForEveryRouteCreated A function to be called whenever a route is created
     * @returns An array of the Route objects created, or a single Route object if params.length is 1
     */
    public Route(params: RouteParams[], cb?: Function, cbForEveryRouteCreated?: Function) {
        let Routes: PostExpressRoute | PostExpressRoute[] = [];
        for (var i = 0; i < params.length; i++) {
            let route = params[i];
            let Path = route.path;
            let Method = route.method;
            let Handler = route.handler;
        
            if (!Path.startsWith("/")) Path = `/${Path}`;
        
            let ExpressRouter = this.expressRouter;
            let Route = new PostExpressRoute(ExpressRouter, route);
            
            Routes.push(Route);
            this.routes.push(Route);

            let miscOptions = route.misc;
            if (miscOptions) {
                let redirect = miscOptions.redirect;
                // if there is no redirect, and it somehow gets to the routing part,
                // then the client will be redirected to "/"
                if (redirect) {
                    routeFromHTTPMethod(Method, ExpressRouter, Path, (req: Request, res: Response) => {
                        res.redirect(redirect || "/");
                    })
                    return Routes;
                }
            }
        
            routeFromHTTPMethod(Method, ExpressRouter, Path, (req: Request, res: Response, next: NextFunction) => {
                this.globalHandler(req, res, next);
                Handler(req, res, next);
            });
        }

        if (Routes.length === 1)
            Routes = Routes[0];
        return Routes;
    }

    public _Listen(callback: Function) {
        let Router = this.expressRouter;
        Router.listen(this.port, () => {
            callback();
        });
        StateConsole(StateConsoleState.CREATE, `post-express server is now online at port :${this.port}`);
    }

    /**
     * The route that will be in place of the website's root.
     * @param route The route that will replace the root of the website ("website.com/").
     */
    public setDefaultPage(route: string) {
        if (!route.startsWith("/"))
            route = `/${route}`;
        
        let Server = this.expressRouter;
        Server.all("/", (req: Request, res: Response) => {
            res.redirect(route);
        })
        StateConsole(StateConsoleState.CHANGE, `Set defaultPage to ${route}.`)
    }

    /**
     * Takes in an array of routes and moves them to website.com/{path}/{route.path}
     * @param routes The routes that will be grouped
     * @param path The name/path of the group
     * @param sharedCallback The shared callback for all of the routes in the group (note that this will override the existing handlers)
     */
    public groupRoutes(routes: PostExpressRoute[], path: string, sharedHandler?: RequestHandler) {
        let Server = this.expressRouter;
        let resolving = (routes as PostExpressRoute[]);
        console.log(routes.constructor);
        resolving.forEach((route: PostExpressRoute) => {
            if (route.params.path.startsWith("/"))
                route.params.path.replace("/", "");

            let existingRoute = this.routes.find((exRoute: PostExpressRoute) => {
                return exRoute.params.path == route.params.path;
            })

            let handler: RequestHandler = route.params.handler;
            if (sharedHandler) {
                this.Route([
                    {
                        method: route.params.method,
                        path: route.params.path,
                        handler: (req: Request, res: Response, next: NextFunction) => {
                            handler(req, res, next);
                            sharedHandler(req, res, next);
                        }
                    }
                ])
            }

            route.params.path = `${path}${route.params.path}`;
            this.Route(new Array<RouteParams>(route.params));
            if (existingRoute) {
                this.routes.splice(this.routes.indexOf(existingRoute), 1);
                StateConsole(StateConsoleState.DELETE, `Deleted route ${route.params.path}`);
            }
        });

        StateConsole(StateConsoleState.CREATE, `Created ${path} group`);
        return new RouteGroup(path, routes);
    }

    /**
     * Enables socket.io functionality for the server.
     */
    public enableSockets() {
        if (this.socketsEnabled)
            return console.warn("Sockets are already enabled.");
        
        this.socketsEnabled = true;
        this.createSocketServer();
        StateConsole(StateConsoleState.CHANGE, "Enabled sockets on server.");
    }

    /**
     * Creates a socket server. Only for use in exceptions, such as when a socket.io server is not existent.
     */
    private createSocketServer() {
        let socketServer = new socketio.Server(this.httpServer);
        this.socketServer = socketServer;
        StateConsole(StateConsoleState.CREATE, "Created socket.io server.");
        return socketServer;
    }

    /**
     * Returns the active socket.io server if sockets are enabled.
     */
    public getSocketServer() {
        if (!this.socketsEnabled)
            return console.warn("Sockets are not enabled. Use enableSockets() to enable.");
        if (!this.socketServer)
            console.warn("A socket.io server does not exist for this server. Resolving...");
            this.createSocketServer();

        return this.socketServer;
    }

    /**
     * Sets the function that will be called from any route.
     */
    public setGlobalHandler(handler: RequestHandler) {
        this.globalHandler = handler;   
    }

    /**
     * Lets you add another function to handle the server. This would be useful
     * for handling the server in seperate files.
     */
    public execute(func: (server: PostExpressServer, customParameters?: any) => any, customParameters?: any[]) {
        func(this, customParameters);
    }

    /**
     * Wrapper for Express.use()
     * @param handlers The handlers for the server to use.
     */
    public use(handlers: RequestHandler[]) {
        this.expressRouter.use(handlers);
    }
    
    /**
     * Returns the active in-memory session of the request provided (req)
     * @param req The request object
     */
    public getSessionFromRequest(req: Request) {
        let session = Sessions.get(req);
        return session;
    }

    public setSession(req: Request, sessionData: any) {
        Sessions.set(req, sessionData);
        let session = Sessions.get(req);
        return session;
    }
}

export default PostExpressServer;