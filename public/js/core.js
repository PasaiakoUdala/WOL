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
            console.log("Ping erantzuna: " + alive );

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

    $scope.wol = function (mac) {

        $http.get("/wol/"+mac).then(function(resp, status) {
            var resp = resp.data.wol;
            console.log("Wol erantzuna: " + resp );

            if ( resp === false ) {

                alert('Errore bat gertatu da ;(');

            }

        });

    };

    $scope.isInAliveArray =  function(ip){
        return $.inArray( ip, $scope.arrAlive) > -1;
    };
    $scope.isInDeadArray =  function(ip){
        return $.inArray( ip, $scope.arrDead) > -1;
    };

});