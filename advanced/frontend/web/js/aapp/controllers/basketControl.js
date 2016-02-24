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
                var date = new Date(item.date * 1000);
                console.log(date);
                item.fullDate = date.getDate() + "/" + date.getMonth() + "/" +date.getFullYear() + " " + date.getHours() + ":" + date.getMinutes();
                item.date = date.getDate() + "/" + date.getMonth() + "/" +date.getFullYear();
                item.price = (item.price * 1).toFixed(2);
              }
              console.log(data);
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

