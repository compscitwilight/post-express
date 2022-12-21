import RouteParams from "../interfaces/RouteParams";
import { Express, Request, Response } from "express";
import { StateConsole, StateConsoleState } from "../utils/StateConsole";

class PostExpressRoute {
    public constructor(
        public readonly app: Express,
        public readonly params: RouteParams
    ) {}

    public Delete() {
        let Params = this.params;
        let Path = Params.path;
        let Method = Params.method;
        let Handler = Params.handler;

        Handler = (req: Request, res: Response) => {
            res.status(404).sendFile("views/NotFound.html", {root: "../"});
        }

        this.app.get(Path, Handler);

        StateConsole(StateConsoleState.DELETE, `Deleted ${Method} route ${Path}`);
    }
}

export default PostExpressRoute;