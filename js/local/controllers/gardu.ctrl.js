app.controller('GarduCtrl', function($scope, $state, $mdDialog, $q, $sce, ngTableParams, GarduSvc, _, $filter, $localStorage) {
    $scope.share.menu = 'gardu';
    $scope.query = "";
    $scope.state = $state;
    $scope.selectedGardus = [];
    $scope.rowsizes = [5, 10, 20];
    $scope.headers = ["Gardu", "No Meter", "Kapasitas Trafo (kVA)", "CT Terpasang", "Penyulang", "Latitude", "Longitude", "Last Update"];
    $scope.gardus = [];

    var loadGardus = function() {
    	var deferred = $q.defer();
        var temp = [];
        GarduSvc.getAll().then(function(res) {
            for (var i in res.data) {
                var o = res.data[i];
                var x = {
                    gardu: o.gardu,
                    meterno: o.meterno,
                    trafoCapacity: o.trafoCapacity,
                    ctTerpasang: o.ctTerpasang,
                    penyulang: o.penyulang,
                    latitude: o.latitude,
                    longitude: o.longitude,
                    edited: $filter('date')(o.edited, 'yyyy/MM/dd HH:mm:ss')
                }
                temp.push(x);
                deferred.resolve(temp);
            }
        });
        return deferred.promise;
    }

    $scope.map = {
        center: {
            latitude: 45,
            longitude: -73
        },
        zoom: 8
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

    $scope.clear = function(){
    	GarduSvc.clear().then(function (){
    		$scope.tableParams.reload();
    		alert('Berhasil membersihkan data gardu');
    	})
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
                controller: GarduMapController,
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

    $scope.delete = function(id) {
        var a = confirm("Apakah Anda yakin akan menghapus data gardu?");
        if (a) GarduSvc.delete(id).then(function(res) {
            alert("Sukses menghapus data gardu");
            $scope.tableParams.reload();
        }, function(res) {
            alert("Gagal menghapus data gardu");
        });
    }

    $scope.garduImportDialog = function(ev) {
        $mdDialog.show({
            controller: GarduImportController,
            templateUrl: 'tpl/gardu.import.html',
            parent: angular.element(document.body),
            targetEvent: ev
        }).then(function(answer) {
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

    $scope.garduNumber = 0;

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
                $scope.garduNumber = n.data.count;
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

function GarduMapController($scope, $mdDialog, param) {
    $scope.gardus = param.gardus;
    $scope.markers = [];
    var centerX = {};
    for (var i = $scope.gardus.length - 1; i >= 0; i--) {
        var c = $scope.gardus[i];
        if (i == $scope.gardus.length - 1) {
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


function GarduInspectController($scope, $mdDialog, InspectSvc, param) {
    InspectSvc.searchByMeterno(param.gardu.meterno).then(function(res) {
        console.log(res.data);
        $scope.inspects = res.data;
    })
    $scope.gardu = angular.copy(param.gardu);
    $scope.close = function() {
        $mdDialog.cancel();
    };
}

function GarduImportController($scope, $mdDialog, GarduSvc, ngTableParams) {
    $scope.gardus = [];
    $scope.$watch('gardus', function(newval, oldval) {
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
            $defer.resolve($scope.gardus);
        }
    });

    $scope.import = function() {
        GarduSvc.import($scope.gardus).then(function(res) {
            console.log(res);
            alert("Berhasil import");
        }, function(res) {
            console.log(res);
            alert("Gagal import");
        })
        $mdDialog.cancel();
    }

    $scope.close = function() {
        $mdDialog.cancel();
    }
}
