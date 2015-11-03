angular.module('notify')
.factory('AuthInterceptor', ['LocalService', function(LocalService) {
  return {
    request: function(config) {
      var token;
      if (LocalService.get('sMToken')) {
        token = JSON.parse(LocalService.get('sMToken')).token;
      }
      if (token) {
        config.headers.Authorization = 'Bearer ' + token;
      }
      return config;
    },
    responseError: function(response) {
      if (response.status === 401 || response.status === 403) {
        LocalService.unset('sMToken');
        return response;
      }
    }
  };
}]);