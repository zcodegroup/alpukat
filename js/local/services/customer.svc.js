app.factory('CustomerSvc', function($http, $q, _) {
    return {
        search: function(q, offset, limit){
        	var d = $q.defer();
        	var url = "http://zcodeapi.herokuapp.com/api/AlpukatCustomer?";
        	var filter = "filter[where][name][regexp]="+q+"/i&";
        	var limit = "filter[limit]=" + limit + "&";
        	var offs = "filter[offset]=" + offset + "&";
        	var order = "filter[order]=name&";
        	var token = "access_token=MWob5MXT64yRBImh07tN7hEZEF3W2brt82n1UXDQXmIJZV6av06RACA6PVS7EscJ";
        	console.log(url+filter+offs+limit+order+token);
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
        	var url = "http://zcodeapi.herokuapp.com/api/AlpukatCustomer/count?";
        	var token = "access_token=MWob5MXT64yRBImh07tN7hEZEF3W2brt82n1UXDQXmIJZV6av06RACA6PVS7EscJ";
        	return $http.get(url+token);
        }
    }
});
