angular.module('starter.controllers', [])

.controller('MenuCtrl', function($scope, $ionicModal, $timeout, $state, $q, UserService, $ionicActionSheet, $ionicLoading) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  $scope.test = function(){
    console.log("ok");
  }

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };



  //facebook login code

  var fbLoginSuccess = function(response) {
    if (!response.authResponse){
      fbLoginError("Cannot find the authResponse");
      $scope.estado = "ln 47 Cannot find the authResponse";
      return;
    }

    var authResponse = response.authResponse;

    getFacebookProfileInfo(authResponse)
    .then(function(profileInfo) {
      // For the purpose of this example I will store user data on local storage
      UserService.setUser({
        authResponse: authResponse,
				userID: profileInfo.id,
				name: profileInfo.name,
				email: profileInfo.email,
        picture : "http://graph.facebook.com/" + authResponse.userID + "/picture?type=large"
      });
      $ionicLoading.hide();
      //$state.go('app.home');
    }, function(fail){
      // Fail get profile info
      console.log('profile info fail', fail);
      $scope.estado = 'ln 68 profile info fail'+fail;
    });
  };

  // This is the fail callback from the login method
  var fbLoginError = function(error){
    console.log('fbLoginError', error);
    //$scope.estado = error:
   $ionicLoading.hide();
  };

  // This method is to get the user profile info from the facebook api
  var getFacebookProfileInfo = function (authResponse) {
    var info = $q.defer();

    facebookConnectPlugin.api('/me?fields=email,name&access_token=' + authResponse.accessToken, null,
      function (response) {
				console.log(response);
        info.resolve(response);
      },
      function (response) {
				console.log(response);
        info.reject(response);
      }
    );
    return info.promise;
  };

  //This method is executed when the user press the "Login with facebook" button
  $scope.facebookSignIn = function() {
    console.log("ok");
    facebookConnectPlugin.getLoginStatus(function(success){
      if(success.status === 'connected'){
        // The user is logged in and has authenticated your app, and response.authResponse supplies
        // the user's ID, a valid access token, a signed request, and the time the access token
        // and signed request each expire
        console.log('getLoginStatus', success.status);
        $scope.estado ="ln 104 estado" + success.status;
    		// Check if we have our user saved
    		var user = UserService.getUser('facebook');

    		if(!user.userID){
					getFacebookProfileInfo(success.authResponse)
					.then(function(profileInfo) {
						// For the purpose of this example I will store user data on local storage
						UserService.setUser({
							authResponse: success.authResponse,
							userID: profileInfo.id,
							name: profileInfo.name,
							email: profileInfo.email,
							picture : "http://graph.facebook.com/" + success.authResponse.userID + "/picture?type=large"
						});
            $scope.estado = "ln 119 home";
						//$state.go('app.home');
					}, function(fail){
						// Fail get profile info
						console.log('profile info fail', fail);
					});
				}else{
					//$state.go('app.home');
          $scope.estado = "ln 127 home";
				}
      } else {
        // If (success.status === 'not_authorized') the user is logged in to Facebook,
				// but has not authenticated your app
        // Else the person is not logged into Facebook,
				// so we're not sure if they are logged into this app or not.

				console.log('getLoginStatus', success.status);
        $scope.estado = "ln 136 "+success.status;
				$ionicLoading.show({
          template: 'Logging in...'
        });

				// Ask the permissions you need. You can learn more about
				// FB permissions here: https://developers.facebook.com/docs/facebook-login/permissions/v2.4
        facebookConnectPlugin.login( ["email", "public_profile", "user_friends"], fbLoginSuccess, fbLoginError);
      }
    });
    };

    $scope.user = UserService.getUser();





})

.controller('MainCtrl', function($scope, $ionicSlideBoxDelegate) {

  $scope.myActiveSlide = 1;
  $scope.navSlide = function(index) {
       $ionicSlideBoxDelegate.slide(index, 500);
   }
})

.controller('PlaylistCtrl', function($scope, $stateParams) {
});
