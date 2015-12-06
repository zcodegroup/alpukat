app.controller('LoginCtrl', function ($scope, $state, $window, $localStorage, AuthSvc, key){
	$scope.share.menu = 'login';
	$scope.form = {};
	$scope.login = function (){
		AuthSvc.login($scope.form).then(function (res){
			$localStorage.token = res.data.id;
			$scope.form = {};
			$state.go('home');
			$scope.share.isLogged = true;
		}, function (res){
			console.log(res);
			alert(res.data.error.message);
		})
	}
})