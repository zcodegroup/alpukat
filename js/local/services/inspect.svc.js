app.factory('InspectSvc', function($http, $q, _) {
    return {
        search: function(q, offset, limit){
        	var d = $q.defer();
        	var url = "http://zcodeapi.herokuapp.com/api/AlpukatInspect?";
        	var filter = "filter[where][meterno][regexp]="+q+"/i&";
        	var limit = "filter[limit]=" + limit + "&";
        	var offs = "filter[offset]=" + offset + "&";
        	var order = "filter[order]=datetime%20DESC&&";
        	var token = "access_token=MWob5MXT64yRBImh07tN7hEZEF3W2brt82n1UXDQXmIJZV6av06RACA6PVS7EscJ";
        	$http.get(url+filter+offs+limit+order+token).then(function (res){
        		console.log(res);
        		d.resolve({
        			data: res.data
        		})
        	}, function (e){
        		d.reject(e);
        	});
        	return d.promise;
        },

        count: function (){
        	var url = "http://zcodeapi.herokuapp.com/api/AlpukatInspect/count?";
        	var token = "access_token=MWob5MXT64yRBImh07tN7hEZEF3W2brt82n1UXDQXmIJZV6av06RACA6PVS7EscJ";
        	return $http.get(url+token);
        },

        searchByMeterno: function(q){
        	var url = "http://zcodeapi.herokuapp.com/api/AlpukatInspect?";
        	var filter = "filter[where][meterno][regexp]="+q+"/i&";
        	var limit = "filter[limit]=5&";
        	var order = "filter[order]=datetime%20DESC&";
        	var token = "access_token=MWob5MXT64yRBImh07tN7hEZEF3W2brt82n1UXDQXmIJZV6av06RACA6PVS7EscJ";
        	return $http.get(url+filter+limit+order+token);
        }
        
    }
});
