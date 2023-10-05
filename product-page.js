import wixData from "wix-data";
import wixWindow from "wix-window";

$w.onReady(() => {
    $w("#productPage").getProduct().then((product) => {
        queryInventoryItems(product);
    });
});

function queryInventoryItems(product) {
    wixData.query("Stores/InventoryItems").find().then((results) => {
        const items = results._items;
        for (let i = 0; i < items.length; i++) {
            let item = items[i];
            if (items[i].productId == product._id) {
                let variants = item.variants;
                let oneSoldOut = false;
                let oneAvailable = false;
                for (let j = 0; j < variants.length; j++) {
                    let variant = variants[j];
                    if (variant.inStock) {
                        oneAvailable = true;
                    } else {
                        oneSoldOut = true;
                    }
                }
                displayElements(oneSoldOut, oneAvailable);
                return;
            }
        }
    });
}

function displayElements(oneSoldOut, oneAvailable) {
    if (oneSoldOut && !oneAvailable) {
        if (wixWindow.formFactor === "Mobile") {
            $w("#mobileTxtAgotado").show();
            $w("#mobileBoxAgotago").show();
            $w("#mobileIconAgotado").show();
        } else {
            $w("#txtAgotado").show();
            $w("#txtEnvioExpress").show();
        }
    } else if (oneSoldOut) {
        if (wixWindow.formFactor === "Mobile") {
            $w("#mobileTxtParcialmente").show();
            $w("#mobileTxtEnvio").show();
            $w("#mobileBoxAgotago").show();
            $w("#mobileIconAgotado").show();
        } else {
            $w("#txtParcialmente").show();
            $w("#txtEnvioExpress").show();
        }
    }
}