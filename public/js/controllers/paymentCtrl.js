'use strict';
angular.module('Tasktilldone.controllers', [])
.controller('paymentCtrl', ['$scope', '$http', 'authService', 'userService', '$location', '$modal', '$routeParams', 'uuid', 'messageService', "taskService", "paymentsService",
    function($scope, $http, authService, userService, $location, $modal, $routeParams, uuid, messageService, taskService, paymentsService) {

        $scope.init = function(){

            $scope.token = authService.getToken();
            $scope.paymentFbId = $routeParams.id;
            paymentsService.getPayment($scope.token, $scope.paymentFbId)
                .success(function(response) {
                    $scope.payment = response;
                    $scope.payment.fbId = $scope.paymentFbId;

                })
                .error(function(err) {
                    alert("Can't load tasks");
                });
        };

        $scope.back = function() {
            $location.path('/payments');
        };

        $scope.init();

    }
]);
