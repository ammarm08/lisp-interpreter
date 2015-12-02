
(function() {
    'use strict';

    angular
        .module('app', ['app.main', 'app.services', 'ngRoute'])
        .config(appConfig)

    function appConfig($routeProvider, $httpProvider) {
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
    }
})();