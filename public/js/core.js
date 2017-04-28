angular.module('wol', ['ngRoute','datatables', 'ngResource'])


.controller('mainController', function (DTOptionsBuilder, DTColumnBuilder, $http, $q) {
    vm = this;
    vm.dtOptions = DTOptionsBuilder.fromFnPromise(function() {
        var defer = $q.defer();
        $http.get('/api/pcs').then(function(result) {

            // console.log(result);

            defer.resolve(result.data);
        });
        return defer.promise;
    }).withPaginationType('full_numbers');

    vm.dtColumns = [
        DTColumnBuilder.newColumn('STATUS').withTitle('Status'),
        DTColumnBuilder.newColumn('NAME').withTitle('Pc'),
        DTColumnBuilder.newColumn('USERID').withTitle('User'),
        DTColumnBuilder.newColumn('luzapena').withTitle('Luzapena'),
        DTColumnBuilder.newColumn('saila').withTitle('saila'),
        DTColumnBuilder.newColumn('IPADDRESS').withTitle('IP'),
        DTColumnBuilder.newColumn('MACADDR').withTitle('MAC')
    ];
});