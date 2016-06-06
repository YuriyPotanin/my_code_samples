messageServiceangular.module('Tasktilldone.services', [])
  .service('authService', ['$http', '$cookies', '$location', '$httpParamSerializerJQLike', 'md5',
    function($http, $cookies, $location, $httpParamSerializerJQLike, md5) {
      var authentication = {
        isLoggedIn: false,

        token: undefined
      };

      authentication.setData = function(token, isLoggedIn) {
        if (token) {
          this.isLoggedIn = true;
          this.token = token;
          $cookies.put('token', token);
          this.isAuthenticated();
        }

      };

      authentication.getToken = function() {
        if ($cookies.get('token')) {
          this.token = $cookies.get('token');
        }
        if (this.token) {
          return this.token;
        } else {
          return null;
        }
      };

      authentication.isUserLoggedIn = function() {
        if ($cookies.get('token')) {
          this.isLoggedIn = true;
        }
        return this.isLoggedIn;
      };

      authentication.login = function(email, password) {
        var params = {
          email: email,
          secret: password
        };

        return $http({
          url: '/login',
          method: 'POST',
          data: params,
        });
      };

      authentication.logout = function() {
        $cookies.remove('token');
        this.isLoggedIn = false;
        this.token = false;
        $location.path("/");
      };

      authentication.isAuthenticated = function() {
        if ($cookies.get('token')) {
          if ($location.path() == "" || $location.path() == "/" || $location.path() == "/login") {
            $location.path("/dashboard");
          }
        }

        if ($location.path() == "" || $location.path() == "/" || $location.path() == "/login") {
          return;
        }

        if (!$cookies.get('token')) {
          this.isLoggedIn = false;
          this.token = false;
          $location.path("/login");
        }
      };

      return authentication;
    }
  ])
