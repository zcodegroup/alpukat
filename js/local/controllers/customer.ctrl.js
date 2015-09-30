app.controller('CustomerCtrl', function($scope, $state, $mdDialog, $sce, ngTableParams, CustomerSvc, _) {
    $scope.query = "";
    $scope.state = $state;
    $scope.selectedCustomers = [];
    $scope.rowsizes = [5, 10, 20];

    $scope.map = {
        center: {
            latitude: 45,
            longitude: -73
        },
        zoom: 13
    };

    $scope.query = "";
    var selectall = false;
    $scope.xyz = function() {
        selectall = !selectall;
        for (var i in $scope.tableParams.data) {
            var x = $scope.tableParams.data[i];
            x.selected = selectall;
        }
    }


    $scope.search = function() {
        $scope.tableParams.reload()
    }

    $scope.getLocation = function(lat, lon) {
        if (lat === "" || lon === "")
            return "";
        else return lat + ", " + lon;
    }

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

    $scope.customerDetail = function(ev) {
        var customers = [];
        for (var i in $scope.tableParams.data) {
            var x = $scope.tableParams.data[i];
            if (x.selected) customers.push(x);
        }
        $mdDialog.show({
                controller: MapDialogController,
                templateUrl: 'tpl/customer.dialog.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                resolve: {
                    param: function() {
                        return {
                            customers: customers
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

    $scope.inspectDetail = function(customer, ev) {
        $mdDialog.show({
            controller: CustomerInspectController,
            templateUrl: 'tpl/customer.inspect.dialog.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            resolve: {
                param: function() {
                    return {
                        customer: customer
                    };
                }
            }
        });
    }

    $scope.tableParams = new ngTableParams({
        page: 1, // show first page
        count: 5, // count per page
        sorting: {
            name: 'asc' // initial sorting
        }
    }, {
        total: 0, // length of data
        getData: function($defer, params) {
            CustomerSvc.count().then(function(n) {
                params.total(n.data.count);
                var limit = params.count();
                var offset = (params.page() - 1) * limit;
                CustomerSvc.search($scope.query, offset, limit).then(function(res) {
                    console.log('result', res.data)
                    $defer.resolve(res.data);
                    // $defer.resolve(filtered.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                });
            });
        }
    });

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

function MapDialogController($scope, $mdDialog, param) {
    $scope.customers = param.customers;
    $scope.markers = [];
    var centerX = {};
    for (var i = $scope.customers.length - 1; i >= 0; i--) {
        var c = $scope.customers[i];
    	if (i == $scope.customers.length-1){
    		centerX.latitude = c.latitude;
    		centerX.longitude = c.longitude;
    	}
        $scope.markers.push({
            latitude: c.latitude,
            longitude: c.longitude,
            title: c.name,
            id: i
        });
    };
    console.log(centerX)
    $scope.map = {
        center: centerX,
        zoom: 6
    };


    $scope.close = function() {
        $mdDialog.cancel();
        // $mdDialog.hide('answer');
    };
}

function CustomerInspectController($scope, $mdDialog, InspectSvc, param) {
    InspectSvc.searchByMeterno(param.customer.meterno).then(function(res) {
        $scope.inspects = res.data;
    })
    $scope.customer = angular.copy(param.customer);
    $scope.close = function() {
        $mdDialog.cancel();
    };
}
