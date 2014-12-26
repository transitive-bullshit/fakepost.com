
angular.module('fakepost').controller('TwitterCtrl', function (
  $scope, $stateParams)
{
  $scope.screenshot = !!$stateParams.screenshot
});

