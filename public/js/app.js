'use strict';

angular.module('TasktilldoneApp', ['ngRoute', 'ngResource', 'ngCookies', 'angular-md5', 'Tasktilldone.filters', 
	'Tasktilldone.services', 'Tasktilldone.directives', 'Tasktilldone.controllers','uuid','highcharts-ng', 'mgcrea.ngStrap'])

	.config(['$routeProvider', function($routeProvider) {
		$routeProvider
	    .when('/', {templateUrl: 'partials/login.html', controller: 'loginCtrl'})
	    .when('/dashboard', {templateUrl: 'partials/dashboard.html',controller: 'dashboardCtrl'})
	    .when('/users', {templateUrl: 'partials/users.html',controller: 'usersCtrl'})
	    .when('/user/:id', {templateUrl: 'partials/user.html',controller: 'userCtrl'})
	    .when('/tasks/', {templateUrl: 'partials/tasks.html',controller: 'tasksCtrl'})
	    .when('/task/:id', {templateUrl: 'partials/task.html',controller: 'taskCtrl'})
	    .when('/payments', {templateUrl: 'partials/payments.html',controller: 'paymentsCtrl'})
	    .when('/payment/:id', {templateUrl: 'partials/payment.html',controller: 'paymentCtrl'})
	    .otherwise({redirectTo: '/'});
	}])

	.run(['$location', '$rootScope', 'authService', function($location, $rootScope, authService) {
    $rootScope.$on('$locationChangeStart', function() {
      authService.isAuthenticated();
    });

}]);	