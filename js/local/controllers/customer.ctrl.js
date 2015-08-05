app.controller('CustomerCtrl', function($scope, $mdDialog, $sce, CustomerSvc) {
    $scope.query = "";

    $scope.share.subtitle = "Pelanggan";
    $scope.share.ref = "customer";

    $scope.map = {
        center: {
            latitude: 45,
            longitude: -73
        },
        zoom: 8
    };
    var imagePath = 'img/60.jpeg';

    $scope.query = "";
    $scope.search = function() {
        CustomerSvc.search($scope.query).then(function(res) {
            $scope.customers = res.data;
            console.log($scope.customers);
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

});


// app.filter('customerFilter', function() {
//     return function(items, props) {
//         var out = [];
//         if (angular.isArray(items)) {
//             items.forEach(function(item) {
//                 var itemMatches = false;

//                 var keys = Object.keys(props);
//                 for (var i = 0; i < keys.length; i++) {
//                     var prop = keys[i];
//                     var text = props[prop].toLowerCase();
//                     if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
//                         itemMatches = true;
//                         break;
//                     }
//                 }

//                 if (itemMatches) {
//                     out.push(item);
//                     // if (out.length > 100) return out;
//                 }
//             });
//         } else {
//             out = items;
//         }
//         return out;
//     }
// });

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
