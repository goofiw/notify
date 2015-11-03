angular.module('notify')
.controller('MembersCtrl', ['$scope', 'MemberService', function($scope, MemberService){
  $scope.getAllMembers = function() {
    $scope.allMembers = MemberService.getMembers();
  }
}])