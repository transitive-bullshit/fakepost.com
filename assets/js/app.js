/**
 * Angular application initialization
 */

var modules = [
  'ngAnimate',
  'ui.router',
  'ui.bootstrap',
  'angular-flash.service',
  'angular-flash.flash-alert-directive',
  'cfp.loadingBar'
]

var mobileModules = [ 'ngTouch' ]

if (window.IS_MOBILE) {
  modules = modules.concat(mobileModules)
}

angular.module('fakepost', modules)

angular.module('fakepost').config(function ($locationProvider, $stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise("/")

  $stateProvider
    .state('home', {
      url: "/",
      templateUrl: "/assets/html/home.html",
      controller: "HomeCtrl"
    })
    .state('twitter', {
      abstract: true,
      url: "/twitter?screenshot",
      templateUrl: "/assets/html/twitter.html",
      controller: "TwitterCtrl"
    })
    .state('twitter.home', {
      templateUrl: "/assets/html/twitter-home.html",
      controller: "TwitterHomeCtrl"
    })
    .state('twitter.create-tweet', {
      url: "/create?username&fullname&avatar&verified&retweets&favorites&favoritedBy&status&timestamp",
      templateUrl: "/assets/html/twitter-create-tweet.html",
      controller: "TwitterCreateTweetCtrl"
    })

  $locationProvider.html5Mode(true)
})

