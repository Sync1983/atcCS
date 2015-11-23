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

    },
    controller: function controller($scope, $element, $attrs, $transclude){

      var UL    = $($element).find('ul');

      function serverAnswer(item, listItem){
        return function(answer){
          var data = answer && answer.data;
          console.log(data);
          if( !data ){
            return;
          }
          item.subItems = data;
          
          var ul = $('<ul></ul>');
          ul.append( updateItem(item) );
          listItem.append(ul);
        };
      };

      function itemClick(item, listItem){
        return function(event){
          if( $(listItem).hasClass('open') ){
            $(listItem).removeClass('open');
          }else {
            $(listItem).addClass('open');
            if( !item.subItems && item.url && item.type && (item.type === 'request') ){
              var request = {
                url:          item.url,
                method:       "GET",
                responseType: 'json',
                params: {
                  params: item.data
                }
              };
              $http(request).then(serverAnswer(item, listItem));
              return listItem;
            }
          }
          event.stopPropagation();
        };
      }

      function updateItem(item){
        var listItem  = $('<li></li>');
        var span      = $('<span></span>');
        var text      = item.text?item.text:"???";
        
        span.text(text);
        listItem.append(span);
        listItem.click(itemClick(item,listItem));

        /*if( !item.subItems && item.url && item.type && (item.type === 'request') ){
          var request = {
            url:          item.url,
            method:       "GET",
            responseType: 'json',
            params: {
              params: item.data
            }
          };
          $http(request).then(serverAnswer(item, listItem));
          return listItem;
        }*/

        if( !item.subItems ){
          return listItem;
        }

        var list = $("<ul></ul>");
        for(var i in item.subItems){
          var value = item.subItems[i];          
          list.append( updateItem(value) );
        }
        listItem.append(list);
        return listItem;
      };

      $scope.update = function treeUpdate(){
        console.log($scope.data);
        /*$scope.data = {
          type: 'text',
          text: "asdf",
          subItems: [
            {
              type: 'text',
              text: "bsdf",
              subItems:[
                {
                type: 'text',
                text: "bbsdf"
                }
              ]
            },
            {
              type: 'text',
              text: "csdf",
              subItems:[
                {
                  type: 'text',
                  text: "ccsdf"
                }
              ]
            }
          ]
        };*/
        $(UL).html( updateItem($scope.data) );
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
    }
  };
}] );


