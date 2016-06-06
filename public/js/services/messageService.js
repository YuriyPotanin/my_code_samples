angular.module('Tasktilldone.services', [])
.service('messageService', ['$http', '$httpParamSerializerJQLike', '$resource',
  function($http, $httpParamSerializerJQLike, $resource) {
    var users = {};

    users.sendMessage = function(token, userMessages) {

      return $http({
        url: '/sendMessage/' + token,
        method: 'POST',
        data: userMessages,
      });
    };


    return users;
  }
])