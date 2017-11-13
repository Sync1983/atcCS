/* global atcCS */ 
/* global eventsNames */ 

atcCS.controller( 'main-screen',['$scope','User','$templateCache','$menu', '$events', '$windowSrv', '$location', 
  function($scope,$user,$templateCache,$menu,$events, $window, $location) {
    'use strict';
    
    var menuEvents = $events.get(eventsNames.eventsMain());
    var searchEvents = $events.get(eventsNames.eventsSearch());
    
    $scope.searchText = "3465";
    menuEvents.setListner('menuSelect', onMenuSelect);
    searchEvents.setListner('change', onSearchChange);
    
    $scope.onMenuLoad = function(){
      $menu.setEventsListner(menuEvents,'menuSelect');
      $menu.clear();
      $menu.addItem("main","Главная");
      if( $user.isLogin !== true ){
        $menu.addItem("login", "Войти");        
      } else {
        $menu.addItem("change-markup", "Сменить наценку", $user.activeMarkupName || undefined);
        $menu.addItem("change-basket", "Сменить корзину", $user.activeBasket && $user.activeBasket.name || undefined);
      }
      console.log($user);
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
    }
    
    function onMenuSelect(name, args){
      
      if(args === "login"){
        menuLogin();
      } else if(args === "change-analog"){
        $user.analogShow = !$user.analogShow;
      }
      
    };
    
    function onSearchChange(name,args){
      $scope.searchText = args;
    };
    
    
   
    
}]);