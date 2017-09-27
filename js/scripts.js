function Game() {
  this.players = [];
  this.round = 1;
  this.currentPlayer = 0;
}

Game.prototype.addPlayer = function(id) {
  var player = new Player(id)
  this.players.push(player)
};

Game.prototype.roll = function() {
  return parseInt(Math.random() * 6) + 1;
}

Game.prototype.endTurn = function(player) {
  player.hardScore += player.softScore;
  player.softScore = 0;
  var nextPlayerID = this.currentPlayer +=1
  if (!this.players[nextPlayerID]) {
    nextPlayerID = 0;
  }
  this.currentPlayer = nextPlayerID;
  return this.players[nextPlayerID];
};

Game.prototype.applyRoll = function(player, roll) {
  if (roll === 1) {
    player.softScore = 0
    return this.endTurn(player);
  } else {
    player.softScore += roll
    return player;
  }
}

function Player(id) {
  this.id = id;
  this.name = "";
  this.hardScore = 0;
  this.softScore = 0;
  this.avatar = 0;
}

// JQUERY //
var initGameDisplay = function(game) {
  game.players.forEach(function(player) {
    var id = player.id;
    player.name = $("#player-" + id + "-name").val();
    $("#player-" + id + "-form").hide();
    $("#preround-control").hide();
    $("#player-" + id + "-title").text(player.name);
    $("#player-" + id).append(`
      <p>Score: <span id="player-` + id + `-score"></span>
    `)
    turnDisplayUpdate(player);
    console.log(game);
  });
}



var addPlayer = function(game) {
  var id = game.players.length;
  var playerid = "player-"+id;
  $("#player-list").append(`
    <div id="` + playerid + `" class="well">
      <div class="row">
        <div class="col-md-9">
          <form id="` + playerid + `-form" class="form-name">
            <div class="form-group">
              <input class="form-control" type="text" placeholder="Enter player name" id="` + playerid + `-name">
            </div>
          </form>
          <h2 id="` + playerid + `-title" class="playername"></h2>
        </div>
      </div>
    </div>
  `);
  if (id > 1) {
    $("#preround-remove").show();
  }

  if (id >= 9) {
    $("#preround-add").hide();
  }
  game.addPlayer(id);
}

var removePlayer = function(game) {
  var player = game.players.pop();
  var id = player.id;
  $("#player-"+id).remove();
  if (id === 2) {
    $("#preround-remove").hide();
  }
  $("#preround-add").show();
}

var updateScores = function(player) {
  $("#player-" + player.id + "-score").text(player.hardScore)
}

var turnDisplayUpdate = function(player) {
  $("#current-player").text(player.name);
  $("#roll-total").text(player.softScore);
}


$(document).ready(function() {
  var game = new Game();

  addPlayer(game);
  addPlayer(game);
  $("#preround-add").click(function() {
    addPlayer(game);
  });
  $("#preround-remove").click(function() {
    removePlayer(game);
  });
  $("#preround-start").click(function() {
    initGameDisplay(game);
  });
  $("#die-roll").click(function(){
    var roll = game.roll();
    $("#roll-result").text("You rolled a " + roll);
    var currentPlayer = game.players[game.currentPlayer];
    var nextPlayer = game.applyRoll(currentPlayer, roll);
    updateScores(currentPlayer);
    turnDisplayUpdate(nextPlayer);
  });
  $("#die-hold").click(function(){
    var currentPlayer = game.players[game.currentPlayer];
    var nextPlayer = game.endTurn(currentPlayer);
    updateScores(currentPlayer);
    turnDisplayUpdate(nextPlayer);
  });

});
