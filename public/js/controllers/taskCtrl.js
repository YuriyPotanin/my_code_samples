angular.module('Tasktilldone.controllers', [])
.controller('taskCtrl', ['$scope', '$http', 'authService', 'userService', '$location', '$modal', '$routeParams', 'uuid', 'messageService', 'taskService', '$q', "$httpParamSerializerJQLike",
    function($scope, $http, authService, userService, $location, $modal, $routeParams, uuid, messageService, taskService, $q, $httpParamSerializerJQLike) {
        
        $scope.init = function(){

            $scope.availableCategories = ['other', 'assistance', 'audio', 'fixed', 'video', 'design', 'marketing', 'programming', 'writing'];
            $scope.purchaseTypes = ['fixed', 'negotiable'];
            $scope.token = authService.getToken();
            $scope.taskFbId = $routeParams.id;

            taskService.getTask($scope.token, $scope.taskFbId)
                .success(function(response) {
                    $scope.task = response;
                    $scope.task.fbId = $scope.tascFbId;

                })
                .error(function(err) {
                    alert("Can't load tasks");
                });

            taskService.getTasksOffers($scope.token, $scope.taskFbId)
                .success(function(tasksOffers) {

                    $scope.tasksOffers = tasksOffers;
                })
                .error(function(error) {
                    alert('ERROR!');
                });

            $scope.postedByArr = [];
            $scope.assigneeIdArr = [];
            $scope.users = [];
            $scope.token = authService.getToken();

            userService.getUsers($scope.token)
                .success(function(response) {


                    for (var key in response) {
                        $scope.users.push(response[key]);
                        $scope.assigneeIdArr.push(key);
                    }
                    for (var i = 0; i < $scope.users.length; i++) {
                        $scope.postedByArr.push($scope.users[i].user_email);
                    }

                });

        };

        $scope.back = function() {
            $location.path('/tasks');
        };


        $scope.submitTask = function() {
            $scope.task.deletedDate = new Date($scope.task.deletedDate).getTime();
            $scope.task.dueDate = new Date($scope.task.dueDate).getTime();
            $scope.task.outsourcedDate = new Date($scope.task.outsourcedDate).getTime();
            $scope.task.postedDate = new Date($scope.task.postedDate).getTime();
            $scope.task.startDate = new Date($scope.task.startDate).getTime();
            $scope.task.statusChangedDate = new Date($scope.task.statusChangedDate).getTime();
            $scope.task.assignedDate = new Date($scope.task.assignedDate).getTime();

            $scope.token = authService.getToken();
            taskService.udateTask($scope.token, $scope.task)
                .success(function(response) {
                    alert('task successful update');
                    console.log(response);
                })
                .error(function(error) {
                    alert('ERROR! Invalid login or password!');
                });


        };

        $scope.init();

    }

]);