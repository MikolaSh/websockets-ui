import { App } from "./src/app.ts";
import { httpServer } from "./src/server/frontServer.ts";

const HTTP_PORT = 8181;

new App();
console.log(`Start static http server on the ${HTTP_PORT} port!`);
httpServer.listen(HTTP_PORT);
