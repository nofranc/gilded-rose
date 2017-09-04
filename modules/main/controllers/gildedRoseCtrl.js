(function() {
    var mainModule = angular.module("mainModule");
    mainModule.controller("MainCtrl", function(_, InventoryFactory) {
        var vm = this;

        vm.inventory = InventoryFactory.inventory;
        vm.updateAll = updateAll;
        vm.reset = reset;

        function updateAll() {
            _.forEach(InventoryFactory.inventory, function update(inventoryItem) {
                inventoryItem.update();
            });
        }

        function reset() {
            _.forEach(InventoryFactory.inventory, function update(inventoryItem) {
                inventoryItem.resetValues();
            });
        }
    });
})();