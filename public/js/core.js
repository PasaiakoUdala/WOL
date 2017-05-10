angular.module('wol', ['ngRoute','ngResource'])


.controller('mainController', function ($scope, $http) {
    $scope.arrAlive = [];
    $scope.arrDead = [];
    $scope.pcs=[];
    $http.get('/api/pcs').then(function (result) {
        $scope.pcs = result.data;
    });


    $scope.ping = function (ip) {

        $http.get("/ping/"+ip).then(function(resp, status) {
            var alive = resp.data.alive;
            console.log("Erantzuna: " + alive );

            if ( alive === true ) {
                $scope.arrAlive.push(ip);
            } else if ( alive === false ) {
                $scope.arrDead.push(ip);
            }

        });

    };

    $scope.isInAliveArray =  function(ip){
        return $.inArray( ip, $scope.arrAlive) > -1;
    };


    // pc.IPADDRESS == idSelectedVote

    $scope.idSelectedVote = null;
    $scope.setSelected = function(idSelectedVote) {
        $scope.idSelectedVote = idSelectedVote;
        console.log(idSelectedVote);
    }


});