angular.module('notify')
.controller('LoginCtrl', ["$scope", function($scope) {
 $scope.login = function() {
  var credentials = $scope.user;
  UserService.login(credentials);
 }
}])