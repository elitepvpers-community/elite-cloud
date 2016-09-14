var app = angular.module('elite-cloud', []);

function notify(data) {
    $.notify(data.message, {
        className: data.success ? 'success' : 'error',
        autoHideDelay: 2 * 1000
    });
}

// Config
app.config(['$interpolateProvider', function ($interpolateProvider) {
    $interpolateProvider.startSymbol('[[');
    $interpolateProvider.endSymbol(']]');
}]);

app.controller('LoginController', ['$scope', '$http', '$location', function ($scope, $http, $location) {
    $scope.form = {
        username: '',
        password: '',
        remember: false
    };

    $scope.login = function () {
        var response = $http.post('api/login', {
            username: $scope.form.username,
            password: $scope.form.password,
            remember: $scope.form.remember
        });
        response.success(function (data, status, headers, config) {
            notify(data);
            if (data.success) {
                setTimeout(function () {
                    window.location.href = 'userscripts';
                }, 500);
            }
            else {
                $scope.form.password = '';
            }
        });
    };
}]);

app.controller('RegisterController', ['$scope', '$http', '$location', function ($scope, $http, $location) {
    $scope.form = {
        username: '',
        password: '',
        password2: '',
        email: '',
        email2: ''
    };

    $scope.register = function () {
        var response = $http.post('api/user/register', {
            username: $scope.form.username,
            password: $scope.form.password,
            email: $scope.form.email,
            captcha: grecaptcha.getResponse()
        });
        response.success(function (data, status, headers, config) {
            notify(data);
            if (data.success) {
                setTimeout(function () {
                    window.location.href = '.';
                }, 500);
            }
            else {
                grecaptcha.reset();
                $scope.form.password = '';
                $scope.form.password2 = '';
            }
        });
    };
}]);

app.controller('LogoutController', ['$scope', '$http', '$location', function ($scope, $http, $location) {
    $scope.logout = function () {
        var response = $http.post('api/logout');
        response.success(function (data, status, headers, config) {
            notify(data);
            if (data.success) {
                setTimeout(function () {
                    window.location.href = '.';
                }, 500);
            }
        });
    };
}]);

app.controller('UserscriptsController', ['$scope', '$http', '$location', function ($scope, $http, $location) {
    $scope.userscripts = [];
    $scope.search = '';

    $scope.lastUpdate = null;
    $scope.updating = false;
    $scope.event = null;
    $scope.timeout = 250; // ms

    $scope.order = 'asc';
    $scope.lastSort = null;

    $scope.update = function (sort) {
        if ($scope.updating || ($scope.lastUpdate != null && (Date.now() - $scope.lastUpdate <= $scope.timeout))) {
            if ($scope.event != null) {
                clearTimeout($scope.event);
            }
            $scope.event = setTimeout(function () {
                $scope.update(sort);
                $scope.event = null
            }, $scope.timeout);
            return;
        }

        sort = sort || 'selected';
        if ($scope.lastSort != null && $scope.lastSort == sort) {
            $scope.order = $scope.order == 'asc' ? 'desc' : 'asc';
        } else {
            $scope.order = (sort == 'selected' || sort == 'users') ? 'desc' : 'asc';
        }
        $scope.lastSort = sort;

        $scope.updating = true;
        var response = $http.get('api/userscript/list/' + sort + '/' + $scope.order + ($scope.search != '' ? '/' + btoa($scope.search) : ''));
        response.success(function (e, status, headers, config) {
            $scope.userscripts = e.data;
            $scope.lastUpdate = Date.now();
            $scope.updating = false;
        });
    };

    $scope.click = function (userscript) {
        window.location.href = 'userscript/' + userscript.id;
    };

    $scope.add = function (userscript) {
        var response = $http.get('api/user/addscript/' + userscript.id);
        response.success(function (data, status, headers, config) {
            notify(data);
            if (data.success) {
                userscript.selected = true;
            }
        });
    };

    $scope.remove = function (userscript) {
        var response = $http.get('api/user/removescript/' + userscript.id);
        response.success(function (data, status, headers, config) {
            notify(data);
            if (data.success) {
                userscript.selected = false;
            }
        });
    };

    $scope.toggle = function ($event, userscript) {
        $event.stopPropagation();
        if ($event.target.tagName !== 'INPUT') {
            return;
        }
        if (userscript.selected) {
            userscript.users--;
            this.remove(userscript);
        } else {
            userscript.users++;
            this.add(userscript);
        }
    };

    $scope.update();
}]);