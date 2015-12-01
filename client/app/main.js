angular.module('app.main', [])
.controller('MainController', ['$scope', 'Lisper', function($scope, Lisper) {
  //stuff
  $scope.expression = '';
  $scope.console = '';

  $scope.eval = function() {
    $scope.console += Lisper.interpret($scope.expression) + '\n';
    $scope.expression = '';
  };

  $scope.clear = function() {
    $scope.console = '';
  }


}]);