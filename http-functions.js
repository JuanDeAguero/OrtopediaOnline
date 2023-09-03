import { ok } from 'wix-http-functions';
import wixData from "wix-data";
import wixStoresBackend from "wix-stores-backend";

export async function post_updateInventory(request) {
    
    const requestBody = await request.body.json()
    const { items } = await wixData.query("Stores/Variants").find();
    
    for (let i = 0; i < items.length; i++) {
        
        const stock = requestBody[items[i].sku];
        if (!stock) continue;
        
        // calculate the difference between new stock value and the current stock quantity
        const difference = stock - items[i].stock.quantity;
        
        // if the difference is positive, increment the inventory with that difference
        if (difference > 0) {
            wixStoresBackend.incrementInventory([{
                variantId: items[i].variantId,
                productId: items[i].productId,
                incrementBy: difference
            }]);
        }
        // if the difference is negative, decrement the inventory with the absolute value of that difference
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