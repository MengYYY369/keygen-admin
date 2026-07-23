import dotenv from "dotenv-extended";
dotenv.load({
    silent: true,
    errorOnMissing: false,
    errorOnExtra: false,
    includeProcessEnv: true,
});

// ponytail: Vercel /tmp is ephemeral but fine — auth is Basic, session only for flash
if (process.env.VERCEL && !process.env.SESSIONS_DIR) {
    process.env.SESSIONS_DIR = "/tmp/sessions";
}
if (!process.env.SECRET) {
    process.env.SECRET = "keygen-admin-dev-secret";
}

import path from "path";
import { fileURLToPath } from "url";
// force NFT to include view engine (express loads it dynamically)
import "ejs";
import Hummingbird from "@themaximalist/hummingbird.js";
import * as controllers from "./controllers/index.js";
import * as middleware from "./middleware.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const hummingbird = new Hummingbird();
// views live next to api/ on Vercel; fall back to repo-relative
const viewsDir = process.env.VERCEL
    ? path.join(process.cwd(), "views")
    : path.join(__dirname, "../views");
hummingbird.app.set("views", viewsDir);
hummingbird.app.use(middleware.authorize);

hummingbird.get("/", "index");
hummingbird.get("/products", controllers.products.index);
hummingbird.get("/products/create", "create_product");
hummingbird.post("/products/create", controllers.products.handle_create);
hummingbird.get("/product/:product_id", controllers.products.show);
hummingbird.get("/product/:product_id/policies/create", controllers.policies.create);
hummingbird.post("/product/:product_id/policies/create", controllers.policies.handle_create);
hummingbird.get("/product/:product_id/licenses/create", controllers.licenses.create);
hummingbird.post("/product/:product_id/licenses/create", controllers.licenses.handle_create);
hummingbird.get("/license/:license_id", controllers.licenses.show);
hummingbird.get("/license/:license_id/delete", controllers.licenses.handle_delete);

hummingbird.app.post("/webhooks/paddle", controllers.paddle.handle_webhook);

// Vercel: export app; local: listen
if (!process.env.VERCEL) {
    await hummingbird.start();
}

export default hummingbird.app;
