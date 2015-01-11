
angular.module('fakepost').controller('RootCtrl', function (
  $rootScope, $state, $stateParams, $timeout, cfpLoadingBar)
{
  $rootScope.safeApply = function (fn) {
    var $root = this.$root
    if (!$root) return fn()

    var phase = $root.$$phase
    if (phase === '$apply' || phase === '$digest') {
      if (fn && typeof(fn) === 'function') fn()
    } else {
      this.$apply(fn)
    }
  }

  // Returns the version of Internet Explorer or a -1
  // (indicating the use of another browser).
  function getIsIE () {
    var ua = window.navigator.userAgent
    var msie = ua.indexOf("MSIE ")

    return (msie > 0 || !!ua.match(/Trident.*rv\:11\./))
  }

  var isMobile = (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))
  $rootScope.$state       = $state
  $rootScope.$stateParams = $stateParams
  $rootScope.isMobile     = IS_MOBILE || isMobile
  $rootScope.isIframe     = (window.parent !== window.top)
  $rootScope.isIOS        = isMobile && (/iPhone|iPad|iPod/i.test(navigator.userAgent))
  $rootScope.isIE         = getIsIE()
  $rootScope.isChromeIOS  = $rootScope.isMobile && navigator.userAgent.match('CriOS')
  $rootScope.location     = location

  var loadingTimeoutP = null
  function cancelLoadingTimeout () {
    if (loadingTimeoutP) {
      $timeout.cancel(loadingTimeoutP)
      loadingTimeoutP = null
    }
  }

  $rootScope.$on('cfpLoadingBar:started', function () {
    cancelLoadingTimeout()
    loadingTimeoutP = $timeout(function () {
      cfpLoadingBar.complete()
      cancelLoadingTimeout()
    }, 8000)
  })

  $rootScope.$on('cfpLoadingBar:complete', function () {
    cancelLoadingTimeout()
  })

  $rootScope.setLoading = function (isLoading) {
    $rootScope.safeApply(function () {
      $rootScope.globalLoading = !!isLoading
    })
  }
});

