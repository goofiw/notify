angular.module('notify')
.controller('LoginCtrl', ["$scope", "$state", "UserService", "LocalService", function($scope, $state, UserService, LocalService) {
 $scope.userLogin = function() {
  var credentials = $scope.user;
  UserService.login(credentials).then(function(data) {
    console.log('data after login', data)
    var token = data.data.jwt;
    LocalService.set("token", token);
    $state.go('members');
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