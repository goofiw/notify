angular.module('notify')
.factory('AuthInterceptor', ['LocalService', function(LocalService) {
  return {
    request: function(config) {
      var token;
      if (LocalService.get('token')) {
        token = LocalService.get('token')
        config.headers.Authorization = token;
      }
      return config;
    },
    responseError: function(response) {
      if (response.status === 401 || response.status === 403) {
        LocalService.unset('token');
        return response;
      }
    }
  };
}]);