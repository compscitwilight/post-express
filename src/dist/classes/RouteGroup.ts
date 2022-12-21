import PostExpressRoute from "./Route";

class RouteGroup {
    public constructor(
        public readonly path: string,
        public readonly routes: PostExpressRoute[]
    ) {}
}

export default RouteGroup