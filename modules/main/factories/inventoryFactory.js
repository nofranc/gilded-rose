(function() {
    var mainModule = angular.module("mainModule");
    mainModule.factory("InventoryFactory", function itemsFactory(_, InventoryItemsFactory) {
        var configurationList = [{
            name: "Aged Brie",
            qualityValue: {
                enhanceBy: function enhanceBy() {
                    return 1;
                }
            }
        }, {
            name: "Sulfuras the Legendary Sword",
            isLegendary: true,
            minSellIn: 1, //Because this item "never has to be sold", sell-in value should never reach 0
            qualityValue: {
                enhanceBy: function enhanceBy() {
                    return 0;
                }
            }
        }, {
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
        }, {
            name: "Conjured Shield",
            degradationFactorRelativeToNormal: 2
        }, {
            name: "Regular Shield",
        }];

        var inventory = _.map(configurationList, function createInstance(configuration) {
            return InventoryItemsFactory.create(configuration);
        })

        return {
            inventory: inventory
        };
    });
})();