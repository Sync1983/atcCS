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
      filter: "@"
    },
    controller: function controller($scope, $element, $attrs, $transclude){      
      var UL    = $($element);
      $scope.loadFilter = true;

      function itemLoadable(item){
        return !item.subItems && item.url && item.type && (item.type === 'request');
      }

      function serverResponse(item, listItem){
        return function(answer){
          var data = answer && answer.data;
          if( !data ){
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
            params: item.data
          }
        };
        
        if ( $scope.filter ){
          request.params.params.filter = $scope.filter;
        }
        
        $http(request).then( serverResponse(item, listItem) );
      }

      function itemClick(item, listItem){
        return function(event){
          event.stopPropagation();
          if( $(listItem).hasClass('open') ){
            $(listItem).removeClass('open');
            return false;
          }
          
          $(listItem).addClass('open');                     
            
          if( itemLoadable(item) ){              
            serverRequest(item,listItem);
          }          
        };
      }

      function createItem(item){
        var listItem  = $('<li></li>');
        var ul        = $('<ul></ul>');
        var span      = $('<span></span>');
        var text      = item.text || "???";

        if( item.type === "group" ){
          span.addClass('node');
        }
        span.text(text);
        listItem.append(span);
        listItem.append(ul);
        createItems(item.subItems,ul); 
        listItem.click( itemClick(item, listItem) );
        
        return listItem;
      }

      function createItems(data, root){
        var answer = "";
        var ul = $(root).find('ul');

        for( var i in data){
          var item = data[i];
          var htmlItem = createItem(item);
          $(ul).append(htmlItem);
        }
        return answer;
      }

      $scope.update = function treeUpdate(){        
        createItems($scope.data, UL);
      };
      
      $scope.clear = function treeUpdate(){
        function clearSubTree(root){
          if( root.subItems ){
            root.subItems = undefined;
            delete root.subItems;
          }
        }
        
        var list = UL.find('ul');
        list.html('');
        clearSubTree($scope.data);
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
      
      scope.$watch('filter',
        function(newVal, oldVal){
          /*if (scope.data){
            if( newVal ){
              scope.data.filter = newVal;
            } 
            else {
              delete scope.data.filter;
            }
          }*/
          console.log('Filter',scope.filter, oldVal, newVal);
          
          if( newVal ){
            console.log('renew');
            scope.filter = newVal;
            scope.clear();
            scope.update();            
          }
          return newVal;
      });
    }
  };
}] );


