'use strict';
angular.module('Tasktilldone.services', [])
.service('paymentsService', ['$http', '$httpParamSerializerJQLike', '$resource',
  function($http, $httpParamSerializerJQLike, $resource) {
    var payment = {};

    payment.getPayments = function(token) {

      return $http({
        url: '/getpayments/' + token + "/",
        method: 'GET',

      });
    };

    payment.getPayment = function(token, paymentId) {
      return $http({
        url: '/getpayment/' + token + "/" + paymentId,
        method: 'GET'
      });
    };
    return payment;
  }
]);