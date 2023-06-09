import wixData from "wix-data";
import wixStoresBackend from "wix-stores-backend";
import { ok } from 'wix-http-functions';

// Handles HTTP POST requests
export async function post_updateInventory(request) {

    // Parse the body of the HTTP request as JSON
    const requestBody = await request.body.json()

    // Query the "Stores/Variants" collection in the Wix database and storing the results in the 'items' variable
    const { items } = await wixData.query("Stores/Variants").find();
    
    // Loop through all items from the database
    for (let i = 0; i < items.length; i++) {
        
        // Get the new stock value from the request body using the item SKU
        const stock = requestBody[items[i].sku];
        
        // If no stock value found for this SKU, skip to the next iteration
        if (!stock) continue;
        
        // Calculate the difference between new stock value and the current stock quantity
        const difference = stock - items[i].stock.quantity;
        
        // If the difference is positive, increment the inventory with that difference
        if (difference > 0) {
            wixStoresBackend.incrementInventory([{
                variantId: items[i].variantId,
                productId: items[i].productId,
                incrementBy: difference
            }]);
        } 
        // If the difference is negative, decrement the inventory with the absolute value of that difference
        else if (difference < 0) {
            wixStoresBackend.decrementInventory([{
                variantId: items[i].variantId,
                productId: items[i].productId,
                decrementBy: difference * -1
            }]);
        }
    }
    
    // Create a response object
    let response = {};
    
    // Add a body to the response indicating that the inventory update has been successful
    response.body = {"wix": "Inventory Updated"};
    
    // Return an HTTP 200 OK response, with the previously created response body
    return ok(response);
}