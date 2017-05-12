angular.module('wol', ['ngRoute', 'ngResource', 'datatables'])


    .controller('mainController', function ($scope, $http, DTOptionsBuilder, $interval) {
        // Variables
        $scope.Timer = null;
        $scope.loading = false;
        $scope.arrAlive = [];
        $scope.arrDead = [];
        $scope.arrSrc = [];
        $scope.arrWin = [];
        $scope.pcs = [];

        // DataTables configurable options
        $scope.dtOptions = DTOptionsBuilder.newOptions()
            .withDisplayLength(1000)
            .withOption('lengthMenu', [ [10, 15,  25, 50, -1], [10, 15, 25, 50, "All"] ])
            .withOption('bLengthChange', true);



        $http.get('/api/pcs').then(function (result) {
            $scope.pcs = result.data;
            eguneratu();
        });

        $scope.ping = function (ip, last, os) {
            // default value
            last = typeof last !== 'undefined' ? last : 0;

            $http.get("/ping/" + ip).then(function (resp, status) {
                var alive = resp.data.alive;

                if (alive === true) {
                    var index1 = $scope.arrDead.indexOf(ip);
                    var index2 = $scope.arrAlive.indexOf(ip);

                    if (index1 !== -1) {
                        $scope.arrDead.splice(index1, 1);
                    }
                    if (index2 === -1) {
                        $scope.arrAlive.push(ip);
                    }

                    if ( os.indexOf("Microsoft") >= 0 ) { // windows da
                        $scope.arrWin.push(ip);

                        // begiratu ea Screensaver-en dagoen
                        $http.get("/winexe/screensaver/" + ip).then(function (resp, status) {
                            if ( resp.result === 1 ) {
                                $scope.arrSrc.push(ip);
                            } else {
                                var index3 = $scope.arrSrc.indexOf(ip);
                                $scope.arrSrc.splice(index3, 1);
                            }
                        });
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

        $scope.isInWinArray = function (ip) {
            return $.inArray(ip, $scope.arrWin) > -1;
        };

        $scope.isInSrcArray = function (ip) {
            return $.inArray(ip, $scope.arrSrc) > -1;
        };

        var eguneratu = function(){
            $scope.loading = true;
            angular.forEach($scope.pcs, function (value, key) {

                if ( (value.IPADDRESS !=="undefined") && (value.IPADDRESS !=="")) {

                    // Bigarren parametroak esaten dio pcs zerrendako azkena den edo ez
                    if ( key === $scope.pcs.length - 1 ) {
                        $scope.ping(value.IPADDRESS, 1, value.OSNAME);
                    } else {
                        $scope.ping(value.IPADDRESS, 0, value.OSNAME);
                    }

                }

            });
        };

        $interval(eguneratu, 600000);

        $scope.logout = function (ip) {
            $http.get("/winexe/session/" + ip).then(function (resp, status) {
                if ( resp.resul === -1 ) {
                    alert("Errore bat eon da.");
                }
            });
        };

        $scope.reboot = function (ip) {
            $http.get("/winexe/reboot/" + ip).then(function (resp, status) {
                if ( resp.resul === -1 ) {
                    alert("Errore bat eon da.");
                }
            });
        };

        $scope.shutdown = function (ip) {
            $http.get("/winexe/shutdown/" + ip).then(function (resp, status) {
                if ( resp.resul === -1 ) {
                    alert("Errore bat eon da.");
                }
            });
        };

    });