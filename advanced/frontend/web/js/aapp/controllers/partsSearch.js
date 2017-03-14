/* global atcCS, ObjectHelper, eventsNames */

atcCS.controller( 'partsSearch', [
    '$scope', '$filter', 'User' ,'$routeParams','$rootScope','searchNumberControl', 'storage', '$events', 'partOutFilter', '$notify', '$q', '$log', 'tableViewData',
    function($scope,$filter,$user,$routeParams,$rootScope,$snCtrl, $storage, $events, $partOut, $notify, $q, $log, tableViewData ) {
    'use strict';    
    var brands = false;
    var searchEvents = $events.get(eventsNames.eventsSearch());
    $scope.loading    = {};    
    $scope.data       = [];
    $scope.timestamp  = $routeParams.timestamp  || false;
    $scope.searchText = $routeParams.searchText || false;
    $scope.brand      = $routeParams.brand      || false;
    $scope.analogShow = $user.analogShow;
    $scope.markup     = $user.activeMarkup || 0;
    $scope.markupName = $user.activeMarkupName || '';
    $scope.isLogin    = $user.isLogin;
    $scope.isAdmin    = $user.isAdmin;
    $scope.articulCmp = $scope.searchText.toUpperCase();
    
    $snCtrl.change($scope.searchText); 
    
    $scope.table = new tableViewData({
      $columns: {
        maker:    {name: "Производитель", width:"10"},
        articul:  {name: "Артикул",       width:"15"},
        name:     {name: "Наименование",  width:"40", align: "left"},
        price:    {name: "Цена",          width:"8"},
        shiping:  {name: "Срок",          width:"8"},
        count:    {name: "Наличие",       width:"8"},
        basket:   {name: "В корзину",     width:"8"}        
      },
      template: {
        articul: ["<span style='float:none'>{{row.articul}}",
                  "  <div class='articul-search-div'>",
                  "    <button ng-click='onArticulSearch(row.articul)'>",
                  "      <span class='glyphicon glyphicon-search'>",
                  "      </span>",
                  "    </button>",
                  "  </div>",
                  "</span>"].join(""),
        basket:  ["<span>",
                  "  <button ng-click='onAdd(row)' class='basket-add-button'",
                  "           ng-show='isLogin&&!row.adding&&!row.error'>",
                  "     <span class='glyphicon glyphicon-plus'></span>",
                  "     Добавить",
                  "  </button>",
                  "  <span class='load-info' ng-show='row.adding'></span>",
                  "</span>"].join(""),
        name:     "<span title='{{row.name}}'><span ng-if='isAdmin'>{{row.prvd}} : {{row.stock}} </span>{{row.name}}</span>",
        price:    "<span title='{{showWithMarkup(row.price) | number:2}}'>{{showWithMarkup(row.price) | number:2}}</span>",
        count:   ["<span>{{row.count}}",
                  " <div class='lot-quantity' title='Минимальное количество для заказа' ng-show='(row.lot_quantity>1)'>",
                  "   <span class='glyphicon glyphicon-th-large'></span> {{row.lot_quantity}}",
                  " </div>",
                  "</span>"].join("")
      },
      hlight: {
        articul: $scope.articulCmp
      },
      sortRows: sortFunction,
      sortGroups: sortHeader,
      sort: {
        maker: 1,
        price: 1,
        shiping: 1
      },
      filter: function(row){
        return $scope.analogShow || (row.isOriginal===1);
      }
    });
    
    $scope.self = $scope; 
    
    function getRequsetParams(){
      var requestParams;
      brands = $storage.get($scope.timestamp);
    
      if( !$scope.timestamp || !brands ) {       
        return {};
      }
      
      for(var brand in brands.rows){        
        if( brand !== $scope.brand ){
          continue;
        }
        requestParams = brands.rows[brand];
      }            
      
      return requestParams;
    }
    
    function loadingData(requestParams){
      for(var i in requestParams){
        var clsid = requestParams[i].id;
        var ident = requestParams[i].uid;
        var storage = $storage.get($scope.timestamp+'@'+clsid+'@'+ident+'@'+$scope.searchText);
        if( storage ){                
          serverResponse(clsid,ident,storage);                
        } else{
          $user.getParts(clsid,ident,$scope.searchText,serverResponseCall(clsid, ident));
          $scope.loading[clsid] = clsid;        
        }
      }      
    }    
    
    function serverResponseCall($clsid, $ident){
      return function(data){
        serverResponse($clsid,$ident,data);
      };
    }
    
    function serverResponse(clsid,ident,data){
      delete($scope.loading[clsid]);
      
      if( !data ){
        return;
      }
      
      $storage.set($scope.timestamp+'@'+clsid+'@'+ident+'@'+$scope.searchText,data);      
      $scope.table.addData(data.rows);
    }
    
    function load(){
      loadingData( getRequsetParams() );
    }
    
    function sortFunction(sort){
      
      function isNumeric(obj) {
        return !isNaN(obj - parseFloat(obj));
      }
      
      function calcWeight(rowA, rowB, sort){
        var weightA = 0;
        var weightB = 0;        
        var A,B;
        if( String(rowA.articul).toUpperCase() === $scope.articulCmp ){
          weightA -= 100;
        }
        if( String(rowB.articul).toUpperCase() === $scope.articulCmp ){
          weightB -= 100;
        }
          
        for(var cKey in sort){
          
          if( isNumeric(rowA[cKey]) && isNumeric(rowB[cKey]) ){
            A = parseFloat(rowA[cKey]);
            B = parseFloat(rowB[cKey]);
          } else {
            A = String(rowA[cKey]).toUpperCase();
            B = String(rowB[cKey]).toUpperCase();            
          }
          
          if( A > B ){
            weightA += sort[cKey];
          } else if( A < B){
            weightB += sort[cKey];            
          }
          
        }
        
        
        if( weightA > weightB ){
          return 1;
        } else if( weightA < weightB ){
          return -1;
        }
        
        return 0;
        
      }
      
      return function(rowA, rowB){
        return calcWeight(rowA, rowB, sort);
      };
    }   
    
    function sortHeader(sort) {
      
      return function(headA, headB){
        var res = 0, brandOffset = 0;
        
        if( headA.name === $scope.brand ){
          brandOffset -= 10;
        }
        if( headB.name === $scope.brand ){
          brandOffset += 10;
        }
        
        if( sort.maker === undefined ){
          return brandOffset;
        }
        
        if( headA.name > headB.name ){
          res = 1;
        } else if( headA.name < headB.name ){
          res = -1;
        }
        return brandOffset + res * sort.maker;
      };
    }
    
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
    
    $scope.table.$columns.price.name = "Цена" + $scope.showMarkupName();
    
    $scope.onArticulSearch = function(articul){
      searchEvents.broadcast("StartSearchText",articul);      
    };
    
    $scope.onAdd  = function(item){      
      /*if( item === undefined ){
        return;
      }*/      
      
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
    
    load();
}]);