import { setupServer } from "msw/node";
import { handlersForm } from "./handler";

export const server = setupServer(...handlersForm);
