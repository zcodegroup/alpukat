var app = angular.module("alpukat", ['ngMaterial', 'ui.router', 'ngMap', 'underscore', 'angular-loading-bar']);

app.config(function($stateProvider, $urlRouterProvider, $httpProvider) {
    $stateProvider
        .state('home', {
            url: '/',
            templateUrl: 'tpl/home.html'
        })

    .state('customer', {
        url: '/customer',
        abstract: true,
        templateUrl: 'tpl/customer.html'
    })

    .state('customer.grid', {
        url: '/customer/grid',
        templateUrl: 'tpl/customer.grid.html',
    })

    .state('customer.map', {
        url: '/customer/map',
        templateUrl: 'tpl/customer.map.html'
    })

    .state('gardu', {
        url: '/gardu',
        abstract: true,
        templateUrl: 'tpl/gardu.html'
    })

    .state('gardu.grid', {
        url: '/gardu/grid',
        templateUrl: 'tpl/gardu.grid.html',
    })

    .state('gardu.map', {
        url: '/gardu/map',
        templateUrl: 'tpl/gardu.map.html'
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

app.controller('AppCtrl', function($scope, $state) {
    $scope.share = {};
    $scope.gohome = function() {
        $scope.share.subtitle = null;
        $state.go('home');
    }
});

app.filter('propsFilter', function() {
    return function(items, props) {
        var out = [];
        if (angular.isArray(items)) {
            items.forEach(function(item) {
                var itemMatches = false;

                var keys = Object.keys(props);
                for (var i = 0; i < keys.length; i++) {
                    var prop = keys[i];
                    var text = props[prop].toLowerCase();
                    if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
                        itemMatches = true;
                        break;
                    }
                }

                if (itemMatches) {
                    out.push(item);
                    // if (out.length > 100) return out;
                }
            });
        } else {
            out = items;
        }
        return out;
    }
});
