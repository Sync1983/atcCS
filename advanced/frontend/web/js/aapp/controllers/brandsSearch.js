/* global atcCS */

atcCS.controller( 'brandsSearch', [
    '$scope','$filter', 'User' ,'$routeParams','$rootScope','searchNumberControl', 'storage', '$anchorScroll', '$location', '$window', 
    function($scope,$filter,$user,$routeParams,$rootScope,$snCtrl, $storage, $anchorScroll, $location, $window ) {
    'use strict';    
    $scope.timestamp  = $routeParams.timestamp  || false;
    $scope.searchText = $routeParams.searchText || false;
    $scope.count      = 0;
    $scope.titleShow  = {};
    $scope.isScroll   = false;
    
            
    if( !$scope.timestamp ){
      $scope.timestamp = Math.round( (new Date()).getTime() / 1000 );
    }
    
    $snCtrl.change($scope.searchText);
    
    if( $storage.get($scope.timestamp) ){
      //Было закешировано      
      serverResponse($storage.get($scope.timestamp));
    } else if( $scope.searchText ){      
      //Надо загрузить      
      $scope.inSearch = true;
      $user.getBrands( $scope.searchText, serverResponse);
    }
    
    function createMultiList(data){ 
      var list      = {};
      var sortData  = {};
      var keys      = Object.keys(data);
      
      keys.sort();
      
      for(var i in keys){
        var key = keys[i];
        var letter = String(key).substring(0,1);
        sortData[key] = data[key];        
        $scope.titleShow[letter] = true;
      }
      
      
      for(var key in sortData){
        var letter = String(key).substring(0,1);
        if( !list.hasOwnProperty(letter) ){
          list[letter] = {};
        }
        
        list[letter][key] = sortData[key];
      }
      
      return list;
    }
    
    function serverResponse(data){
      $scope.inSearch = false;
      if( !data || !data.count ){
        return;
      }      
      
      $scope.brands = createMultiList(data.rows || []);
      $scope.count  = data.count;      
      $storage.set($scope.timestamp,data);      
    }
    
    $scope.goToTarget = function(letter){
      var newHash = 'tag' + letter;                  
      $anchorScroll(newHash);
    };
    
    
    angular.element("div.view").bind("scroll", function(event) {            
      if (event.currentTarget.scrollTop >= 100) {
        $scope.isScroll = true;
      } else {
        $scope.isScroll = false;
      }
      $scope.$apply();
     });
    
}]);