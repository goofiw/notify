angular.module('notify')
.factory('MemberService', ['$http', '$resource', function($http, $resource){
  var members = [];
  return {
    addMembers: function(newMembers){
      console.log(newMembers);
      return $http.post('/api/addmembers', 
        {data:newMembers}
        );

    },
    getMembers: function() {
      console.log('getting members');
      return $http.get('/api/members')
      .success(function(data){
        console.log('get all members data', data);
      })
      .error(function(err){
        throw err;
      })
    },
    addMember: function(member){
      return $http.post('/api/addmember',
        {data:member}
        ).success(function(data) {
          return data.data;
        })
        .error(function(err){
          throw err;
        });
    },
    removeMember: function(member) {

    },
    updateMeber: function(member) {

    }
  }
}])