import Express, { Request, RequestHandler, Response } from "express"
import RouteParams from "../interfaces/RouteParams";
import { StateConsole, StateConsoleState } from "../utils/StateConsole";
import PostExpressRoute from "./Route";
import { routeFromHTTPMethod } from "../utils/routeFromHTTPMethod";
import RouteGroup from "./RouteGroup";
import ServerDBData from "../interfaces/ServerDBData";
import * as socketio from "socket.io";
import { Server } from "http";

/**
 * A post-express server.
 */
class PostExpressServer {
    private expressRouter: Express.Express = Express();
    private httpServer: Server = new Server(this.expressRouter);
    private socketsEnabled: boolean = false;
    private socketServer?: socketio.Server;
    public routes: PostExpressRoute[] = [];
    public db?: ServerDBData;
    public constructor(
        public readonly port: number
    ) {
        //let Router = Express();
        //this.expressRouter = Router;
        //this.routes = [];
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
                    return
                }
            }
        
            routeFromHTTPMethod(Method, ExpressRouter, Path, Handler);
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

        routes.forEach((route: PostExpressRoute) => {
            if (route.params.path.startsWith("/"))
                route.params.path.replace("/", "");

            let existingRoute = this.routes.find((exRoute: PostExpressRoute) => {
                return exRoute.params.path == route.params.path;
            })
            
            this.Route(new Array<RouteParams>(route.params), (req: Request, res: Response) => {

            })
            /*
            Server.all(route.params.path, (req: Request, res: Response) => {
                res.status(404);
            });
            */
            let handler: RequestHandler = route.params.handler;
            if (sharedHandler)
                handler = sharedHandler;
            
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
        
        let httpServer = new Server(this.expressRouter);
        let socketServer = new socketio.Server(httpServer);
        this.socketsEnabled = true;
        this.socketServer = socketServer;
        StateConsole(StateConsoleState.CHANGE, "Enabled sockets on server.");
    }

    /**
     * Creates a socket server. Only for use in exceptions, such as when a socket.io server is not existent.
     */
    private createSocketServer() {
        let socketServer = new socketio.Server(this.httpServer);
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
        
    }
}

export default PostExpressServer;