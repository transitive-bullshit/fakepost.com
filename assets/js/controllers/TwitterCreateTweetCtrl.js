
angular.module('fakepost').controller('TwitterCreateTweetCtrl', function (
  $scope, $stateParams, $http, $timeout, flash)
{
  var oldUsername = "fisch0920"

  $scope.tweet = {
    user: {
      username: oldUsername,
      fullname: "Travis Fischer",
      avatar: "https://pbs.twimg.com/profile_images/547714403684986880/apxt8hY7_bigger.png",
      verified: true
    },
    stats: {
      retweets: 5,
      favorites: 7,
      favoritedBy: []
    },
    status: "Create your own fake tweets! www.fakepost.com",
    timestamp: moment().format('h:mm A - DD MMM YYYY')
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
    timestamp: false
  }

  $scope.toggleEditing = function (key) {
    $scope.safeApply(function () {
      for (var k in $scope.editing) {
        $scope.editing[k] = (k === key && !$scope.editing[k])
      }
    })

    if ($scope.editing[key]) {
      $timeout(function () {
        var $input = $('.editing-' + key).focus()
        if (key === 'username') $input.select()
      })
    }

    if (key === 'username' && !$scope.editing[key]) onUsernameChange()
  }

  $scope.handleEditingKey = function ($event, key) {
    if ($event.keyCode === 13) {
      $scope.safeApply(function () {
        for (var k in $scope.editing) {
          $scope.editing[k] = false
        }
      })

      if (key === 'username') onUsernameChange()
    }
  }

  function onUsernameChange () {
    var username = $scope.tweet.user.username.toLowerCase()
    if (username === oldUsername) return

    $http.get("/api/twitter/users/show/" + username)
      .then(function (response) {
        var user = response.data
        oldUsername = username
        console.log('user', user)

        $scope.safeApply(function () {
          $scope.tweet.user.fullname = user.name
          $scope.tweet.user.avatar   = user.profile_image_url
          $scope.tweet.user.verified = !!user.verified
        })
      }, function (err) {
        console.error("error changing username", username, err)
        flash.error = "Twitter user @" + username + " not found."
        $scope.safeApply(function () {
          $scope.tweet.user.username = oldUsername
        })
      })
  }
});

