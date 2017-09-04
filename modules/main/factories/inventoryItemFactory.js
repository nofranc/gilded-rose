/**
 * InventoryItemsFactory generates a definition for class, InventoryItem.
 *
 * Configurations:
 *  The create functions takes in a single object input.
 *  
 *  Mandatory Fields:
 *      - "name" (string)
 *
 *  Optional Fields:
 *      - "degradationFactorRelativeToNormal" (integer, defaulted to 1): 
 *          - Used for items with degradation factors higher than normal items.
 *          - Given this value, the current degradation factor is the quotient of this value and REGULAR_DEGRADATION_FACTOR 
 *              (i.e. result will be by how much qualityValue is decreased)
 *      - "minSellIn" (integer)
 *      - "minQuality" (integer)
 *      - "qualityValue" (object): 
 *          - "enhanceBy" (function):
 *              - Given an integer (sellInValue), should return an integer, which will be by how much qualityValue will be increased
 *          - "degradeBy" (function): 
 *              - Given an integer (sellInValue), should return an object with two attributes: "isRelative" and "factor".
 *                  - "isRelative" (boolean, defaulted to false): 
 *                      - If true, quotient of "factor" and current degradation factor of object
 *                      - If false, qualityValue will decrease by "factor"
 *                  - "factor" (integer): in conjunction with "isRelative", determines by how much qualityValue will decrease
 *                  - "setQualityTo" (integer): sets qualityValue to this integer
 *
 * Usage:
 * var config = {
 *      name: "sampleLegendaryItem",
 *      degradationFactorRelativeToNormal: 2,
 *      qualityValue: {
 *          degradeBy: function degradeBy(sellInValue) {
 *              return 0;
 *          }   
 *      }
 * };
 * 
 * var sampleItem = InventoryItemsFactory.create(<configurationObject>);
 * 
 * By default (if enhanceBy and/or degradeBy functions aren't defined), qualityValue of item will degrade by
 *  REGULAR_DEGRADATION_FACTOR * config.degradationFactorRelativeToNormal. If we have, say a legendary item, 
 *  degradeBy must be defined with a function that only returns 0 (regardless of the sellInValue) so that 
 *  qualityValue will never decrease.
 * 
 */

(function() {
    var mainModule = angular.module("mainModule");
    mainModule.factory("InventoryItemsFactory", function itemsFactory(_, $log) {
        /*
         * Degradataion factor for regular items -- 
         *  For regular items, quality value diminishes be this value per day
         */
        var REGULAR_DEGRADATION_FACTOR = 1;
        var MAX_QUALITY_VALUE = 50;
        var MAX_SELL_IN_VALUE = 14;

        var InventoryItem = {
            create: function create(config) {
                var item = Object.create(this.prototype);

                if (config == null) {
                    $log.error("Cannot create object. Must define configurations.");
                    return null;
                }

                if (_.isEmpty(config.name)) {
                    $log.error("Cannot create object. Must input name.");
                    return null;
                }

                item.name = config.name;
                item.degradationFactorRelativeToNormal = config.degradationFactorRelativeToNormal || 1;
                item.minSellIn = config.minSellIn || 0;
                item.minQuality = config.minQuality || 0;
                item.enhanceBy = _.get(config, "qualityValue.enhanceBy");
                item.degradeBy = _.get(config, "qualityVaue.degradeBy");
                item.resetValues();

                return item;
            },
            prototype: {
                /**
                 * Updates sellInValue and qualityValue appropriately.
                 * 
                 * Parameters:
                 * - numOfDays: number of days to decrease this.sellInValue by
                 */
                update: function update(numOfDays) {
                    this.updateSellInValue(numOfDays);
                    this.updateQualityValue();
                },
                updateSellInValue: function updateSellInValud(numOfDays) {
                    if (numOfDays > this.sellInValue) {
                        this.sellInValue = this.minSellIn;
                    } else if (this.sellInValue > this.minSellIn) {
                        this.sellInValue -= numOfDays == null ? 1 : numOfDays;
                    }

                    return this.sellInValue;
                },
                /**
                 * Note(s):
                 * - Must be invoked when appropriate changes have been made to this.sellInValue
                 */
                updateQualityValue: function updateQualityValue() {
                    if (this.qualityValue > 0) {
                        var defaultDegradationValue = REGULAR_DEGRADATION_FACTOR * this.degradationFactorRelativeToNormal;

                        var enhanceByValue = 0;
                        //based on assumption that "for many items, quality degrades by one per day"
                        var degradeByValue = this.sellInValue === 0 ?
                            defaultDegradationValue * 2 :
                            defaultDegradationValue;

                        var degradeByConfig;

                        if (_.isFunction(this.enhanceBy)) {
                            enhanceByValue = this.enhanceBy(this.sellInValue);
                        }

                        if (_.isFunction(this.degradeBy)) {
                            degradeByConfig = this.degradeBy(this.sellInValue);
                            var setQualityTo = degradeByConfig.setQualityTo;
                            if (setQualityTo != null) {
                                this.qualityValue = setQualityTo;
                                return this.qualityValue;
                            } else {
                                degradeByValue = degradeByConfig.isRelative ?
                                    degradeByConfig.factor * defaultDegradationValue :
                                    degradeByConfig.factor;
                            }
                        }

                        if (enhanceByValue != null && degradeByValue != null) {
                            $log.error("Error in enhanceByValue and degradeByValue function definitions. Only one can return an integer given unique sellInValue.");
                        } else if (enhanceByValue != null) {
                            this.qualityValue += enhanceByValue;
                        } else if (this.qualityValue - degradeByValue > 0) {
                            this.qualityValue -= degradeByValue;
                        } else {
                            this.qualityValue = this.minQuality;
                        }
                    }

                    return this.qualityValue;
                },
                resetValues() {
                    //max: 2 weeks (14 days), min: 0
                    this.sellInValue = _.random(this.minSellIn, MAX_SELL_IN_VALUE);
                    //max: 50, min: 0
                    this.qualityValue = _.random(this.minQuality, MAX_QUALITY_VALUE);
                }
            }
        };

        return InventoryItem;
    });
})();