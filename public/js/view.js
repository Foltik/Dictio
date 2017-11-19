var app = angular.module('view', ['ui.router']);

app.component('viewComponent', {
    templateUrl: '/views/view-form.html',
    controller: ['$scope', '$http', '$location', function ($scope, $http, $location) {
        $scope.getId = function () {
            var url = $location.absUrl();
            return url.substring(url.lastIndexOf('/') + 1);
        };

        $scope.getMessage = function () {
            $http({
                method: 'GET',
                url: '/api/get/' + $scope.getId()
            }).then(function (res) {
                $scope.message = res.data;
                $scope.decryptedBody = res.data.body;
            }).catch(function (res) {
                $scope.message = {name: "Error"};
                $scope.decryptedBody = res.data.message;
            })
        };

        $scope.decrypt = function () {
            if ($scope.passphrase.length) {
                var decrypted = CryptoJS.AES.decrypt($scope.message.body, $scope.passphrase);
                try {
                    $scope.decryptedBody = decrypted.toString(CryptoJS.enc.Utf8);
                } catch (e) {
                    $scope.decryptedBody = "Decryption Failed.";
                }
            } else $scope.decryptedBody = $scope.message.body;
        }
    }]
});

app.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', function ($stateProvider, $urlRouterProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    $urlRouterProvider.otherwise('/v');
    $stateProvider.state('all', {
        url: '/v/*params'
    });
}]);
