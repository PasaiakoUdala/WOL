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
                var index1 = $scope.arrDead.indexOf(ip);
                if ( index1 !== -1) {
                    $scope.arrDead.splice(index1, 1);
                }
                $scope.arrAlive.push(ip);

            } else if ( alive === false ) {
                var index2 = $scope.arrAlive.indexOf(ip);
                if ( index2 !== -1) {
                    $scope.arrAlive.splice(index2, 1);
                }
                $scope.arrDead.push(ip);
            }

        });

    };

    $scope.isInAliveArray =  function(ip){
        return $.inArray( ip, $scope.arrAlive) > -1;
    };
    $scope.isInDeadArray =  function(ip){
        return $.inArray( ip, $scope.arrDead) > -1;
    };


    // pc.IPADDRESS == idSelectedVote

    $scope.idSelectedVote = null;
    $scope.setSelected = function(idSelectedVote) {
        $scope.idSelectedVote = idSelectedVote;
        console.log(idSelectedVote);
    }


});