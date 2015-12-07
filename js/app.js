var app = angular.module("alpukat", [
    'ngMaterial',
    'ui.router',
    'ngSanitize',
    'ngCsv',
    'ngMap',
    'ngTable',
    'ngStorage',
    'underscore',
    'uiGmapgoogle-maps',
    'ngCsvImport',
    'angular-loading-bar',
]);

app.constant('config', {
    url: 'http://zcodeapi.herokuapp.com/api'
        // url: 'http://localhost:3002/api'
});

app.constant('key', {
	user: 'user',
	token: 'token'
})

app.config(function($stateProvider, $urlRouterProvider, $httpProvider) {
    $stateProvider.state('home', {
        url: '/',
        templateUrl: 'tpl/home.html'
    })

    .state('customer', {
        url: '/customer',
        templateUrl: 'tpl/customer.html'
    })

    .state('gardu', {
        url: '/gardu',
        templateUrl: 'tpl/gardu.html'
    })

    .state('inspect', {
        url: '/inspect',
        templateUrl: 'tpl/inspect.html'
    })

    .state('login', {
        url: '/login',
        controller: 'LoginCtrl',
        templateUrl: 'tpl/login.html'
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

app.controller('AppCtrl', function($scope, $window, $state, $localStorage, key, AuthSvc) {
    $scope.token = $localStorage.token;
    $scope.share = {
    	isLogged: $scope.token != null
    };
    $scope.gohome = function() {
        $scope.share.subtitle = null;
        $state.go('home');
    }
    $scope.logout = function (){
    	AuthSvc.logout().then(function (){
    		$localStorage.$reset();
    		$state.go('home');
    		$scope.share.isLogged = false;
    	});
    }
});

app.controller('HomeCtrl', function($scope, $state) {
    $scope.share.menu = 'home';
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
