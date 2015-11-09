app.factory('CustomerSvc', function($http, $q, _, config, localStorageService, key) {
	var tokenId = localStorageService.get(key.token);
    return {
        search: function(q, offset, limit) {
            var d = $q.defer();
            var url = config.url + "/AlpukatCustomer?";
            var filter = "filter[where][name][regexp]=" + q + "/i&";
            var limit = "filter[limit]=" + limit + "&";
            var offs = "filter[offset]=" + offset + "&";
            var order = "filter[order]=name&";
            var token = "access_token=" + tokenId;
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
            var token = "access_token=" + tokenId;
            return $http.get(url + order + token);
        },

        count: function() {
            var url = config.url + "/AlpukatCustomer/count?";
            var token = "access_token=" + tokenId;
            return $http.get(url + token);
        },

        import: function (data){
        	var url = config.url + '/AlpukatCustomer/BatchCreate?access_token=' + tokenId;
        	return $http.post(url, data);
        },

        delete: function (id){
        	var url = config.url + '/AlpukatCustomer/' + id + '?access_token=' + tokenId;
        	return $http.delete(url);
        }
    }
});
