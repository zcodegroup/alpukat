app.factory('AuthSvc', function($http, config, $localStorage) {
    return {
        login: function(data) {
            return $http.post(config.url + '/Account/login', data);
        },

        logout: function(){
        	return $http.post(config.url + '/Account/logout?access_token=' + $localStorage.token);
        }
    }
});
