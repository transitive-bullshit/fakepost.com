
angular.module('fakepost').controller('TwitterViewTweetCtrl', function (
  $scope, $state, $stateParams, $http, $timeout, flash)
{
  if ($stateParams.tweet) {
    $scope.loading = false
    $scope.tweet = $stateParams.tweet
  } else {
    $scope.loading = true

    $http.get('/api/twitter/tweet/' + $stateParams.id)
      .then(function (response) {
        $scope.safeApply(function () {
          $scope.tweet = response.data
          $scope.loading = false
        })
      }, function () {
        flash.error = "Unable to load tweet."
        $scope.safeApply(function () { $scope.loading = false })
        $state.go('twitter.home')
      })
  }
});

