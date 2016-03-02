/* global atcCS */

atcCS.controller( 'ordersControl', [
  '$scope', 'User' ,'$rootScope', 'NgTableParams', '$confirm','$wndMng','$notify',
  function($scope,$user,$rootScope,NgTableParams,$confirm,$wndMng,$notify ) {
    'use strict';    
    
    var confirmButton = $('<button class="btn btn-default" ng-class="{disable: confirmDisable===true}" ng-click="update()">Обновить</button>');
    var orderButton = $('<button class="btn btn-info" ng-click="sendOrders()">Заказать</button>');
    
    $scope.isLogin    = $user.isLogin;
    $scope.basketName = $user.activeBasket.name;
    $scope.tableData  = undefined;
    $scope.error      = undefined;
    $scope.editPart   = undefined;
    $scope.items      = {};
    $scope.selected   = false;
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
                item.price_change = true;
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
    
    /*$scope.editWnd = $wndMng.createWindow({
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
      
    $scope.orderWnd = $wndMng.createWindow({
        title: "Заказать детали",        
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
    $wndMng.setBodyByTemplate($scope.orderWnd, '/parts/_basket-order.html',   $scope);  
    $wndMng.setStatusBar($scope.editWnd, confirmButton,   $scope);  
    $wndMng.setStatusBar($scope.orderWnd, orderButton,   $scope);  
        
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
                $notify.error('Ошибка удаления','Удалить позицию из корзины не удалось');
                row.hide = false;
                return;
              }
              $notify.info('Позиция удалена','Позиция ' + row.name + ' удалена из корзины');
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
    
    $scope.order  = function(row){
      var id = row.id;
      if( $scope.items[id] ){
        $scope.items[id].selected = false;
        delete $scope.items[id];        
        return;
      }
      $scope.items[id]  = row;
      row.selected      = true;      
    };
    
    $scope.makeOrder = function(rows){      
      $wndMng.show($scope.orderWnd);
    };
    
    $scope.sendOrders = function(){
      var count = 0;
      $wndMng.hide($scope.orderWnd);
      
      $user.orderParts($scope.items).then(
        function(answer){
          var status = answer.status;
          var errors = answer.error;
          
          for(var i in status){
            for(var r in $scope.items){
              var item = $scope.items[r];
              if( item.id === i ){
                item.hide = true;
                $scope.items[r] = undefined;
                delete $scope.items[r];
                count ++;
              }
            }
          }
          
          for(var e in errors){
            $notify.error('Ошибка заказа','Деталь не была добалвена в заказ');
          }          
          
          $notify.info('В заказе', count + ' позиций были добавлены в заказ');
        }
      );
    };*/
    
    $rootScope.$on('userDataUpdate', 
      function(event){        
        $scope.isLogin = $user.isLogin;        
        if( $user.isLogin && $scope.tableParams ){
          $scope.tableParams.reload();          
        }
     });   
     
     /*$scope.$watch('items',
      function(newVal){
        var cnt = 0;
        for(var i in newVal){
          if( newVal.hasOwnProperty(i)){
            cnt++;            
          }
        };
        $scope.selected = cnt;        
        return newVal;
      },true
     );*/
     
}]);

