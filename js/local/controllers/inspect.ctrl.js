app.controller('InspectCtrl', function($scope, $state, $filter, $mdDialog, $sce, ngTableParams, InspectSvc) {
	$scope.share.menu = 'inspect';
    $scope.query = "";
    $scope.share.subtitle = "Inspect";
    $scope.share.ref = "inspect";
    $scope.state = $state;
    $scope.selectedInspects = [];
    $scope.rowsizes = [5, 10, 20];
    $scope.types = ["Pelanggan", "Gardu"];
    $scope.type = $scope.types[0];
    $scope.ntype = $scope.types[1];
    $scope.isCustomer = true;
    $scope.inspectCustomers = [];
    $scope.inspectGardus = [];

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

    $scope.getType = function(n) {
        return n == 0 ? "Gardu" : "Pelanggan";
    }

    $scope.highlight = function(text) {
        var search = $scope.query;
        if (!search) {
            return $sce.trustAsHtml(text);
        }
        return $sce.trustAsHtml(text.replace(new RegExp(search, 'gi'), '<span class="highlightedText">$&</span>'));
    };

    $scope.changeInspect = function(){
    	$scope.isCustomer = !$scope.isCustomer;
    	$scope.type = $scope.isCustomer ? "Pelanggan" : "Gardu";
    	$scope.ntype = $scope.isCustomer ? "Gardu" : "Pelanggan";
    	$scope.tableParams.reload();
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
            InspectSvc.count().then(function(n) {
                params.total(n.data.count);
                var limit = params.count();
                var offset = (params.page() - 1) * limit;
                var type = $scope.type === "Pelanggan" ? 1 : 0;
                InspectSvc.search($scope.query, offset, limit, type).then(function(res) {
                    $defer.resolve(res.data);
                });
            });
        }
    });

    $scope.getHeaders = function (){
		if ($scope.type == "Pelanggan")
			return ["Tanggal", "IDPEL", "No Meter", "Nama", "Alamat", "Tarif", "Daya", "Hasil Pemeriksaan", "kWh"];
		else
			return ["Tanggal", "No Meter", "Gardu", "Kapasitas Trafo (kVA)", "Penyulang", "Hasil Pemeriksaan", "kWh"];
    }

    $scope.getData = function (){
    	if ($scope.type == "Pelanggan")
    		return $scope.inspectCustomers;
    	else
    		return $scope.inspectGardus;
    }

    $scope.getFileName = function (){
    	return $scope.type === "Pelanggan" ? "pemeriksaan-pelanggan.csv" 
    		: "pemeriksaan-gardu.csv";
    }

    InspectSvc.getAll(1).then(function (res){
    	for (var i in res.data){
    		var o = res.data[i];
    		var x = {
    			date: $filter('date')(o.date, 'MM/dd/yyyy HH:mm'),
    			idpel: o.customer.idpel,
    			meterno: o.customer.meterno,
    			name: o.customer.name,
    			address: o.customer.address,
    			tarif: o.customer.tarif,
    			daya: o.customer.daya,
    			result: o.result,
    			kwh: o.kwh
    			// date: $filter('date')(date, format, timezone)
    		}
    		$scope.inspectCustomers.push(x);
    	}
    });

    InspectSvc.getAll(0).then(function (res){
    	for (var i in res.data){
    		var o = res.data[i];
    		var x = {
    			date: $filter('date')(o.date, 'MM/dd/yyyy HH:mm'),
    			meterno: o.gardu.meterno,
    			name: o.gardu.gardu,
    			trafoCapacity: o.gardu.trafoCapacity,
    			penyulang: o.gardu.penyulang,
    			result: o.result,
    			kwh: o.kwh
    			// date: $filter('date')(date, format, timezone)
    		}
    		$scope.inspectGardus.push(x);
    	}
    });
});