angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider



.state('tabsController', {
    url: '/page1',
    templateUrl: 'templates/tabsController.html',
    abstract:true
  })

  .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'loginCtrl'
  })

  .state('tabsController.eVaca', {
    url: '/main',
    views: {
      'tab4': {
        templateUrl: 'templates/eVaca.html',
        controller: 'eVacaCtrl'
      }
    }
  })

  .state('thingsToDo', {
    url: '/events',
    params: {
        plannerId: null
    },
    // views: {
    //   'tab4': {
        templateUrl: 'templates/thingsToDo.html',
        controller: 'thingsToDoCtrl'
    //   }
    // }
  })

  .state('signUp', {
    url: '/signup',
    templateUrl: 'templates/signUp.html',
    controller: 'signUpCtrl'
  })

  .state('tabsController.planner', {
    url: '/planner',
    views: {
      'tab4': {
        templateUrl: 'templates/planner.html',
        controller: 'plannerCtrl'
      }
    }
  })

  .state('verifcationCode', {
    url: '/verfication',
    templateUrl: 'templates/verifcationCode.html',
    controller: 'verifcationCodeCtrl'
  })

  .state('resetPassword', {
    url: '/reset_request',
    templateUrl: 'templates/resetPassword.html',
    controller: 'resetPasswordCtrl'
  })

  .state('newPassword', {
    url: '/pass_update',
    templateUrl: 'templates/newPassword.html',
    controller: 'newPasswordCtrl'
  })

  .state('newEmail', {
    url: '/newEmail',
    templateUrl: 'templates/newEmail.html',
    controller: 'newEmailCtrl'
  })

  .state('accountPreferences', {
    url: '/Accounts',
    templateUrl: 'templates/accountPreferences.html',
    controller: 'accountPreferencesCtrl'
  })

$urlRouterProvider.otherwise('/login')



});
