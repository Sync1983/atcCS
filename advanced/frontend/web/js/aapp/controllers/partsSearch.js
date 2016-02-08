/* global atcCS, ObjectHelper */

atcCS.controller( 'partsSearch', [
    '$scope','$filter', 'User' ,'$routeParams','$rootScope','searchNumberControl', 'storage', 'NgTableParams',
    function($scope,$filter,$user,$routeParams,$rootScope,$snCtrl, $storage, NgTableParams ) {
    'use strict';    
    var brands = false;
    var requestParams = {};
    $scope.loading    = {};    
    $scope.data       = [];
    $scope.timestamp  = $routeParams.timestamp  || false;
    $scope.searchText = $routeParams.searchText || false;
    $scope.brand      = $routeParams.brand      || false;
    
    $scope.tableParams = new NgTableParams(
      {  },
      {        
        counts: [],
        total: 0,
        groupBy: "maker",
        getData: function($defer, params){          
          var sorting = params.sorting();
          
          var originalArray = [];
          var notOriginalArray = [];
          var resultArray = [];
          
          for( var key in $scope.data){
            var item = $scope.data[key];
            if( item.maker && 
                item.articul && 
                (item.maker === $scope.brand) && 
                ( String(item.articul).toUpperCase() === $scope.searchText.toUpperCase() ) ){
              originalArray.push(item);              
            } else {
              notOriginalArray.push(item);
            }
          }
          
          originalArray.sort(sortFunction(sorting));
          notOriginalArray.sort(sortFunction(sorting));
          
          resultArray = ObjectHelper.concat(originalArray,notOriginalArray);
          
          $defer.resolve(resultArray);
        }
      }
    );    
    
    brands = $storage.get($scope.timestamp);
    
    if( $scope.timestamp && brands ) {      
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
      if( $storage.get($scope.timestamp+'@'+clsid+'@'+ident) ){
        
        serverResponse(clsid,ident,$storage.get($scope.timestamp+'@'+clsid+'@'+ident) );
                
      } else{
        $user.getParts(clsid,ident,serverResponseCall(clsid, ident));
        $scope.loading[clsid] = clsid;        
      }
    }
    
    function serverResponseCall($clsid, $ident){
      return function(data){
        serverResponse($clsid,$ident,data);
      };
    }
    
    function serverResponse(clsid,ident,data){
      delete($scope.loading[clsid]);      
      $storage.set($scope.timestamp+'@'+clsid+'@'+ident,data);
      $scope.data = ObjectHelper.concat($scope.data,data.rows);      
      $scope.tableParams.reload();
    }
    
    function sortFunction($sort){
      return function(itemA,itemB){
        var result = 0;        
        for(var key in $sort){
          var direct = ($sort[key]==='desc')?-1:1;
          var valA   = itemA[key];
          var valB   = itemB[key];
          if( (key==='price') || (key==='shiping') || (key==='count') ){
            valA  *= 1;
            valB  *= 1;            
          }
          
          result += (valA>valB)?direct:0;
          result -= (valA<valB)?direct:0;
        }
        return result;
      };
    }
    
}]);