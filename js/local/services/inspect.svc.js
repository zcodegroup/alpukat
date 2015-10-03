app.factory('InspectSvc', function($http, $q, _) {
    var baseUrl = "http://zcodeapi.herokuapp.com/api/";
    return {
        search: function(q, offset, limit, type) {
            var url = baseUrl + "AlpukatInspect?";
            var filter = "filter[where][meterno][regexp]=" + q + "/i&";
            var filter2 = "filter[where][type]=" + type + "&";
            var limit = "filter[limit]=" + limit + "&";
            var offs = "filter[offset]=" + offset + "&";
            var gardu = "filter[include]=gardu&";
            var customer = "filter[include]=customer&";
            var order = "filter[order]=datetime%20DESC&&";
            var token = "access_token=MWob5MXT64yRBImh07tN7hEZEF3W2brt82n1UXDQXmIJZV6av06RACA6PVS7EscJ";
            return $http.get(url + filter + filter2 + offs + gardu + customer + limit + order + token);
        },

        count: function() {
            var url = baseUrl + "AlpukatInspect/count?";
            var token = "access_token=MWob5MXT64yRBImh07tN7hEZEF3W2brt82n1UXDQXmIJZV6av06RACA6PVS7EscJ";
            return $http.get(url + token);
        },

        searchByMeterno: function(q) {
            var url = baseUrl + "AlpukatInspect?";
            var filter = "filter[where][meterno][regexp]=" + q + "/i&";
            var limit = "filter[limit]=5&";
            var order = "filter[order]=datetime%20DESC&";
            var token = "access_token=MWob5MXT64yRBImh07tN7hEZEF3W2brt82n1UXDQXmIJZV6av06RACA6PVS7EscJ";
            return $http.get(url + filter + limit + order + token);
        }

    }
});
