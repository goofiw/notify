angular.module('notify')
.factory('UserService', ['$http', '$state', function($http, $state){
  var login = function(credentials) {
    return $http.post('/api/login', credentials)
    .success(function(data) {
      return data.data;
    })
    .error(function(err){
      throw err;
    })
  }

  var signUp = function(credentials) {
    return $http.post('/api/signup', credentials)
    .success(function(data) {
      return data.data;
    })
    .error(function(err) {
      throw err;
    })
  }

  var isAuthorized = function() {
    return $http.get('/api/authcheck')
    .success(function(data) {
      console.log('auth success', data)
      return data;
    })
    .error(function(err) {
      console.log('auth fail')
      throw err;
    })
  }


  return {
    login: login,
    signUp:signUp,
    isAuthorized:isAuthorized
  }

}])