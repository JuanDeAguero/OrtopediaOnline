import wixWindow from 'wix-window';

$w.onReady( () => {
    if (wixWindow.formFactor === "Mobile") {
        $w("#searchMobile").show();
        $w("#btnCategorias").show();
    }
});

$w("#btnCategorias").onClick( (event) => {
    $w("#menuContainer").open();
});