var app = angular.module('index', ['ngAnimate']);

app.controller('pageController', ['$scope', '$timeout', function($scope, $timeout) {
    $scope.test = function() {
        $scope.showAbout = !$scope.showAbout;
        $timeout(function() {
            $('html, body').animate({scrollTop: $('#about').offset().top}, 1000);
        }, 200);
    };
}]);

app.component('uploadComponent', {
    templateUrl: '/views/form.html',
    controller: ['$scope', '$http', function($scope, $http) {
        $scope.upload = function() {
            if ($scope.body.length === 0 || $scope.name.length === 0)
                return;

            var message = $scope.body;
            if ($scope.shouldEncrypt)
                message = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(message), $scope.passphrase);

            $http({
                method: 'POST',
                url: '/api/upload',
                headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                transformRequest: function(obj) {
                    var str = [];
                    for (var prop in obj)
                        if (obj.hasOwnProperty(prop))
                            str.push(encodeURIComponent(prop) + "=" + encodeURIComponent(obj[prop]));
                    return str.join('&');
                },
                data: {
                    name: $scope.name,
                    body: message,
                    emailRecipient: $scope.emailRecipient,
                    smsRecipient: $scope.smsRecipient,
                    activates: $scope.activates,
                    expires: $scope.expires,
                    encrypted: "shouldEncrypt" in $scope ? $scope.shouldEncrypt : false,
                    destroy: "destroy" in $scope ? $scope.destroy : 0
                }
            }).then(function(res) {
                $scope.hasUploaded = true;
                $scope.message = res.data.message;
                $scope.id = res.data.id;
            }).catch(function(res) {
                console.log('Error: ' + res.data.message);
            })
        };
    }]
});