app.factory('AuthSvc', function($http, config) {
    return {
        login: function(data) {
            return $http.post(config.url + '/Account/login', data);
        }
    }
});
