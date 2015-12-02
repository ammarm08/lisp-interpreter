(function() {
    'use strict';

    angular
        .module('app.main', [])
        .controller('MainController', ['$scope', 'Lisper', mainController]);

    function mainController($scope, Lisper) {
      $scope.expression = '';
      $scope.console = '';

      $scope.eval = function() {
        $scope.console += '=> ' + Lisper.interpret($scope.expression) + '\n';
        $scope.expression = '';
      };

      $scope.clear = function() {
        $scope.console = '';
      }
    }
})();