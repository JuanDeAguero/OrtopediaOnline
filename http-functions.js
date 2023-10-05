import { ok } from 'wix-http-functions';
import wixData from "wix-data";
import wixStoresBackend from "wix-stores-backend";

export async function post_updateInventory(request) {
    const requestBody = await request.body.json()
    const { items } = await wixData.query("Stores/Variants").find();
    for (let i = 0; i < items.length; i++) {
        const stock = requestBody[items[i].sku];
        if (!stock) continue;
        const difference = stock - items[i].stock.quantity;
        if (difference > 0) {
            wixStoresBackend.incrementInventory([{
                variantId: items[i].variantId,
                productId: items[i].productId,
                incrementBy: difference
            }]);
        }
        else if (difference < 0) {
            wixStoresBackend.decrementInventory([{
                variantId: items[i].variantId,
                productId: items[i].productId,
                decrementBy: difference * -1
            }]);
        }
    }
    let response = {};
    response.body = {"wix": "Inventory Updated"};
    return ok(response);
}