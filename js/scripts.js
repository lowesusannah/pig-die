function Game() {
  this.players = [];
  this.currentPlayer = 0;
  this.round = 0;
}

Game.prototype.addPlayer = function(id) {
  var player = new Player(id)
  this.players.push(player)
};

Game.prototype.initialize = function() {

}

Game.prototype.roll = function() {
  return parseInt(Math.random() * 6) + 1;
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
    updateScores(player);
  });
}

var turnDisplayUpdate = function(player) {
  $("#current-player").text(player.name);
  $("#roll-total").text(player.softScore);
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

var updateScores = function(player) {
  $("#player-" + player.id + "-score").text(player.hardScore)
}

var removePlayer = function(game) {
  var player = game.players.pop();
  console.log(player);
  var id = player.id;
  $("#player-"+id).remove();
  if (id === 2) {
    $("#preround-remove").hide();
  }
  $("#preround-add").show();
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
    game.players[0].softScore = game.players[0].softScore + roll;
    turnDisplayUpdate(game.players[0]);
  });

});
