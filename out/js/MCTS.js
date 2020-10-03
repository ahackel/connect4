System.registerModule("../../js/MCTS.js", [], function(require) {
  "use strict";
  var __moduleName = "../../js/MCTS.js";
  function maximum(a) {
    var max = -10000000;
    var index = 0;
    for (var i = 0; i < a.length; i++) {
      if (a[$traceurRuntime.toProperty(i)] > max) {
        max = a[$traceurRuntime.toProperty(i)];
        index = i;
      }
    }
    return index;
  }
  var MTCS = function MTCS(game, maxDepth) {
    this.game = game;
    this.maxDepth = maxDepth;
  };
  ($traceurRuntime.createClass)(MTCS, {
    run: function(state, player) {
      this.player = player;
      this.states = [];
      this.state = state;
      return this.iterate_(this.maxDepth, Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER, player).move;
    },
    iterate_: function(depth, alpha, beta, player) {
      var possibleMoves = this.game.getNextPossibleMoves(this.state, player);
      var maximize = (player == this.player);
      var bestMove = -1;
      var otherPlayer = (player == 1) ? 0 : 1;
      if (depth == 0 || possibleMoves.length == 0 || this.game.isGameOver(this.state)) {
        var score = this.game.getScore(this.state, this.player, depth);
        return {
          score: score,
          move: bestMove
        };
      }
      for (var $__1 = possibleMoves[$traceurRuntime.toProperty($traceurRuntime.toProperty(Symbol.iterator))](),
          $__2; !($__2 = $__1.next()).done; ) {
        var move = $__2.value;
        {
          this.states.push(this.state);
          this.state = this.state.copy();
          this.game.doMove(this.state, move, player);
          var score$__3 = this.iterate_(depth - 1, alpha, beta, otherPlayer).score;
          if (maximize) {
            if (score$__3 > alpha) {
              alpha = score$__3;
              bestMove = move;
            }
          } else {
            if (score$__3 < beta) {
              beta = score$__3;
              bestMove = move;
            }
          }
          this.state = this.states.pop();
          if (alpha >= beta)
            break;
        }
      }
      return {
        score: (maximize) ? alpha : beta,
        move: bestMove
      };
    }
  }, {});
  return {get MTCS() {
      return MTCS;
    }};
});
System.get("../../js/MCTS.js" + '');
