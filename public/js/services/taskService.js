angular.module('Tasktilldone.services', [])
.service('taskService', ['$http', '$httpParamSerializerJQLike', '$resource',
  function($http, $httpParamSerializerJQLike, $resource) {
    var tasks = {};

    tasks.getTasks = function(token, fbId) {

      return $http({
        url: '/gettasks/' + token + "/",
        method: 'GET',

      });
    };
    tasks.udateTask = function(token, task) {

      return $http({
        url: '/updatetask/' + token,
        method: 'POST',
        data: task,
      });
    };
    tasks.getTask = function(token, fbId) {

      return $http({
        url: '/gettask/' + token + "/" + fbId,
        method: 'GET',

      });
    };
    tasks.getTasksOffers = function(token, taskId) {

      return $http({
        url: '/getTasksOffers/' + token + "/" + taskId,
        method: 'GET',

      });
    };
    return tasks;
  }
])