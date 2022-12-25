/**
 * Entry point for the post-express renderer.
 */

import { Response } from "../";
import { readFileSync, writeFileSync } from "fs";

let CSS = new String(readFileSync("/root.css"));

export function render(res: Response, raw: string | Buffer) {
    
}

/**
 * Lets you customize the renderer's CSS with your own custom CSS.
 * NOTE: This doesn't actually edit "root.css" in /post-express/src/renderer, it sets a variable.
 * @param raw 
 */
export function overwriteCSSFile(raw: string) {
    CSS = raw;
}