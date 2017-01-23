/* global atcCS, ObjectHelper */

atcCS.controller( 'partsSearch', [
    '$scope','$filter', 'User' ,'$routeParams','$rootScope','searchNumberControl', 'storage', 'NgTableParams', 'partOutFilter', '$notify', '$q', '$log', 'tableViewData',
    function($scope,$filter,$user,$routeParams,$rootScope,$snCtrl, $storage, NgTableParams, $partOut, $notify, $q, $log, tableViewData ) {
    'use strict';    
    var brands = false;
    var requestParams = {};
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
    
    $scope.tableParams = new NgTableParams(
      { 
        group: {
          "maker" : "asc",
           sortGroups: false
        },
        showGroupHeader: false,
        hidePager: true,        
      },
      {        
        counts: [],        
        applySort:false,
        applyMultipage:false,
        getData: function(params){            
          var sorting = params.sorting();
          
          var originalArray = [];
          var notOriginalArray = [];
          var resultArray = [];
          console.profile('sorting');
          for( var key in $scope.data){
            var item        = $scope.data[key];
            item.viewPrice  = item.price.toFixed(2);
            item.stdArticul = String(item.articul).toUpperCase();
            item.key        = key;
            
            if( $scope.markup ){
              item.viewPrice = (item.price * (1 + $scope.markup/100)).toFixed(2);              
            }
            
            if( item.maker && 
                item.articul && 
                (item.maker === $scope.brand) && 
                (item.stdArticul  === $scope.articulCmp ) ){
              originalArray.push(item);              
            } else {
              notOriginalArray.push(item);
            }
          }
          
          resultArray = originalArray.sort(sortFunction(sorting));
          if( $scope.analogShow ){
            notOriginalArray.sort(sortFunction(sorting));
            resultArray = ObjectHelper.concat(originalArray,notOriginalArray);            
          }
          console.profileEnd('sorting');
          return resultArray;
        }
      }
    ); 
    
    $scope.table = {
      fields:{        
      },
      templates: {   
        
      },
      hightlight: {
        articul: $scope.articulCmp
      },
      data: {}
    };
    
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
        basket: "<span><button ng-click=\"onAdd(row)\" ng-show=\"isLogin&&!row.adding&&!row.error\">'Добавить'</button><span class=\"load-info\" ng-show=\"row.adding\"></span></span>"
      }
    });
    
    console.log($scope.table);
    
    $scope.onArticulSearch = function(articul){
      console.log(123);      
      console.log(articul);      
    };
    
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
      var storage = $storage.get($scope.timestamp+'@'+clsid+'@'+ident);
      if( storage ){                
        serverResponse(clsid,ident,storage);                
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
      
      if( !data ){
        return;
      }
      
      $storage.set($scope.timestamp+'@'+clsid+'@'+ident,data);      
      $scope.table.addData(data.rows);
    }
    
    function sortFunction($sort){
      return function(itemA,itemB){
        var result = 0;        
        for(var key in $sort){
          var direct = ($sort[key]==='desc')?-1:1;
          var valA   = itemA[key];
          var valB   = itemB[key];
          if( (key==='viewPrice') || (key==='price') || (key==='shiping') || (key==='count') ){
            valA  *= 1;
            valB  *= 1;            
          }
          
          result += (valA>valB)?direct:0;
          result -= (valA<valB)?direct:0;
        }
        return result;
      };
    }
    
    $scope.onAdd  = function(item){      
      /*if( item === undefined ){
        return;
      }      
      
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
      
      item.sell_count = item.lot_quantity;*/
      item.adding = true;      
      //$user.toBasket(item, onAnswer(item));
      return false;
    };
    
    $scope.onCollapse = function(){      
      var data = $scope.tableParams.data;
      angular.forEach(data,function(item){        
        item.$hideRows = true;
        return item;
      });
      
      return false;
    };
    
    $scope.onExpand = function(){
      var data = $scope.tableParams.data;
      angular.forEach(data,function(item){        
        item.$hideRows = false;
        return item;
      });
      
      return false;
    };
    
    $rootScope.$on('analogStateChange', function(event,data){
      $scope.analogShow  = data.value;    
      $scope.tableParams.reload();
    });
    
    $rootScope.$on('markupValueChange', function(event, data){
      $scope.markup     = data.value;
      $scope.markupName = data.value?data.name:'';
      $scope.tableParams.reload();      
    });
    
    $rootScope.$on('userDataUpdate', 
      function(event){        
        $scope.isLogin = $user.isLogin;        
     });   
    
}]);