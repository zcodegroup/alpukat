app.controller('CustomerCtrl', function($scope, $state, $mdDialog, $sce, CustomerSvc) {
    $scope.query = "";
    $scope.share.subtitle = "Pelanggan";
    $scope.share.ref = "customer";
    $scope.state = $state;
    $scope.selectedCustomers = [];

    $scope.map = {
        center: {
            latitude: 45,
            longitude: -73
        },
        zoom: 8
    };

    $scope.query = "";
    $scope.search = function() {
        CustomerSvc.search($scope.query).then(function(res) {
            $scope.customers = res.data;
        });
    }
    $scope.search();

    $scope.highlight = function(text) {
        var search = $scope.query;
        if (!search) {
            return $sce.trustAsHtml(text);
        }
        return $sce.trustAsHtml(text.replace(new RegExp(search, 'gi'), '<span class="highlightedText">$&</span>'));
    };

    $scope.select = function(customer) {
        $scope.customer = customer;
        if ($scope.state.current.name === "customer.map")
            $scope.selectedCustomers.push(customer);
        if ($scope.state.current.name === "customer.grid")
            $scope.customers.map(function(c) {
                if (c.idpel !== customer.idpel) {
                    c.selected = false;
                }
            });
    }

    $scope.customerDetail = function(customer, ev) {
        $mdDialog.show({
                controller: DialogController,
                templateUrl: 'tpl/dialog.customer.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                resolve: {
                    param: function() {
                        return {
                            customer: customer
                        };
                    }
                }
            })
            .then(function(answer) {
                $scope.alert = 'You said the information was "' + answer + '".';
            }, function() {
                $scope.alert = 'You cancelled the dialog.';
            });
    }

    $scope.inspects = [{
        result: "Normal",
        date: new Date(),
        kwh: 200
    }, {
        result: "Normal",
        date: new Date(),
        kwh: 180
    }, {
        result: "Tidak Dipakai",
        date: new Date(),
        kwh: 170
    }];

});

app.filter('customerFilter', function(CustomerSvc) {
    return function(items, props) {
        if (!angular.isArray(items)) return items;
        CustomerSvc.search(props).then(function(res) {
            return res.data;
        }, function() {
            return items;
        });
    }
});

function DialogController($scope, $mdDialog, param) {
    $scope.customer = angular.copy(param.customer);
    $scope.close = function() {
        $mdDialog.cancel();
        // $mdDialog.hide('answer');
    };
}
