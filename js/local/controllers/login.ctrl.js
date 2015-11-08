app.controller('LoginCtrl', function ($scope, $state, $window, localStorageService, AuthSvc, key){
	$scope.share.menu = 'login';
	$scope.form = {};
	$scope.login = function (){
		AuthSvc.login($scope.form).then(function (res){
			localStorageService.set(key.token, res.data.id);
			$scope.form = {};
			$state.go('home');
			$window.location.reload();
		}, function (res){
			alert(res.data.error.message);
		})
	}
})