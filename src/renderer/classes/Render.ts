import { render } from "../index";
import RenderParameters from "../../dist/interfaces/RenderParameters";
import { Response, PostExpressServer } from "../../index";

/**
 * PERRender is a class that contains methods and data that is returned after
 * a page is rendered through the post-express renderer (PER)
 */
class PERRender {
    constructor(
        private readonly server: PostExpressServer,
        public readonly res: Response,
        public readonly raw: string,
        private renderParams: RenderParameters[]
    ) {};

    /**
     * Reloads the render.
     */
    public Refresh() {
        
    }

    /**
     * Adds a render parameter, and then reloads the render.
     * @param param The RenderParameters object.
     */
    public addRenderParam(param: RenderParameters) {
        this.renderParams.push(param);
        this.Refresh();
    }
}

export default PERRender;