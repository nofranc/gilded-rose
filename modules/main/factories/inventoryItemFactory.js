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
    mainModule.factory("InventoryItemsFactory", function itemsFactory($log) {

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

                if (!isString(config.name) || isStringEmpty(config.name)) {
                    $log.error("Cannot create object. Must input name.");
                    return null;
                }

                item.name = config.name;
                item.degradationFactorRelativeToNormal = config.degradationFactorRelativeToNormal || 1;
                item.minSellIn = config.minSellIn;
                item.minQuality = config.minQuality;
                item.enhanceBy = config.qualityValue.enhanceBy;
                item.degradeBy = config.qualityVaue.degradeBy;
                item.resetValues();
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
                    var minSellIn = this.minSellIn || 0;

                    if (numOfDays > this.sellInValue) {
                        this.sellInValue = minSellIn;
                    } else if (this.sellInValue > minSellIn) {
                        this.sellInValue -= numOfDays == null ? 1 : numOfDays;
                    }

                    return this.sellInValue;
                },
                /**
                 * Note(s):
                 * - Must be invoked when appropriate changes have been made to this.sellInValue
                 */
                updateQualityValue: function updateQualityValue() {
                    var minQuality = this.minQuality || 0;
                    if (this.qualityValue > 0) {
                        var defaultDegradationValue = REGULAR_DEGRADATION_FACTOR * this.degradationFactorRelativeToNormal;

                        var enhanceByValue = 0;
                        //based on assumption that "for many items, quality degrades by one per day"
                        var degradeByValue = this.sellInValue === 0 ?
                            defaultDegradationValue * 2 :
                            defaultDegradationValue;

                        var degradeByConfig;

                        if (isFunction(this.enhanceBy)) {
                            enhanceByValue = this.enhanceBy(this.sellInValue);
                        }

                        if (isFunction(this.degradeBy)) {
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
                            this.qualityValue = minQuality;
                        }
                    }

                    return this.qualityValue;
                },
                resetValues() {
                    //max: 2 weeks (14 days), min: 0
                    this.sellInValue = randomNum(this.minSellIn || 0, MAX_SELL_IN_VALUE);
                    //max: 50, min: 0
                    this.qualityValue = randomNum(this.minQuality || 0, MAX_QUALITY_VALUE);
                }
            }
        };

        return InventoryItem;

        //Following functions be moved to common file if more generically used (or use a library like lodash)
        function isFunction(param) {
            return Object.prototype.toString.call(param) == "[object Function]";
        }

        function isString(param) {
            return Object.prototype.toString.call(param) === "[object String]"
        }

        function randomNum(min, max) {
            var maxInclusive = max + 1;
            return Math.ceil(Math.random() * (maxInclusive - min)) + min;
        }

        function isStringEmpty(str) {
            return isString(str) && (str == null || str.trim().length === 0);
        }
    });
})();