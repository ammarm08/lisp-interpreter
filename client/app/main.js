angular.module('app.main', [])
.controller('MainController', ['$scope', 'Interpreter', function($scope, Interpreter) {
  //stuff
  $scope.expression = '';
  $scope.syntax = '';

  $scope.eval = function() {
    $scope.syntax = Interpreter.parse($scope.expression);
  };


}]);