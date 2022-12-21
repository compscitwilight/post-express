/**
 * StateConsole.ts is a utility that prints the state (CREATE, DELETE, CHANGE) along with a custom
 * message.
 * 
 * This utility is mostly used in the backend of post-express, thought it is completely fine to use
 * it in projects that are utilizing post-express.
 */

let ResetCode = "\x1b[0m";
let CreateCode = "\x1b[32m"; // green
let ChangeCode = "\x1b[33m"; // yellow
let DeleteCode = "\x1b[31m"; // red

export enum StateConsoleState {
    CREATE,
    DELETE,
    CHANGE
}

export function StateConsole(state: StateConsoleState, msg: string) {
    let consolemsg = "";
    switch (state) {
        case (StateConsoleState.CHANGE):
            consolemsg = `[${ChangeCode}CHANGE${ResetCode}] ~ ${msg}`;
            break;
        case (StateConsoleState.CREATE):
            consolemsg = `[${CreateCode}CREATE${ResetCode}] ~ ${msg}`;
            break;
        case (StateConsoleState.DELETE):
            consolemsg = `[${DeleteCode}DELETE${ResetCode}] ~ ${msg}`;
            break;
    }
    console.log(consolemsg);
}