app.controller('GarduCtrl', function($scope, $state, $mdDialog, $sce, ngTableParams, GarduSvc, _) {
    $scope.query = "";
    $scope.share.subtitle = "Gardu";
    $scope.share.ref = "gardu";
    $scope.state = $state;
    $scope.selectedGardus = [];
    $scope.rowsizes = [5, 10, 20];

    $scope.map = {
        center: {
            latitude: 45,
            longitude: -73
        },
        zoom: 8
    };

    $scope.query = "";
    var selectall = false;
    $scope.xyz = function (){
    	selectall = !selectall;
    	for (var i in $scope.tableParams.data) {
    	    var x = $scope.tableParams.data[i];
    	    x.selected = selectall;
    	}
    }
    

    $scope.search = function() {
        $scope.tableParams.reload()
    }

    $scope.highlight = function(text) {
        var search = $scope.query;
        if (!search) {
            return $sce.trustAsHtml(text);
        }
        return $sce.trustAsHtml(text.replace(new RegExp(search, 'gi'), '<span class="highlightedText">$&</span>'));
    };

    $scope.select = function(gardu) {
        $scope.gardu = gardu;
        if ($scope.state.current.name === "gardu.map")
            $scope.selectedGardus.push(gardu);
        if ($scope.state.current.name === "gardu.grid")
            $scope.gardus.map(function(c) {
                if (c.idpel !== gardu.idpel) {
                    c.selected = false;
                }
            });
    }

    $scope.garduDetail = function(ev) {
    	var gardus = [];
    	for (var i in $scope.tableParams.data) {
    	    var x = $scope.tableParams.data[i];
    	    if (x.selected) gardus.push(x);
    	}
        $mdDialog.show({
                controller: DialogController,
                templateUrl: 'tpl/gardu.dialog.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                resolve: {
                    param: function() {
                        return {
                        	gardus: gardus
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

    $scope.inspectDetail = function(gardu, ev) {
        $mdDialog.show({
            controller: GarduInspectController,
            templateUrl: 'tpl/gardu.inspect.dialog.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            resolve: {
                param: function() {
                    return {
                        gardu: gardu
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
            GarduSvc.count().then(function(n) {
                params.total(n.data.count);
                var limit = params.count();
                var offset = (params.page() - 1) * limit;
                GarduSvc.search($scope.query, offset, limit).then(function(res) {
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

app.filter('garduFilter', function(GarduSvc) {
    return function(items, props) {
        if (!angular.isArray(items)) return items;
        GarduSvc.search(props).then(function(res) {
            return res.data;
        }, function() {
            return items;
        });
    }
});

function DialogController($scope, $mdDialog, param) {
    $scope.gardu = angular.copy(param.gardu);
    $scope.gardus = param.gardus;
    $scope.close = function() {
        $mdDialog.cancel();
        // $mdDialog.hide('answer');
    };
}


function GarduInspectController($scope, $mdDialog, InspectSvc, param){
		InspectSvc.searchByMeterno(param.gardu.meterno).then(function (res){
			console.log(res.data);
			$scope.inspects = res.data;
		})
	    $scope.gardu = angular.copy(param.gardu);
	    $scope.close = function() {
	        $mdDialog.cancel();
	    };	
}