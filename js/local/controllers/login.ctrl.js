app.controller('LoginCtrl', function ($scope, localStorageService, AuthSvc){
	$scope.share.menu = 'login';
	$scope.form = {};
	$scope.login = function (){
		AuthSvc.login($scope.form).then(function (res){
			console.log('berhasil', res);
		}, function (res){
			console.log(res);
		})
	}
})