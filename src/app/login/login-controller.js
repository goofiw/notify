angular.module('notify')
.controller('LoginCtrl', ["$scope", "$state", "UserService", "LocalService", function($scope, $state, UserService, LocalService) {
 $scope.userLogin = function() {
  var credentials = $scope.user;
  UserService.login(credentials).then(function(data) {
    console.log('data after login', data)
    if(data.status == 403) {
      alert("invalid login credentials")
    } else if (data.status == 200) {
      var token = data.data.jwt;
      LocalService.set("token", token);
      $state.go('members');
    } else {
      alert("something went wrong, check your internet connection or contact will")
    }
  });
 }
 $scope.signup = function() {
  var info = $scope.user;
  UserService.signUp(info).then(function(data) {
    console.log('data after signup', data);
    console.log(data.data, data.data.jwt);
    if (data.data.jwt) {
      var token = data.data.jwt
      LocalService.set("token", token);
    }
  });
 }
}])