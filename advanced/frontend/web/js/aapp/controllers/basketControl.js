/* global atcCS */

atcCS.controller( 'basketControl', [
  '$scope', 'User' ,'$rootScope', 'NgTableParams', '$confirm','$wndMng',
  function($scope,$user,$rootScope,NgTableParams,$confirm,$wndMng ) {
    'use strict';    
    
    $scope.isLogin    = $user.isLogin;
    $scope.basketName = $user.activeBasket.name;
    $scope.tableData  = undefined;
    $scope.editPart   = {};
    
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
    
    $scope.editWnd = $wndMng.createWindow({
        title: "Редактировать позицию",        
        hSize: '30%',
        vSize: '50%',
        hAlign: 'center',
        vAlign: 'center',
        hideIfClose:  true,
        showClose:    true,
        showMin:      false,
        modal:        true,
        show:         true
      });
      
    $wndMng.setBodyByTemplate($scope.editWnd, '/parts/_basket-edit.html',   $scope);  
        
    $scope.delete = function(row){
      if( row === undefined ){
        return;
      }
      var text = "Действительно удалить позицию в корзние " + row.articul + " - " + row.maker + " - " + row.name + "?";
      
      $confirm.request(text).then(function(status){
        console.log(status);
      });  
    };
    
    $scope.edit = function(row){
      $scope.editPart = row;
    };
    
    $rootScope.$on('userDataUpdate', 
      function(event){        
        $scope.isLogin = $user.isLogin;
        $scope.basketName = $user.activeBasket.name;        
        if( $user.isLogin && $scope.tableParams ){
          $scope.tableParams.reload();          
        }
     });    
     
}]);

