app.directive('message', function(){
    return {
        restrict: 'E',
        templateUrl: 'js/common/directives/message/message.html',
        scope: {
            message: '=',
            chatBox: '='
        },
        link: function(scope, elem, attrs){
            scope.chatBox.scrollTop = scope.chatBox.scrollHeight;
        }
    }
})