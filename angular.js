var playlistService = angular.module('playlistService', ['ngResource']);

playlistService.factory('Playlist', ['$resource',
                                     function ($resource) {
                                         return $resource("http://thweeble:7878/playlist", {}, {
                                             query: {method: "GET"}
                                         })
                                     }]);


var app = angular.module('app', ['playlistService']);

app.controller('PlaylistController', ["$scope", "$timeout", "Playlist", function ($scope, $timeout, playlistService) {
    $scope.playlist = {};

    (function tick() {
        playlistService.query({}, function(result) {
            $scope.playlist = result
            $timeout(tick, 1000);
        });
    })();
}]);
