(function() {
    var mainModule = angular.module("mainModule");
    mainModule.factory("InventoryFactory", function itemsFactory(InventoryItemsFactory) {

        var agedBrieConfig = {
            name: "Aged Brie",
            qualityValue: {
                enhanceBy: function enhanceBy() {
                    return 1;
                }
            }
        };

        var sulfurasConfig = {
            name: "Sulfuras the Legendary Sword",
            isLegendary: true,
            minSellIn: 1, //Because this item "never has to be sold", sell-in value should never reach 0
            qualityValue: {
                enhanceBy: function enhanceBy() {
                    return 0;
                }
            }
        };

        var backstagePassConfig = {
            name: "Backstage Pass",
            qualityValue: {
                enhanceBy: function enhanceBy(sellInValue) {
                    var factor = null;
                    if (sellInValue <= 5) {
                        factor = 3;
                    } else if (sellInValue <= 10) {
                        factor = 2;
                    }

                    return factor;
                },
                degradeBy: function degradeBy(sellInValue) {
                    var result;
                    if (sellInValue === 0) {
                        result = {
                            setQualityTo: 0
                        };
                    }
                    return result;
                }
            }
        };

        var conjuredShieldConfig = {
            name: "Conjured Shield",
            degradationFactorRelativeToNormal: 2
        };

        var regularShieldConfig = {
            name: "Regular Shield",
        };

        var agedBrie = InventoryItemsFactory.create(agedBrieConfig);
        var sulfuras = InventoryItemsFactory.create(sulfurasConfig);
        var backstagePass = InventoryItemsFactory.create(backstagePassConfig);
        var conjuredShield = InventoryItemsFactory.create(conjuredShieldConfig);
        var regulardShield = InventoryItemsFactory.create(regularShieldConfig);

        var inventory = [agedBrie, sulfuras, backstagePass, conjuredShield, regulardShield];

        return {
            inventory: inventory
        };
    });
})();