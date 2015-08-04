var app = angular.module("alpukat", ['ngMaterial', 'ui.router', 'ngMap']);

app.config(function($stateProvider, $urlRouterProvider, $httpProvider) {
    $stateProvider
        .state('home', {
            url: '/',
            templateUrl: 'tpl/home.html'
        })

    .state('customer', {
        url: '/customer',
        templateUrl: 'tpl/customer.html'
    })

    .state('test', {
        url: '/test',
        templateUrl: 'tpl/test.html'
    });
    $urlRouterProvider.otherwise('/');
});


app.config(function($mdThemingProvider) {
    $mdThemingProvider.theme('default')
        .primaryPalette('green')
        .accentPalette('orange');
});

app.config(function($mdIconProvider) {
    $mdIconProvider
        .iconSet('social', 'img/icons/sets/social-icons.svg', 24)
        .iconSet('device', 'img/icons/sets/device-icons.svg', 24)
        .iconSet('communication', 'img/icons/sets/communication-icons.svg', 24)
        .defaultIconSet('img/icons/sets/core-icons.svg', 24);
});

app.controller('AppCtrl', function($scope) {
	$scope.share = {};
});

app.controller('CustomerCtrl', function($scope, $mdDialog) {
    $scope.map = {
        center: {
            latitude: 45,
            longitude: -73
        },
        zoom: 8
    };
    var imagePath = 'img/60.jpeg';

    $scope.customers = [];
    var a = {
        name: 'Min Li Chan',
        meterno: "98898988"
    }
    for (var i = 0; i < 10; i++) {
        $scope.customers.push(angular.copy(a));
    }

    $scope.customerDetail = function (){
        $mdDialog.show(
          $mdDialog.alert()
            .title('Secondary Action')
            .content('Secondary actions can be used for one click actions')
            .ariaLabel('Secondary click demo')
            .ok('Neat!')
            .targetEvent(event)
        );
    }
})
