app.factory('CustomerSvc', function($http, $q, _, config) {
    return {
        search: function(q, offset, limit) {
            var d = $q.defer();
            var url = config.url + "/AlpukatCustomer?";
            var filter = "filter[where][name][regexp]=" + q + "/i&";
            var limit = "filter[limit]=" + limit + "&";
            var offs = "filter[offset]=" + offset + "&";
            var order = "filter[order]=name&";
            var token = "access_token=MWob5MXT64yRBImh07tN7hEZEF3W2brt82n1UXDQXmIJZV6av06RACA6PVS7EscJ";
            $http.get(url + filter + offs + limit + order + token).then(function(res) {
                d.resolve({
                    data: res.data
                })
            }, function(e) {
                d.reject(e);
            });
            return d.promise;
        },

        getAll: function() {
            var url = config.url + "/AlpukatCustomer?";
            var order = "filter[order]=name&";
            var token = "access_token=MWob5MXT64yRBImh07tN7hEZEF3W2brt82n1UXDQXmIJZV6av06RACA6PVS7EscJ";
            return $http.get(url + order + token);
        },

        count: function() {
            var url = config.url + "/AlpukatCustomer/count?";
            var token = "access_token=MWob5MXT64yRBImh07tN7hEZEF3W2brt82n1UXDQXmIJZV6av06RACA6PVS7EscJ";
            return $http.get(url + token);
        },

        import: function (data){
        	var url = config.url + '/AlpukatCustomer/BatchCreate';
        	return $http.post(url, data);
        },

        delete: function (id){
        	var url = config.url + '/AlpukatCustomer/' + id;
        	return $http.delete(url);
        }
    }
});
