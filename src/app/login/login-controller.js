angular.module('notify')
.controller('LoginCtrl', ["$scope", "UserService", function($scope, UserService) {
 $scope.userLogin = function() {
  var credentials = $scope.user;
  UserService.login(credentials);
 }
 $scope.signup = function() {
  var info = $scope.user;
  UserService.signUp(info);
 }
}])