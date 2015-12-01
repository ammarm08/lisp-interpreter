angular.module('app.main', [])
.controller('MainController', ['$scope', 'Lisper', function($scope, Lisper) {
  //stuff
  $scope.expression = '';
  $scope.syntax = '';

  $scope.eval = function() {
    $scope.syntax = Lisper.interpret($scope.expression);
  };


}]);