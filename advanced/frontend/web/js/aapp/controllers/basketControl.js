/* global atcCS */

atcCS.controller( 'basketControl', [
  '$scope', 'User' ,'$rootScope', 'NgTableParams', '$confirm','$wndMng','Notification',
  function($scope,$user,$rootScope,NgTableParams,$confirm,$wndMng,$notify ) {
    'use strict';    
    
    var confirmButton = $('<button class="btn btn-default" ng-class="{disable: confirmDisable===true}" ng-click="update()">Обновить</button>');
    
    $scope.isLogin    = $user.isLogin;
    $scope.basketName = $user.activeBasket.name;
    $scope.tableData  = undefined;
    $scope.error      = undefined;
    $scope.editPart   = undefined;
    $scope.confirmDisable = false;
    
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
        hSize: '20%',
        vSize: '50%',
        hAlign: 'center',
        vAlign: 'center',
        hideIfClose:  true,
        showClose:    true,
        showMin:      false,
        modal:        true,
        show:         false
      });
      
    $wndMng.setBodyByTemplate($scope.editWnd, '/parts/_basket-edit.html',   $scope);  
    $wndMng.setStatusBar($scope.editWnd, confirmButton,   $scope);  
        
    $scope.delete = function(row){
      if( row === undefined ){
        return;
      }
      var text = "Действительно удалить позицию в корзние " + row.articul + " - " + row.maker + " - " + row.name + "?";
      
      $confirm.request(text).then(
        function(status){
          if( status !== 1 ){
            return;
          }
          row.hide = true;
          $user.deletePart(row.id).then(
            function(response){
              var answer = response && response.data;
              if( !answer ){                
                $notify.addItem('Ошибка удаления','Удалить деталь из корзины не удалось');
                row.hide = false;
                return;
              }
          });
      });  
    };
    
    $scope.edit = function(row){      
      $scope.editPart = row;
      $scope.error    = undefined;
      $scope.confirmDisable = false;
      $wndMng.show($scope.editWnd);
    };
    
    $scope.update = function(){      
      if( !$scope.editPart || $scope.confirmDisable ){
        return;
      }
      
      $scope.confirmDisable = true;
      $user.updatePartInfo($scope.editPart).then(
        function(response){
          var answer = response && response.data;
          if( !answer || !answer['save'] ){
            $scope.error = 'Ошибка записи данных';
            return;            
          }
          $scope.confirmDisable = false;          
        },
        function(reason){          
          $scope.error = reason;
      });
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
