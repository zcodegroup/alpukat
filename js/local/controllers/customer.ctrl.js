app.controller('CustomerCtrl', function($scope, $state, $mdDialog, $sce, ngTableParams, CustomerSvc, _) {
    $scope.share.menu = 'customer';
    $scope.query = "";
    $scope.state = $state;
    $scope.selectedCustomers = [];
    $scope.rowsizes = [5, 10, 20];
    $scope.customers = [];
    $scope.selected = [];
    $scope.headers = ["IDPEL", "Nama", "No Meter", "Alamat", "Tarif", "Daya", "Gardu", "Tiang", "Latitude", "Longitude"];

    CustomerSvc.getAll().then(function(res) {
        for (var i in res.data) {
            var o = res.data[i];
            var x = {
                idpel: o.idpel,
                name: o.name,
                meterno: o.meterno,
                address: o.address,
                tarif: o.tarif,
                daya: o.daya,
                gardu: o.gardu,
                tiang: o.tiang,
                latitude: o.latitude,
                longitude: o.longitude
            }
            $scope.customers.push(x);
        }
    })

    $scope.map = {
        center: {
            latitude: 45,
            longitude: -73
        },
        zoom: 13
    };

    var addSelected = function(c) {
        var exist = false;
        for (var i in $scope.selected) {
            var o = $scope.selected[i];
            if (o.id === c.id) {
                exist = true;
                break;
            }
        }
        if (!exist)
            $scope.selected.push(c);
    }

    var removeSelected = function(c) {
        for (var i in $scope.selected) {
            var o = $scope.selected[i];
            if (o.id === c.id) {
                $scope.selected.splice(i, 1);
                break;
            }
        }
    }

    var inSelected = function(c) {
        for (var i in $scope.selected) {
            var o = $scope.selected[i];
            if (o.id === c.id) return true;
        }
        return false;
    }

    $scope.query = "";
    var selectall = false;
    $scope.xyz = function() {
        selectall = !selectall;
        for (var i = $scope.tableParams.data.length - 1; i >= 0; i--) {
            var o = $scope.tableParams.data[i];
            o.selected = selectall;
            if (selectall) addSelected(angular.copy(o));
            else removeSelected(o);
        }
    }


    $scope.search = function() {
        $scope.tableParams.reload();
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
        customer.selected = !customer.selected;
        if (customer.selected) addSelected(customer);
        else removeSelected(customer);
    }

    $scope.customerImportDialog = function(ev) {
        $mdDialog.show({
            controller: CustomerImportController,
            templateUrl: 'tpl/customer.import.html',
            parent: angular.element(document.body),
            targetEvent: ev
        }).then(function(answer) {
            $scope.alert = 'You said the information was "' + answer + '".';
        }, function() {
            $scope.alert = 'You cancelled the dialog.';
        });
    }

    $scope.customerSelectedDialog = function(ev) {
        var customers = $scope.selected;
        $mdDialog.show({
            controller: CustomersDialogController,
            templateUrl: 'tpl/customer.selected.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            resolve: {
                param: function() {
                    return {
                        customers: customers
                    };
                }
            }
        }).then(function(answer) {
            $scope.alert = 'You said the information was "' + answer + '".';
        }, function() {
            $scope.alert = 'You cancelled the dialog.';
        });
    }

    $scope.customerDetail = function(ev) {
        var customers = $scope.selected;
        $mdDialog.show({
            controller: MapDialogController,
            templateUrl: 'tpl/customer.map.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            resolve: {
                param: function() {
                    return {
                        customers: customers
                    };
                }
            }
        }).then(function(answer) {
            $scope.alert = 'You said the information was "' + answer + '".';
        }, function() {
            $scope.alert = 'You cancelled the dialog.';
        });
    }

    $scope.inspectDetail = function(customer, ev) {
        $mdDialog.show({
            controller: CustomerInspectController,
            templateUrl: 'tpl/customer.inspect.html',
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

    $scope.customerNumber = 0;

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
                $scope.customerNumber = n.data.count;
                params.total(n.data.count);
                var limit = params.count();
                var offset = (params.page() - 1) * limit;
                CustomerSvc.search($scope.query, offset, limit).then(function(res) {
                    for (var i in res.data) {
                        var o = res.data[i];
                        o.selected = inSelected(o);
                    }
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
        if (i == $scope.customers.length - 1) {
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

function CustomersDialogController($scope, $mdDialog, InspectSvc, param) {
    $scope.customers = param.customers;
    $scope.close = function() {
        $mdDialog.cancel();
    };
}


function CustomerImportController($scope, $mdDialog, CustomerSvc, ngTableParams){
	$scope.customers = [];
	$scope.$watch('customers', function (newval, oldval){
		$scope.tableImport.data = newval;
		$scope.tableImport.reload();
		console.log($scope.tableImport)
	});
	$scope.tableImport = new ngTableParams({
	    page: 1,
	    count: 5,
	    sorting: {
	        name: 'asc'
	    }
	}, {
	    total: 0, // length of data
	    getData: function($defer, params) {
	        $defer.resolve($scope.customers);
	    }
	});

	$scope.import = function (){
		CustomerSvc.import($scope.customers).then(function (res){
			console.log(res);
			alert("Berhasil import");
		}, function (res){
			console.log(res);
			alert("Gagal import");
		})
		$mdDialog.cancel();
	}

	$scope.close = function(){
		$mdDialog.cancel();
	}
}