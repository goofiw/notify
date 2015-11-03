'use strict';

angular.module('notify', [
  'ui.router',
  'ngResource'
])
  .config(function ($stateProvider, $urlRouterProvider, $httpProvider) {
    $urlRouterProvider.otherwise('/login');

    $stateProvider
      .state('upload', {
        url:'/',
        templateUrl: 'app/file-upload/upload.html',
        controller: 'UploadCtrl',
        controllerAs: 'uploadCtrl',
        resolve: {auth: auth}
      })
      .state('members', {
        url: '/',
        templateUrl: 'app/members/members.html',
        controller: 'MembersCtrl',
        controllerAs: 'membersCtrl',
        resolve: {auth: auth}
      })
      .state('upload.show', {
        url:'/showmembers',
        templateUrl: 'app/file-upload/member-table.html',
        resolve: {auth: auth}
      })
      .state('login', {
        url:'/login',
        templateUrl: 'app/login/login.tmpl.html',
        controller: 'LoginCtrl',
        controllerAs: 'login'
      })
      .state('notify', {
        url:'/notify',
        templateUrl: 'app/notify/notify.tmpl.html',
        controller: 'NotifyCtrl',
        controllerAs:'ctrl',
        resolve: {authenticate: auth}
      });

      var token = $("meta[name=\"csrf-token\"]").attr("content")

      // include token in $httpProvider default headers
      $httpProvider.defaults.withCredentials = true;
      $httpProvider.defaults.headers.common['X-CSRF-TOKEN'] = token
      $httpProvider.interceptors.push('AuthInterceptor')

      //authentication
      function auth($q, UserService, $state, $timeout) {
        console.log('wtf')
        return UserService.isAuthorized().then(function(data) {
          console.log('data in auth', data);
          if (data.status === 403) {
            $state.go('login')
          } else {
            return true;
          }
        }); 
      }
    })
    .run(function ($rootScope, $state, UserService) {
      // $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, error){
      //   event.preventDefault();
      //   // UserService.isAuthorized();
      // });
    });

