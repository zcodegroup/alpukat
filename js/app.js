// var app = angular.module("alpukat", ['ngAnimate', 'ngSanitize', 'toaster', 'flow', 'ngReallyClickModule', 'ngTable', 'ui.select',
//     "ui.router", "LocalStorageModule", "ui.bootstrap", "angular.filter", "fcsa-number", "angular-uuid", "underscore"
//     ]);

var app = angular.module("alpukat", ['ngMaterial', 'ui.router']);

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

app.controller('AppCtrl', function($scope) {

})
