import wixData from "wix-data";
import wixWindow from "wix-window";

// Once the page is ready...
$w.onReady(() => {

    // Get the product details for the current page
    $w("#productPage").getProduct()
    .then((product) => {
        
        // Query the Wix database for inventory items
        wixData.query("Stores/InventoryItems")
        .find()
        .then((results) => {
            
            // Extract inventory items from results
            const items = results._items;
            
            // Loop over each item in the inventory
            for (let i = 0; i < items.length; i++) {
                let item = items[i];
                
                // If the item's product ID matches the current page's product
                if (items[i].productId == product._id) {
                    
                    // Extract the variants of the item
                    let variants = item.variants;
                    let oneSoldOut = false;
                    let oneAvailable = false;
                    
                    // Check if any variant is in stock or sold out
                    for (let j = 0; j < variants.length; j++) {
                        let variant = variants[j];
                        
                        // If a variant is in stock, set oneAvailable to true
                        if (variant.inStock) {
                            oneAvailable = true;
                        } 
                        // If a variant is sold out, set oneSoldOut to true
                        else {
                            oneSoldOut = true;
                        }
                    }
                    
                    // If all variants are sold out...
                    if (oneSoldOut && !oneAvailable) {
                        // If the user is using a mobile device...
                        if(wixWindow.formFactor === "Mobile") {
                            // Show the mobile sold out message, box, and icon
                            $w("#mobileTxtAgotado").show();
                            $w("#mobileBoxAgotago").show();
                            $w("#mobileIconAgotado").show();
                        } 
                        // If the user is not using a mobile device...
                        else {
                            // Show the sold out and express shipping messages
                            $w("#txtAgotado").show();
                            $w("#txtEnvioExpress").show();
                        }
                    } 
                    // If at least one variant is sold out...
                    else if (oneSoldOut) {
                        // If the user is using a mobile device...
                        if(wixWindow.formFactor === "Mobile") {
                            // Show the mobile partially sold out message, shipping info, box, and icon
                            $w("#mobileTxtParcialmente").show();
                            $w("#mobileTxtEnvio").show();
                            $w("#mobileBoxAgotago").show();
                            $w("#mobileIconAgotado").show();
                        } 
                        // If the user is not using a mobile device...
                        else {
                            // Show the partially sold out and express shipping messages
                            $w("#txtParcialmente").show();
                            $w("#txtEnvioExpress").show();
                        }
                    }
                    
                    // Exit the loop after checking inventory for the current product
                    return;
                }
            }
        });
    });
});