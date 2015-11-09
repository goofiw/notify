angular.module('notify')
.controller('MembersCtrl', ['$scope', 'MemberService', function($scope, MemberService){
  $scope.allMembers = [];
  $scope.getAllMembers = function() {
    MemberService.getMembers().then(function(data) {
      $scope.allMembers = data.data;
      // $scope.$apply();
      console.log('all members', $scope.allMembers)
    })
  }
  $scope.getAllMembers();
  $scope.addNewMember = function() {
    console.log('new menber', $scope.member)
    MemberService.addMember($scope.member).then(function(data) {
      console.log('data returned from adding new member', data.data);
      $scope.allMembers.push(data.data);
    });
  }
}])