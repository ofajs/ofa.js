import "./static-server.js";
import open, { apps } from "open";

await open("http://127.0.0.1:3348/test/test-app.html", { app: { name: apps.chrome } });
