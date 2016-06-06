angular.module('Tasktilldone.controllers', [])
.controller('loginCtrl', ['$scope', 'authService',
    function($scope, authService) {
        
        $scope.init = function(){
            $scope.loginInfo = {
                email: "",
                password: ""
            };  
        };

        $scope.login = function() {
            authService.login($scope.loginInfo.email, $scope.loginInfo.password)
                .success(function(response) {
                    authService.setData(response.token, true);
                })
                .error(function(error) {
                    alert('ERROR! Invalid login or password!');
                });
        };

        $scope.init();

    }
]);