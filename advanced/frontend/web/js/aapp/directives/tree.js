atcCS.directive( 'tree',['$http', function ($http){
  return {
    require: "ngModel",
    priority: 0,
    terminal: false,
    restrict: 'E',
    replace: true,
    template: '',
    transclude: false,
    templateUrl: '/parts/_tree-part.html',
    scope: {
      filter: "@",
      onSelect: "="
    }, 
    controller: function controller($scope, $element, $attrs, $transclude){      
      var UL    = $($element);  
      $scope.filterText = false;

      function itemLoadable(item){
        return !item.subItems && item.url && item.type && (item.type === 'request');
      }

      function serverResponse(item, listItem){
        return function(answer){
          var data = answer && answer.data;
          if( !data ){
            return;
          }
           
          if( data.isRoot === true){
            $scope.filterText = false;
            delete data.isRoot;            
            $scope.data.subItems = data;
            $scope.data.open = true;                 
            $scope.update();
            return;
          }
          
          item.subItems = data;
          createItems(data, listItem);          
        };
      };
      
      function serverRequest(item, listItem){
        var request = {
          url: item.url,
          method:       "GET",
          responseType: 'json',
          params: {
            params: {}
          }
        };
        
        for(var i in item.data){
          request.params.params[i] = item.data[i];
        }
        
        if ( $scope.filterText ){
          request.params.params.filter = $scope.filterText;
        }
        
        $http(request).then( serverResponse(item, listItem) );
      }

      function itemClick(item, listItem){
        return function(event){
          event.stopPropagation();
          $(listItem).toggleClass('open');
          
          if( $(listItem).hasClass('node') ){            
            if( ($scope.onSelect instanceof Function) && (item.data) ){
              $scope.onSelect(item.data);
              return;
            }
          }
          
          if( $(listItem).hasClass('open') && itemLoadable(item) ){              
            serverRequest(item,listItem);
          }          
        };
      }

      function createItem( item ){
        var listItem  = $('<li></li>');
        var ul        = $('<ul></ul>');
        var span      = $('<span></span>');
        var text      = item.text || "???";
        
        span.addClass(item.type);
        
        if( item.open ){
          listItem.addClass('open');
        }
        
        if( span.hasClass('node') ){
          listItem.addClass('node');
        }
        
        span.text(text);
        listItem.append(span);
        listItem.append(ul);
        
        if( item.subItems ){
          for( var i in item.subItems ){
            $(ul).append( createItem(item.subItems[i]) );
          }          
        }        
        listItem.click( itemClick(item, listItem) );
        
        return listItem;
      }

      function createItems(data, root){
        var answer = "";
        var ul = $(root).find('ul');

        for( var i in data){
          $(ul).append( createItem(data[i]) );
        }
        return answer;
      }

      $scope.update = function (){        
        createItems([$scope.data], UL);
      };
      
      $scope.load = function (){
        if( $scope.data.type === 'request' ){          
          serverRequest($scope.data,UL);
        }
      };
      
      $scope.clear = function (){        
        UL.find('ul').html('');        
        delete $scope.data.open;
        delete $scope.data.subItems;                  
      };
    },
    link: function link(scope, element, attrs, modelCtrl){
      scope.$watch(
        function() { return modelCtrl.$viewValue; },
        function(newVal){
          scope.data = newVal;
          scope.update();
          return newVal;
      });
      
      scope.$watch(
        function() {return scope.filter;},
        function(newVal, oldVal){
          var strLen = String(newVal).length;          
          scope.clear();            
          
          if( newVal && (newVal !== oldVal) && (strLen > 3) ){
            scope.filterText = newVal;
            scope.load();
            return newVal;
          }
          
          scope.filterText = false;
          scope.update();
          
          return newVal;
      });
    }
  };
}] );


