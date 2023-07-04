import wixData from "wix-data";
import wixWindow from "wix-window";

$w.onReady(() => {
    
    $w("#productPage").getProduct()
    .then((product) => {
        
        wixData.query("Stores/InventoryItems")
        .find()
        .then((results) => {
            
            const items = results._items;
            
            // Loop over each item in the inventory
            for (let i = 0; i < items.length; i++) {
                let item = items[i];
                
                // If the item's product ID matches the current page's product
                if (items[i].productId == product._id) {
                    
                    let variants = item.variants;
                    let oneSoldOut = false;
                    let oneAvailable = false;
                    
                    // Check if any variant is in stock or sold out
                    for (let j = 0; j < variants.length; j++) {
                        let variant = variants[j];
                        
                        if (variant.inStock) {
                            oneAvailable = true;
                        }
                        else {
                            oneSoldOut = true;
                        }
                    }
                    
                    // If all variants are sold out...
                    if (oneSoldOut && !oneAvailable) {
                        if(wixWindow.formFactor === "Mobile") {
                            $w("#mobileTxtAgotado").show();
                            $w("#mobileBoxAgotago").show();
                            $w("#mobileIconAgotado").show();
                        } 
                        else {
                            $w("#txtAgotado").show();
                            $w("#txtEnvioExpress").show();
                        }
                    } 
                    
                    // If at least one variant is sold out...
                    else if (oneSoldOut) {
                        if(wixWindow.formFactor === "Mobile") {
                            $w("#mobileTxtParcialmente").show();
                            $w("#mobileTxtEnvio").show();
                            $w("#mobileBoxAgotago").show();
                            $w("#mobileIconAgotado").show();
                        } 
                        else {
                            $w("#txtParcialmente").show();
                            $w("#txtEnvioExpress").show();
                        }
                    }
                    
                    return;
                }
            }
        });
    });
});
