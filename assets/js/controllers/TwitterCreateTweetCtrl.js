
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
    status: "This just in: Russell Wilson is good.",
    timestamp: "5:03 AM - 25 Dec 2014"
  }

  for (var i = 0; i < 10; ++i) {
    $scope.tweet.stats.favoritedBy.push(faker.image.avatar())
  }
});

