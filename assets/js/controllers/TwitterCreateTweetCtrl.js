
angular.module('fakepost').controller('TwitterCreateTweetCtrl', function (
  $scope, $stateParams, $http, $timeout, flash)
{
  var oldUsername = $stateParams.username || "kanyewest"

  $scope.tweet = {
    username: oldUsername,
    fullname: $stateParams.fullname || "KANYE WEST",
    avatar: $stateParams.avatar || "http://pbs.twimg.com/profile_images/1132696610/securedownload_reasonably_small.jpeg",
    verified: ($stateParams.verified !== undefined ? $stateParams.verified === 'true' : true),
    retweets: ($stateParams.retweets !== undefined ? $stateParams.retweets : "5"),
    favorites: ($stateParams.favorites !== undefined ? $stateParams.favorites : "7"),
    favoritedBy: [],
    status: $stateParams.status || "Create your own fake tweets! www.fakepost.com",
    timestamp: $stateParams.timestamp || moment().format('h:mm A - DD MMM YYYY')
  }

  for (var i = 0; i < 10; ++i) {
    $scope.tweet.favoritedBy.push(faker.image.avatar())
  }

  $scope.refreshAvatar = function (index) {
    $scope.safeApply(function () {
      $scope.tweet.favoritedBy[index] = faker.image.avatar()
    })
  }

  $scope.editing = {
    user: false,
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
    var username = $scope.tweet.username.toLowerCase()
    if (username === oldUsername) return

    $scope.safeApply(function () {
      $scope.editing.user = true
    })

    $http.get("/api/twitter/users/show/" + username)
      .then(function (response) {
        var user = response.data
        oldUsername = username
        console.log('user', user)

        $scope.safeApply(function () {
          $scope.editing.user = false
          $scope.tweet.fullname = user.name
          $scope.tweet.avatar   = user.profile_image_url
          $scope.tweet.verified = !!user.verified
        })
      }, function (err) {
        console.error("error changing username", username, err)
        flash.error = "Twitter user @" + username + " not found."
        $scope.safeApply(function () {
          $scope.editing.user = false
          $scope.tweet.username = oldUsername
        })
      })
  }

  if (!$scope.screenshot) {
    $scope.generatedScreenshot = null

    $scope.generateScreenshot = function () {
      var params = {
        network: 'twitter',
        width: 560,
        height: $('.tweet').outerHeight(),
        params: $.extend(true, {}, $scope.tweet)
      }

      delete params.params.favoritedBy

      $scope.safeApply(function () {
        $scope.generatedScreenshotLoading = true
        $scope.generatedScreenshot = null
      })

      $http.post("/api/screenshot", params)
        .then(function (response) {
          $scope.safeApply(function () {
            $scope.generatedScreenshotLoading = false
            $scope.generatedScreenshot = response.data
          })
        }, function (err) {
          console.error("error generating screenshot", params, err)
          flash.error = "failed to generate screenshot."

          $scope.safeApply(function () {
            $scope.generatedScreenshotLoading = false
          })
        })
    }
  }
});

