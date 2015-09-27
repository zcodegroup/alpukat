app.controller('InspectCtrl', function($scope, $state, $mdDialog, $sce, ngTableParams, InspectSvc) {
    $scope.query = "";
    $scope.share.subtitle = "Inspect";
    $scope.share.ref = "inspect";
    $scope.state = $state;
    $scope.selectedInspects = [];
    $scope.rowsizes = [5, 10, 20];

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

    $scope.getType = function (n){
    	return n == 0 ? "Gardu" : "Pelanggan";	
    }

    $scope.highlight = function(text) {
        var search = $scope.query;
        if (!search) {
            return $sce.trustAsHtml(text);
        }
        return $sce.trustAsHtml(text.replace(new RegExp(search, 'gi'), '<span class="highlightedText">$&</span>'));
    };

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
                InspectSvc.search($scope.query, offset, limit).then(function(res) {
                    $defer.resolve(res.data);
                    // $defer.resolve(filtered.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                });
            });
        }
    });
});