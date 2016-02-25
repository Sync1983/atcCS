/* global atcCS */

atcCS.controller( 'basketControl', [
  '$scope', 'User' ,'$rootScope', 'NgTableParams',
  function($scope,$user,$rootScope,NgTableParams ) {
    'use strict';    
    
    $scope.isLogin  = $user.isLogin;
    $scope.tableData = undefined;
    
    $scope.tableParams = new NgTableParams(
      {  },
      {        
        counts: [],
        total: 0,        
        getData: function($defer,params){
          var sorting = params.sorting();
      
          $user.getBasket().then(
            function answer(response){
              var data = (response && response.data) || [];
              for(var index in data){
                var item = data[index];                
                item.date *=  1000;
                item.price = (item.price * 1).toFixed(2);
              }
              data.sort(function(itemA,itemB){                
                var rWeight = 0;
                for(var field in sorting){                  
                  var sortSide  = sorting[field]==="desc"?-1:1;
                  var weight    = sortSide;
                  var valueA    = itemA[field] || null;
                  var valueB    = itemB[field] || null;                  
                  rWeight += (valueA===valueB)?0:((valueA>valueB)?weight:-weight);                  
                }                
                return rWeight;
              });
              $defer.resolve(data);          
            }      
          );
        }
      }                
    );     
    
    $rootScope.$on('userDataUpdate', 
      function(event){        
        $scope.isLogin = $user.isLogin;
        if( $user.isLogin && $scope.tableParams ){
          $scope.tableParams.reload();          
        }
     });    
     
}]);

