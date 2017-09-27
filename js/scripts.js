function Game() {
  this.players = [];
  this.round = 0;
}

Game.prototype.addPlayer = function(id) {
  var player = new Player(id)
  this.players.push(player)
};

function Player(id) {
  this.id = id;
  this.name = "";
  this.hardScore = 0;
  this.softScore = 0;
  this.avatar = 0;
}

// JQUERY //

var addPlayer = function(game) {
  var id = game.players.length;
  var playerid = "player-"+id;
  $("#player-list").append(`
    <div id="` + playerid + `" class="well">
      <div class="row">
        <div class="col-md-9">
          <form id="` + playerid + `-name" class="form-name">
            <div class="form-group">
              <input class="form-control" type="text" placeholder="Enter player name" id="` + playerid + `-name">
            </div>
          </form>
          <h2 id="` + playerid + `-name" class="playername"></h2>
        </div>
      </div>
    </div>
  `);
  game.addPlayer(id);
}

var removePlayer = function(game) {
  var player = game.players.pop();
  var playerid = "player-"+ player.id;
  $("#"+playerid).remove();
}

$(document).ready(function() {
  var game = new Game();

  addPlayer(game);
  $("#preround-add").click(function() {
    addPlayer(game);
  });
  $("#preround-remove").click(function() {
    removePlayer(game);
  });

});
