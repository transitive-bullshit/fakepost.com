
angular.module('fakepost').controller('TwitterCreateTweetCtrl', function (
  $scope, $stateParams, $http, flash)
{
  $scope.tweet = {
    user: {
      username: "fisch0920",
      fullname: "Travis Fischer",
      avatar: "https://pbs.twimg.com/profile_images/547714403684986880/apxt8hY7_bigger.png",
      verified: true
    },
    stats: {
      retweets: 5,
      favorites: 7,
      favoritedBy: []
    },
    status: "Create your own fake twitter post now! Check it out at www.fakepost.com",
    timestamp: "5:03 AM - 25 Dec 2014"
  }

  for (var i = 0; i < 10; ++i) {
    $scope.tweet.stats.favoritedBy.push(faker.image.avatar())
  }

  $scope.refreshAvatar = function (index) {
    $scope.safeApply(function () {
      $scope.tweet.stats.favoritedBy[index] = faker.image.avatar()
    })
  }

  $scope.editing = {
    username: false,
    status: false,
    retweets: false,
    favorites: false,
    timestamp: false,
  }

  $scope.toggleEditing = function (key) {
    $scope.safeApply(function () {
      for (var k in $scope.editing) {
        $scope.editing[k] = false
      }

      $scope.editing[key] = !$scope.editing[key]
      console.log(key, $scope.editing[key])
    })
  }
});

