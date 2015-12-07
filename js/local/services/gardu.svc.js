app.factory('GarduSvc', function($http, $q, _, config, $localStorage) {
    return {
        get: function() {
            return $http.get('js/local/data.js');
        },

        search: function(q, offset, limit) {
            var d = $q.defer();
            var url = config.url + "/AlpukatGardu?";
            var filter = "filter[where][gardu][regexp]=" + q + "/i&";
            var limit = "filter[limit]=" + limit + "&";
            var offs = "filter[offset]=" + offset + "&";
            var order = "filter[order]=gardu&";
            var token = "access_token=" + $localStorage;
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
            var url = config.url + "/AlpukatGardu?";
            var order = "filter[order]=gardu&";
            var token = "access_token=" + $localStorage;
            return $http.get(url + order + token);
        },

        import: function(data) {
            var url = config.url + '/AlpukatGardu/BatchCreate';
            return $http.post(url, data);
        },

        delete: function(id) {
            var url = config.url + '/AlpukatGardu/' + id;
            return $http.delete(url);
        },

        count: function() {
            var url = config.url + "/AlpukatGardu/count?";
            var token = "access_token=" + $localStorage;
            return $http.get(url + token);
        },

        search2: function(q) {
            var d = $q.defer();
            $http.get('js/local/data.js').then(function(res) {
                var flag = q == undefined || q == "";
                var out = flag ? res.data.splice(0, 100) :
                    _.filter(res.data, function(o) {
                        q = q.toLowerCase();
                        var a = o.name.toLowerCase();
                        var b = o.meterno.toLowerCase();
                        return a.indexOf(q) != -1 || b.indexOf(q) != -1;
                    });
                d.resolve({
                    data: out.splice(0, 100)
                });
            }, function(e) {
                d.reject(e);
            });
            return d.promise;
        },

        getLastEdited: function (){
        	var url = config.url + "/AlpukatGardu?filter[order]=edited%20desc&filter[offset]=0&filter[limit]=1&";
        	var token = "access_token=" + $localStorage.token;
        	return $http.get(url + token);
        }
    }
});
