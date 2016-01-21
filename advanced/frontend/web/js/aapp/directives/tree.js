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

      function itemLoadable(item){
        return !item.subItems && item.url && item.type && (item.type === 'request');
      }

      function serverAnswer(item, listItem){
        return function(answer){
          var data = answer && answer.data;
          if( !data ){
            return;
          }
          
          item.subItems = data;
          createItems(data, listItem);          
        };
      };

      function itemClick(item, listItem){
        return function(event){
          if( $(listItem).hasClass('open') ){
            $(listItem).removeClass('open');
          }else {
            $(listItem).addClass('open');                     
            
            if( itemLoadable(item) ){
              var request = {
                url:          item.url,
                method:       "GET",
                responseType: 'json',
                params: {
                  params: item.data
                }
              };
              $http(request).then( serverAnswer(item, listItem) );              
            }
          }
          event.stopPropagation();
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
    },
    link: function link(scope, element, attrs, modelCtrl){
      scope.$watch(
        function() { return modelCtrl.$viewValue; },
        function(newVal){
          scope.data = newVal;
          scope.update();
          return newVal;
      });
      console.log(scope.filter);
      scope.$watch('filter',
        function(newVal, oldVal){
          console.log('Filter',scope.filter, oldVal);
          return newVal;
      });
    }
  };
}] );


