import keygen from "../keygen.js";
import getAPIKey from "../api_key.js";

export async function create(req, res) {
    const { product_id } = req.params;
    const api_key = await getAPIKey();
    const product = await keygen.getProduct(api_key, product_id);
    res.render("create_policy", { product });
}

export async function handle_create(req, res) {
    const { product_id } = req.params;
    const api_key = await getAPIKey();
    const product = await keygen.getProduct(api_key, product_id);

    const { data } = req.body;
    try {
        const attributes = JSON.parse(data);
        const policy = await keygen.createPolicy(api_key, product.id, attributes);
        return res.redirect("/product/" + product.id);
    } catch (e) {
        return res.render("create_policy", { error: "JSON 数据无效", data, product });
    }
}

export async function show(req, res) {
    try {
        const { policy_id } = req.params;
        const api_key = await getAPIKey();
        const policy = await keygen.getPolicy(api_key, policy_id);
        res.render("policy", { policy });
    } catch (e) {
        console.error("policies.show", e);
        res.status(500).send("Keygen API error: " + (e && e.message ? e.message : String(e)));
    }
}
