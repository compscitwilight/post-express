/**
 * Entry point for the post-express renderer.
 */

import { Response, PostExpressServer } from "../";
import RenderParameters from "../dist/interfaces/RenderParameters";

let Stylesheets = new Array<String>();

/**
 * Converts a Buffer object to a string.
 */
export function convertBuffer(buffer: Buffer) {
    return buffer.toString();
}

/**
 * Breaks text into an array of strings for each line ending in "\n".
 * @param txt Text.
 */
export function breakdownLines(txt: string) {
    return txt.split(/\n/);
}

/**
 * Renders raw HTML, along with params that can be passed to certain elements in the page.
 * @param res The response object that was generated in the handler.
 * @param raw The raw HTML code to be rendered.
 * @param params Optional parameters that lets you pass data to the front-end.
 * @returns 
 */
export function render(server: PostExpressServer, res: Response, raw: string | Buffer, params?: RenderParameters[], specificStylesheets?: string[]) {
    let stringRaw: string;
    if (typeof raw !== "string")
        stringRaw = convertBuffer(raw);
    else
        stringRaw = raw;

    let lines = breakdownLines(stringRaw);

    function getElementById(id: string) {
        let element = "";
        for (var i = 0; i < lines.length; i++) {
            let line = lines[i];
            if (line.includes(`id="${id}"`)) {
                element = line;
            }
        }
        return element;
    }

    function setElementValue(element: string, newVal: string) {
        let val = element.split(">")[1].split("<")[0];
        val = newVal;

        // rebuilding the element
        let openingPart = element.split(">")[0] + ">";
        let closingPart = "<" + element.split("<")[2];
        let newElement = `${openingPart}${val}${closingPart}`;

        // rebuilding stringRaw
        let lines = breakdownLines(stringRaw);
        lines[lines.indexOf(element)] = newElement;

        let characters = stringRaw.split("");
        let rebuild = characters.map((char: string) => {
            let nextCharacter = characters[characters.indexOf(char) + 1]
            if (char == ">" && nextCharacter !== "<") {
                console.log("yes");
                console.log(char);
                console.log(nextCharacter);
            }
            return char;
        });

        stringRaw = String(lines);
    }

    // doing all of the parameter functionality if
    // some params were passed
    params?.forEach((param) => {
        if (!param) return;

        let element = getElementById(param.elementId);
        if (!element) {
            console.warn(`Cannot complete post-express rendering because an element with the ID of "${param.elementId}" does not exist.`);
            return
        }
        console.log(param.value);
        setElementValue(element, param.value);
    })

    // adding stylesheets
    for (var i = 0; i < Stylesheets.length; i++) {

    }

    if (specificStylesheets) {
        for (var i = 0; i < specificStylesheets.length; i++) {
            let code = specificStylesheets[i];

        }
    }

    // socket.io client script
    if (server.socketsEnabled) {
        let scriptSrc = "https://cdn.socket.io/4.5.4/socket.io.min.js";
        let socketIoScript = `<script src="${scriptSrc}" defer></script>`;
        stringRaw += socketIoScript;
    }

    res.send(stringRaw);
}

/**
 * Lets you add additional stylesheets to the page.
 * @param css Raw CSS code.
 */
export function addStylesheet(css: string) {
    Stylesheets.push(css);
}