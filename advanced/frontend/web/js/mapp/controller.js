/* global atcCS */ 
/* global eventsNames */ 

atcCS.controller( 'main-screen',['$scope','User','$rootScope','$menu', '$events', '$windowSrv', '$location', 
  function($scope,$user,$rootScope,$menu,$events, $window, $location) {
    'use strict';
    
    var menuEvents = $events.get(eventsNames.eventsMain());
    var searchEvents = $events.get(eventsNames.eventsSearch());
    var searchInput = $("#search-input");
    
    $scope.searchText = "";    
    $scope.markups = $user.markup;
    $scope.selectedMarkup = undefined;
    
    menuEvents.setListner('menuSelect', onMenuSelect);
    searchEvents.setListner('change', onSearchChange);
    searchEvents.setListner('StartSearchText', onSearchStart);
    
    $scope.onMenuLoad = function(){
      $menu.setEventsListner(menuEvents,'menuSelect');
      $menu.clear();
      $menu.addItem("main","Главная");
      $menu.addItem("show-catalog", "Каталог", undefined);
      
      if( $user.isLogin !== true ){
        $menu.addItem("login", "Войти");        
      } else {
        $menu.addItem("change-markup", "Сменить наценку", $user.activeMarkupName || undefined);
        $menu.addItem("change-basket", "Сменить корзину", $user.activeBasket && $user.activeBasket.name || undefined);
        $menu.addItem("show-basket", "Корзина", undefined);
      }
      $menu.addItem("change-analog", "Показывать аналоги", $user.analogShow?"Да":"Нет" );
        
      $menu.show();
    };
    
    $scope.onSearch = function(){
      var clearText   = String($scope.searchText).replace(/\W*/gi,"");
        $scope.$evalAsync(function() {
          $location.path('brands/'+clearText);
        });       
    };
    
    function menuLogin(){
      $window.setTemplate('/login-window.html',$scope);
      $window.show().then(
        function(ok){          
          $user.login($scope.login, $scope.pass, $scope.reuse);
        },
        function(reject){
           
        }
      );
    };
    
    function menuBasket(){
      $window.setTemplate('/select-basket-window.html',$scope);
      $window.show().then(
        function(ok){          
          //$user.login($scope.login, $scope.pass, $scope.reuse);
        },
        function(reject){
           
        }
      );
    };
    
    function menuMarkup(){
      $scope.markups = $user.markup;
      for(var i in $scope.markups){
        if($scope.markups[i].v === $user.activeMarkup){
          $scope.selectedMarkup = $scope.markups[i];
          break;
        }
      };
      $window.setTemplate('/select-markup-window.html',$scope);
      $window.show().then(
        function(ok){          
          $rootScope.$broadcast('markupValueChange',{value:$scope.selectedMarkup.v,name:$scope.selectedMarkup.n});
        },
        function(reject){
           
        }
      );
    };
    
    function onMenuSelect(name, args){
      
      if(args === "login"){
        menuLogin();
      } else if(args === "change-analog"){
        $user.analogShow = !$user.analogShow;
      } else if(args === "change-basket"){
        menuBasket();
      } else if(args === "change-markup"){
        menuMarkup();
      } else if(args === "show-basket"){
        $scope.$evalAsync(function() {
          $location.path('basket/');
        });      
      } else if(args === "show-catalog"){
        $scope.$evalAsync(function() {
          $location.path('catalog/');
        });
      }
      
    };
    
    function onSearchChange(name,args){      
      $(searchInput).val(args).trigger('change');
    };
    
    function onSearchStart(name,args){         
      $(searchInput).val(args).trigger('change');
      $scope.searchText = args;
      $scope.onSearch();
    };
    
    
   
    
}]);