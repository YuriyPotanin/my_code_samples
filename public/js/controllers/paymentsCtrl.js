angular.module('Tasktilldone.controllers', [])
.controller(']', ['$scope', '$http', 'authService', 'userService', '$location', '$modal', '$routeParams', 'uuid', 'messageService', "taskService", "paymentsService",
    function($scope, $http, authService, userService, $location, $modal, $routeParams, uuid, messageService, taskService, paymentsService) {
        
        $scope.init = function(){

            $scope.payments = [];
            $scope.itemsPerPage = 10;


            $scope.token = authService.getToken();
            paymentsService.getPayments($scope.token)
                .success(function(response) {

                    for (var key in response) {
                        response[key].fbId = key;
                        $scope.payments.push(response[key]);
                    }
                    $scope.changeArr();
                })
                .error(function(err) {
                    alert("Can't load user");
                });
        }

        $scope.searchAll = function() {
            if ($scope.searchItem) {
                $scope.searchArr = [];

                for (var i = 0; i < $scope.payments.length; i++) {
                    var reg = new RegExp($scope.searchItem, "i");
                    if (reg.test($scope.payments[i].amount) ||
                        reg.test($scope.payments[i].currency) ||
                        reg.test($scope.payments[i].object) ||
                        reg.test($scope.payments[i].refunded) ||
                        reg.test($scope.payments[i].status) ||
                        reg.test($scope.payments[i].amount_refunded) ||
                        reg.test($scope.payments[i].paid)) {
                        $scope.searchArr.push($scope.payments[i]);
                    }
                }
            }
            $scope.changeArr($scope.selectedPage);
        };

        $scope.changeArr = function(selectedPage) {
            if (!selectedPage) {
                selectedPage = 0;
            }
            $scope.selectedPage = selectedPage;
            var sliceStart = $scope.selectedPage * $scope.itemsPerPage;
            var sliceEnd = sliceStart + $scope.itemsPerPage;
            if ($scope.searchItem && $scope.searchItem !== '') {
                $scope.viewOnPage = $scope.searchArr.slice(sliceStart, sliceEnd);
            } else {
                $scope.viewOnPage = $scope.payments.slice(sliceStart, sliceEnd);
            }
            $scope.setCountPage();
        };

        $scope.nextPage = function() {
            $scope.selectedPage = ++$scope.selectedPage;
        };

        $scope.prevPage = function() {
            $scope.selectedPage = --$scope.selectedPage;
        };

        $scope.setCountPage = function() {
            $scope.pages = [];
            if ($scope.searchItem && $scope.searchItem !== '') {
                for (var i = 1; i <= Math.ceil(($scope.searchArr.length) / $scope.itemsPerPage); i++) {
                    $scope.pages.push(i);
                }
            } else {
                for (var j = 1; j <= Math.ceil(($scope.payments.length) / $scope.itemsPerPage); j++) {
                    $scope.pages.push(j);
                }
            }
        };

        $scope.sortAllItems = function(sortItems) {
            $scope.sortItems = sortItems;
            for (var i = 0; i < $scope.payments.length; i++) {
                if (!$scope.payments[i][sortItems]) {
                    $scope.payments[i][sortItems] = "";
                }
            }

            $scope.sortItems = sortItems;
            $scope.sortItemsRevers = ($scope.sortItems == sortItems) ? !$scope.sortItemsRevers : false;

            if ($scope.sortItemsRevers) {
                $scope.payments = $scope.payments.sort(function(a, b) {
                    if (a[sortItems] > b[sortItems]) {
                        return 1;
                    }
                    if (a[sortItems] < b[sortItems]) {
                        return -1;
                    }
                    return 0;
                });
            } else {
                $scope.payments = $scope.payments.sort(function(a, b) {
                    if (a[sortItems] < b[sortItems]) {
                        return 1;
                    }
                    if (a[sortItems] > b[sortItems]) {
                        return -1;
                    }
                    return 0;
                });
            }
            $scope.changeArr($scope.selectedPage);
        };

        $scope.sortByItem = function(sortItems) {
            $scope.sortItems = sortItems;
            $scope.sortItemsRevers = ($scope.sortItems == sortItems) ? !$scope.sortItemsRevers : false;
        };

        $scope.returnClassSort = function(sortItem) {
            if ($scope.sortItems !== sortItem) {
                return 'sortingItem';
            }
            if ($scope.sortItems == sortItem && $scope.sortItemsRevers) {
                return 'sortingItemDwn';
            }
            if ($scope.sortItems == sortItem && !$scope.sortItemsRevers) {
                return 'sortingItemUp';
            }
        };

        $scope.back = function() {
            $location.path('/users');
        };

        $scope.viewDetals = function(paymentId) {
            $location.path("/payment/" + paymentId);
        };

        $scope.init();

    }

]);