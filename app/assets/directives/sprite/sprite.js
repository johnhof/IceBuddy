
// add a sprite from the sprite sheet
//
simpleApp.directive('sprite', ['Utils', function (Utils) {
  return {
    restrict : 'E',
    replace  : true,
    scope    : {
      href : '@',
      name : '@'
    },
    template : '<span class="sprite {{name}} size-{{size}}"  target="__blank"></span>',
    link     : function (scope, element, attrs) {
      scope.href = attrs.href;
      scope.name = attrs.name;
      scope.size = attrs.size || '32';

      scope.spriteTab = Utils.newTab;
    }
  };
}]);
