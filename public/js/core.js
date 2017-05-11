angular.module('wol', ['ngRoute', 'ngResource', 'datatables'])


    .controller('mainController', function ($scope, $http, DTOptionsBuilder, $interval) {

        // DataTables configurable options
        $scope.dtOptions = DTOptionsBuilder.newOptions()
            .withDisplayLength(1000)
            .withOption('lengthMenu', [ [10, 15,  25, 50, -1], [10, 15, 25, 50, "All"] ])
            .withOption('bLengthChange', true);
        //Initiate the Timer object.
        $scope.Timer = null;
        $scope.loading = false;
        $scope.arrAlive = [];
        $scope.arrDead = [];
        $scope.pcs = [];
        $http.get('/api/pcs').then(function (result) {
            $scope.pcs = result.data;
            eguneratu();
        });


        $scope.ping = function (ip, last) {
            // default value
            last = typeof last !== 'undefined' ? last : 0;

            $http.get("/ping/" + ip).then(function (resp, status) {
                var alive = resp.data.alive;
                // console.log("Ping erantzuna: " + alive);

                if (alive === true) {
                    var index1 = $scope.arrDead.indexOf(ip);
                    var index2 = $scope.arrAlive.indexOf(ip);

                    if (index1 !== -1) {
                        $scope.arrDead.splice(index1, 1);
                    }
                    if (index2 === -1) {
                        $scope.arrAlive.push(ip);
                    }


                } else if (alive === false) {
                    var index1 = $scope.arrDead.indexOf(ip);
                    var index2 = $scope.arrAlive.indexOf(ip);

                    if (index1 === -1) {
                        $scope.arrDead.push(ip);
                    }

                    if (index2 !== -1) {
                        $scope.arrAlive.splice(index2, 1);
                    }
                }

                if ( last === 1 ) {
                    $scope.loading = false;
                }

            });

        };

        $scope.wol = function (mac) {

            $http.get("/wol/" + mac).then(function (resp, status) {
                var resp = resp.data.wol;
                console.log("Wol erantzuna: " + resp);

                if (resp === false) {

                    alert('Errore bat gertatu da ;(');

                }

            });

        };

        $scope.isInAliveArray = function (ip) {
            return $.inArray(ip, $scope.arrAlive) > -1;
        };

        $scope.isInDeadArray = function (ip) {
            return $.inArray(ip, $scope.arrDead) > -1;
        };


        var eguneratu = function(){
            $scope.loading = true;
            angular.forEach($scope.pcs, function (value, key) {

                if ( key === $scope.pcs.length-1 ) {
                    $scope.ping(value.IPADDRESS, 1);
                } else {
                    $scope.ping(value.IPADDRESS);
                }
            });
        };

        $interval(eguneratu, 180000);



        // var log = [];
        // setInterval(function () {
        //     $scope.loading = true;
        //     angular.forEach($scope.pcs, function (value, key) {
        //         $scope.ping(value.IPADDRESS)
        //
        //         if ( key === $scope.pcs.length-1 ) {
        //             console.log("fin");
        //             $scope.loading = false;
        //         }
        //     });
        // }, 180000) // 3 minutu

    });