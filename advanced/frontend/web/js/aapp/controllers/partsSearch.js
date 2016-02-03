/* global atcCS */

atcCS.controller( 'partsSearch', [
    '$scope','$filter', 'User' ,'$routeParams','$rootScope','searchNumberControl', 'storage', 'NgTableParams',
    function($scope,$filter,$user,$routeParams,$rootScope,$snCtrl, $storage, NgTableParams ) {
    'use strict';    
    var brands = false;
    var requestParams = {};
    $scope.loading = {};    
    var dta = [
      {
        a:1,
        b:2,
        c:3
      },
      {
        a:2,
        b:3,
        c:4
      },
      {
        a:4,
        b:5,
        c:6
      }
    ];
    
    $scope.tableParams = new NgTableParams(
      {
        page: 1,
        count: 2        
      },
      {
        counts: [25,50,100,-1],        
        paginationMaxBlocks: 13,
        paginationMinBlocks: 2,
        data: dta 
      }
    );
    
    console.log($scope.tableParams);
    
    $scope.timestamp  = $routeParams.timestamp  || false;
    $scope.searchText = $routeParams.searchText || false;
    $scope.brand      = $routeParams.brand      || false;
    
    if( $scope.timestamp && (brands = $storage.get($scope.timestamp)) ) {      
      for(var brand in brands.rows){        
        if( brand !== $scope.brand ){
          continue;
        }
        requestParams = brands.rows[brand];
      }      
    }
    
    for(var i in requestParams){
      var clsid = requestParams[i].id;
      var ident = requestParams[i].uid;
      /*$user.getParts(clsid,ident,function(data){
        serverResponse(clsid,data);
      });*/
      $scope.loading[clsid] = clsid;
    }
    
    function serverResponse(clsid,data){
      delete($scope.loading[clsid]);
      
    }
    console.log(requestParams);
}]);