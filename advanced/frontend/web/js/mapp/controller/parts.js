/* global atcCS, ObjectHelper, eventsNames */

atcCS.controller( 'parts', [
    '$scope', '$filter', 'User' ,'$routeParams','$rootScope', '$events', '$q', '$log',
    function($scope,$filter,$user,$routeParams,$rootScope, $events, $q, $log ) {
    'use strict';    
    var brands = false;
    var searchEvents = $events.get(eventsNames.eventsSearch());
    
    $scope.loading    = {};    
    $scope.data       = [];
    $scope.data_in    = [];
    $scope.searchText = $routeParams.searchText || false;
    $scope.brand      = $routeParams.brand      || false;
    $scope.rule       = JSON.parse($routeParams.rule)       || false;
    $scope.analogShow = $user.analogShow;
    $scope.markup     = $user.activeMarkup || 0;
    $scope.markupName = $user.activeMarkupName || '';
    $scope.isLogin    = $user.isLogin;
    $scope.isAdmin    = $user.isAdmin;
    $scope.articulCmp = $scope.searchText.toUpperCase();
    $scope.expand     = undefined;
    $scope.sort       = {
      name: undefined,
      order: 0
    };
        
    for(var i in $scope.rule){
        var clsid = $scope.rule[i].id;
        var ident = $scope.rule[i].uid;
       
        $user.getParts(clsid,ident,$scope.searchText,
          function(data){
            serverResponse(clsid, ident, data);
        });
        $scope.loading[clsid] = clsid;        
    }  
    
    function serverResponse(clsid,ident,data){
      delete($scope.loading[clsid]);
      if( !data || !data.rows){
        return;
      }

      $scope.data_in = ObjectHelper.merge($scope.data_in, data.rows);
      var result = [];
      
      for(var i in $scope.data_in){
        var name = i;
        var info = $scope.data_in[i];
        
        var min = {
          price:    Number.MAX_VALUE,
          shiping:  Number.MAX_VALUE
        };
        var speed = {
          price:    Number.MAX_VALUE,
          shiping:  Number.MAX_VALUE
        };
        
        for(var j in info){
          var row = info[j];
          if( (row.price <= min.price) ){
            min.shiping = (row.price===min.price)?Math.min(row.shiping,min.shiping):row.shiping;
            min.price = row.price;
          }
          if( (row.shiping <= speed.shiping) ){            
            speed.price = (row.shiping === speed.shiping)?Math.min(row.price,speed.price):row.price;
            speed.shiping = row.shiping;            
          }
        }
        
        result.push({
          name: name,
          min_price: min,
          min_time: speed,
          rows: info          
        });
      }      
      $scope.data = result;
    }
    
    $scope.selectMaker=function(maker){
      $scope.expand = maker;
    };
    
    $scope.sortBy = function(field){
      if(field===$scope.sort.name){
        $scope.sort.order = 1-$scope.sort.order;
      } else{
        $scope.sort.name = field;
        $scope.sort.order = 1;
      }
    };
    
    $rootScope.$on('markupValueChange', function(event,data){    
      $scope.activeMarkup      = data.value; 
      $scope.activeMarkupName  = data.name;
    });
      
    /*
    
    $scope.showWithMarkup = function(price){
      if( $scope.markup === 0){
        return price;
      }
      return price*(1 + $scope.markup/100);
    };
    
    $scope.showMarkupName = function(){
      if( $scope.markup === 0){
        return "";
      }
      return " [" + $scope.markupName + "]";
    };
    
    
    
    $scope.onArticulSearch = function(articul){
      searchEvents.broadcast("StartSearchText",articul);      
    };
    
    $scope.onAdd  = function(item){      
      /*if( item === undefined ){
        return;
      }*/      
    /*  
      var onAnswer = function(aitem){
        return function(answer){
          item.adding = false;
          if( answer.error ){
            for(var i in answer.error){
              aitem.error = true;
              $notify.error("Ошибка корзины",answer.error[i]);
            }
            return;
          }
          if( answer.save ){
            $notify.info("Деталь добавлена","Деталь " + aitem.name + "добавлена в корзину");
            return;
          }          
        };
      };
      
      item.sell_count = item.lot_quantity;
      item.adding = true;      
      $user.toBasket(item, onAnswer(item));
      return false;
    };
    
    $scope.onCollapse = function(){      
      var data = $scope.table.$rowGroups;
      for(var i in data){
        data[i].show = false;
      }
      return false;
    };
    
    $scope.onExpand = function(){
      var data = $scope.table.$rowGroups;
      for(var i in data){
        data[i].show = true;
      }      
      return false;
    };
    
    $rootScope.$on('analogStateChange', function(event,data){
      $scope.analogShow  = data.value;    
      $scope.tableParams.reload();
    });
    
    $rootScope.$on('markupValueChange', function(event, data){
      $scope.markup     = data.value;
      $scope.markupName = data.value?data.name:'';
      $scope.table.$columns.price.name = "Цена" + $scope.showMarkupName();      
    });
    
    $rootScope.$on('userDataUpdate', function(event){        
        $scope.isLogin = $user.isLogin;         
        $scope.isAdmin = $user.isAdmin;         
     });   
    */
    //load();
}]);