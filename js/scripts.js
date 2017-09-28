function Player(id) {
  this.id = id;
  this.name = "";
  this.hardScore = 0;
  this.softScore = 0;
  this.avatar = 0;
  this.rolls = 0;
}

function Game() {
  this.players = [];
  this.round = 1;
  this.currentPlayer = 0;
  this.inProgress = false;
  this.rolllog = [];
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
  player.rolls += 1
  if (roll === 1) {
    player.softScore = 0
    return this.endTurn(player);
  } else {
    player.softScore += roll
    return player;
  }
}


// JQUERY //

var addPlayer = function(game) {
  var id = game.players.length;
  var playerid = "player-"+id;
  $("#player-list").append(`
    <div id="` + playerid + `" class="well">
      <div class="row">
      <div class="col-md-3">
        <img class="avatar-display" id="avatar-` + id + `" src="img/default.png">
      </div>
        <div class="col-md-9">
          <form id="` + playerid + `-form" class="form-name">
            <div class="form-group">
              <input class="form-control" type="text" placeholder="Enter player name" id="` + playerid + `-name">
              <input type="checkbox" name="computer-player" value="computer-control" id="`+ playerid + `-is-computer"> Computer Player Mode<br>
            </div>
          </form>
          <h2 id="` + playerid + `-title" class="playername"></h2>
          <p class = "score">Score: <span id="` + playerid + `-score"></span></p>
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

  $("#avatar-" + id).click(function() {
    console.log("AHHHA");
    game.editAvatar = id
    $("#avatar-screen").show();
  });
};

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

var updateTurnDisplay = function(player) {
  $("#current-player").text(player.name);
  $("#roll-total").text(player.softScore);
}

Player.prototype.canPlay = function(game) {
  return game.inProgress && game.currentPlayer === this.id;
}

var checkGameState = function(game) {
  game.players.forEach(function(player) {
    if (player.hardScore >= 100) {
      $("#post-game").show();
      $("#dice-board").hide();
      $("#winner").text(player.name + " won the game! Yahoo!!");
      game.inProgress = false;
    }
    if (player.isComputer) {
      $(".dice-play").hide();
    } else {
      $(".dice-play").show();
    }
    if (player.canPlay(game) && player.isComputer) {
      var interval = setInterval(function() {
        if ( !(player.isComputer && player.canPlay(game) && player.softScore < 10)) {
          clearInterval(interval);
          return;
        }
        var rolled = rollDie(game);
        if (player.softScore >= 7) {
          holdDie(game);
        }
      }, 2000);
    }
  });
}

var logRoll = function(game, text) {
  game.rolllog.forEach(function(log) {
    if (!log.revered) {
      log.revered = true
      log.reverse();
      log.play();
    }
  });

  var logid = game.rolllog.length

  $("#roll-log").prepend(`<div id = "logline-` + logid + `" class="anime-roll">` + text + "</div>");

  game.rolllog.push(anime({
    targets: "#logline-" + logid,
    scale: 2,
    duration: 500,
    easing: "easeInOutBack"
  }));

  if (logid >= 10) {
    $(".anime-roll").last().remove()
  }
}

var rollDie = function(game) {
  var roll = game.roll();
  var currentPlayer = game.players[game.currentPlayer];
  var nextPlayer = game.applyRoll(currentPlayer, roll);

  var text = currentPlayer.name + " rolled a " + roll

  if (roll === 1) {
    text += " and Busted!"
  } else {
    text += "!"
  }
  logRoll(game, text);

  updateScores(currentPlayer);
  updateTurnDisplay(nextPlayer);
  checkGameState(game);
  return roll;
}

var holdDie = function(game) {
  var currentPlayer = game.players[game.currentPlayer];
  logRoll(game, currentPlayer.name + " Holds " + currentPlayer.softScore + ".");
  var nextPlayer = game.endTurn(currentPlayer);
  updateScores(currentPlayer);
  updateTurnDisplay(nextPlayer);
  checkGameState(game);
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
    $("#dice-board").show();
    $("#post-game").hide();
    game.inProgress = true;
    game.players.forEach(function(player) {
      var id = player.id;
      player.name = $("#player-" + id + "-name").val();
      $("#player-" + id + "-form").hide();
      $("#preround-control").hide();
      $("#player-" + id + "-title").text(player.name);
      $(".score").show();
      updateScores(player);
      player.isComputer = $("#player-" + id + "-is-computer:checked").val();
    });
    game.currentPlayer = 0;
    updateTurnDisplay(game.players[0]);
    checkGameState(game);
  });
  $(".avatar-select").click(function() {
    var newImage = $(this).attr("src");
    $("#avatar-" + game.editAvatar).attr("src", newImage);
  });

  $("#die-roll").click(function(){
    rollDie(game);
  });
  $("#die-hold").click(function(){
    holdDie(game);
  });

  $("#reset-game").click(function() {
    $("#post-game").hide();
    $("#preround-control").show();
    $(".anime-roll").remove();
    game.rollLog = [];
    game.rollLog.length = 0;
    game.players.forEach(function(player) {
      player.softScore = 0;
      player.hardScore = 0;
      player.rolls = 0;
      updateScores(player);
    });
  });
});
