angular.module('app', [
  'app.main',
  'app.services',
  'ngRoute'
])
.config(function ($routeProvider, $httpProvider) {

  $routeProvider
    .when('/', {
      redirectTo: '/main'
    })
    .when('/main', {
      templateUrl: 'app/main.html',
      controller: 'MainController'
    })
    .otherwise({
      redirectTo: '/main'
    });

});