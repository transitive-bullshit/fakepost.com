
angular.module('fakepost').controller('TwitterCreateTweetCtrl', function (
  $scope, $stateParams, $http, flash)
{
  $scope.avatars = []
  for (var i = 0; i < 10; ++i) {
    $scope.avatars.push(faker.image.avatar())
  }
});

