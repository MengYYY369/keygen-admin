import keygen from "../keygen.js";
import getAPIKey from "../api_key.js";

export async function index(req, res) {
    try {
        const api_key = await getAPIKey();
        const products = await keygen.getProducts(api_key);
        res.render("products", { products: products || [] });
    } catch (e) {
        console.error("products.index", e);
        res.status(500).send("Keygen API error: " + (e && e.message ? e.message : String(e)));
    }
}

export async function handle_create(req, res) {
    try {
        const { name } = req.body;
        if (!name || name.trim().length === 0) {
            return res.render("create_product", { error: "Name is required" });
        }
        const api_key = await getAPIKey();
        const product = await keygen.createProduct(api_key, { name });
        res.redirect("/product/" + product.id);
    } catch (e) {
        console.error("products.handle_create", e);
        res.status(500).send("Keygen API error: " + (e && e.message ? e.message : String(e)));
    }
}

export async function show(req, res) {
    try {
        const { product_id } = req.params;
        const api_key = await getAPIKey();
        const product = await keygen.getProduct(api_key, product_id);
        const policies = await keygen.getPolicies(api_key, product_id);
        const licenses = await keygen.getLicenses(api_key, product_id);
        res.render("product", { product, policies, licenses });
    } catch (e) {
        console.error("products.show", e);
        res.status(500).send("Keygen API error: " + (e && e.message ? e.message : String(e)));
    }
}
