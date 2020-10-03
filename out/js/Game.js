System.registerModule("../../js/Game.js", [], function(require) {
  "use strict";
  var __moduleName = "../../js/Game.js";
  var Game = function Game() {};
  ($traceurRuntime.createClass)(Game, {run: function() {
      "use strict";
      console.log('running');
    }}, {});
  return {get Game() {
      return Game;
    }};
});
System.get("../../js/Game.js" + '');
