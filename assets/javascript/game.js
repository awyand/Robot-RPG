$(document).ready(function() {
  // Initialize isPlayerChosen boolean
  // Used for determining if robot being clicked goes in player or enemy area
  var isPlayerChosen = false;

  // Initialize round variable
  // Used for keeping track of rounds
  var round = 1;

  // Initialize playerRobot and enemyRobot
  // Used to store robot objects throughout game
  var playerRobot;
  var enemyRobot;

  // Initialize playerAttack
  // Used to increase player attack power each time player attacks
  var playerAttack;

  // Initialize player and enemy health
  // Used for tracking health
  var playerHealth;
  var enemyHealth;

  // Initialize player and enemy starting health
  // Initialize player and enemy health percentages
  // Used for updating health bars
  var playerStartingHealth;
  var enemyStartingHealth;
  var playerHealthPerc;
  var enemyHealthPerc;

  // Initialize enemiesRemaining
  // Used for determining if the player has defeated all enemies or not
  var enemiesRemaining = 0;

  // Initialize isCurrentlyFighting boolean
  // Used to determine if attack button should do anything or not
  var isCurrentlyFighting;

  // Initialize robotArray as empty array
  var robotArray = [];

  // Declare Robot class
  class Robot {
    constructor(name, profileImage, fightImage, healthPoints, attackPower, counterAttackPower) {
      this.name = name;
      this.profileImage = "assets/images/" + profileImage;
      this.fightImage = "assets/images/" + fightImage;
      this.healthPoints = healthPoints;
      this.attackPower = attackPower;
      this.counterAttackPower = counterAttackPower;
    }
  }

  // Populate robotArray
  robotArray[0] = new Robot("R2D2", "r2d2.jpg", "r2d2_fight.png", 100, 10, 10);
  robotArray[1] = new Robot("Johnny 5", "johnny5.jpg", "johnny5_fight.png", 150, 6, 20);
  robotArray[2] = new Robot("T-1000", "t-1000.jpg", "t-1000_fight.png", 120, 8, 15);
  robotArray[3] = new Robot("HAL9000", "hal9000.png", "hal9000_fight.png", 180, 4, 25);

  // Hide certain buttons and messages until user picks robots to fight
  $(".gameBtn").hide();
  $(".healthArea").hide();
  $(".fightMessage").hide();

  // For every Robot in robotArray
  $.each(robotArray, function(index) {
    // Set a variable to reference which robot the each() function is on
    var currentRobot = robotArray[index];
    // Append a card to the robotChoicesArea
    $(".robotChoicesArea").append(
      `<div class="card robotCard" index="${index}">
         <img src="${currentRobot.profileImage}" class="card-img-top robotCardImage">
         <div class="card-body">
           <p class="card-title">${currentRobot.name}</h4>
           <p>HP: <span class="playerHealth">${currentRobot.healthPoints}</span></p>
           <p>AP: <span class="attackPower">${currentRobot.attackPower}</span></p>
           <p>CAP: <span class="counterAttackPower">${currentRobot.counterAttackPower}</span></p>
         </div>
       </div>`
    );
  });

  // Listen for robotCard to be clicked (i.e. user chooses a player)
  $(".robotCard").on("click", function() {
    // If user hasn't chosen a player yet, their player is being chosen
    if (!isPlayerChosen) {

      // Remove card from playerArea
      $(this).remove();

      // Save chosen robot object to playerRobot
      playerRobot = robotArray[$(this).attr("index")];

      // Save playerHealth and playerStartingHealth
      playerStartingHealth = playerRobot.healthPoints;
      playerHealth = playerStartingHealth;

      // Save playerAttack
      playerAttack = playerRobot.attackPower;

      // Add clicked robot fightImage to playerArea
      $(".playerArea").append(`<img class="fightImage text-center" src="${playerRobot.fightImage}">`);
      // Add clicked robot name to playerArea
      $(".playerArea").append(`<h4 class="playerName text-center">${playerRobot.name}</h4>`);
      // Add clicked robot health bar to playerArea
      $(".playerArea").append(
        `<div class="progress">
        <div class="progress-bar playerProgress" role="progressbar" aria-valuenow="${playerRobot.healthPoints}" aria-valuemin="0" aria-valuemax="${playerRobot.healthPoints}" style="width:${playerRobot.healthPoints}%">
        ${playerRobot.healthPoints}
        </div>
        </div>`);

      // Add playerBackground class for background color
      $(".playerArea").addClass("playerBackground");

      // Set isPlayerChosen to true so that the next card clicked goes to enemyArea
      isPlayerChosen = true;

      // Set message to choose your first enemy
      $(".gameMessage").text("Robo-choose your first enemy");
    } else {
      // Otherwise the user has already chosen their player and is now choosing the enemy
      // Only do things to enemy card if isCurrentlyFighting = false
      if (!isCurrentlyFighting) {
        // Remove card from enemyGrid
        $(this).remove();
        // Save chosen robot object to enemyRobot
        enemyRobot = robotArray[$(this).attr("index")];
        // Save enemyStartingHealth and enemyHealth
        enemyStartingHealth = enemyRobot.healthPoints;
        enemyHealth = enemyRobot.healthPoints;
        // Add clicked robot fightImage to enemyArea
        $(".enemyArea").append(`<img class="fightImage text-center" src="${enemyRobot.fightImage}">`);
        // Add clicked robot name to enemyArea
        $(".enemyArea").append(`<h4 class="playerName text-center">${enemyRobot.name}</h4>`);
        // Add clicked robot health bar to enemyArea
        $(".enemyArea").append(
          `<div class="progress">
          <div class="progress-bar enemyProgress" role="progressbar" aria-valuenow="${enemyRobot.healthPoints}" aria-valuemin="0" aria-valuemax="${enemyRobot.healthPoints}" style="width:${enemyRobot.healthPoints}%">
          ${enemyRobot.healthPoints}
          </div>
          </div>`);

        // Add enemyBackground class for background color
        $(".enemyArea").addClass("enemyBackground");
        // Call startFight() function
        startFight();
      } else {
        // Otherwise the user is currently fighting and should be notifyed to finish the current fight
        $(".gameMessage").text("Finish the current fight first!")
      }
    }

  });

  // startFight() function
  function startFight() {
    // Set isCurrentlyFighting to true
    isCurrentlyFighting = true;
    // Call countEnemies() function
    countEnemies();
    // Show attack and reset buttons
    $(".gameBtn").show();
    // Show attack message field
    $(".fightMessage").show();
    // Print round number and message
    $(".gameMessage").text(`Round ${round}`);
    $(".gameMessage").append(`<p><strong>FIGHT!</strong></p>`)
  }

  // Listen for user to click attackBtn
  $(".attackBtn").on("click", function() {
    // Subtract player attackPower from enemyHealth
    enemyHealth -= playerAttack;
    enemyHealthPerc = (enemyHealth / enemyStartingHealth) * 100;
    // Update enemy healh bar
    if (enemyHealth <= 0) {
      $(".enemyProgress").attr("aria-valuenow", 0);
      $(".enemyProgress").attr("style", `width: 100%; background-color: red`);
      $(".enemyProgress").text("DEAD");
    } else {
      $(".enemyProgress").attr("aria-valuenow", `${enemyHealth}`);
      $(".enemyProgress").attr("style", `width:${enemyHealthPerc}%`);
      $(".enemyProgress").text(enemyHealth);
    }

    // Call checkHealth()
    checkHealth();

    // Subtract enemy counterAttackPower from playerHealth
    playerHealth -= enemyRobot.counterAttackPower;
    playerHealthPerc = (playerHealth / playerStartingHealth) * 100;
    // Update player health bar
    if (playerHealth <= 0) {
      $(".playerProgress").attr("aria-valuenow", 0);
      $(".playerProgress").attr("style", `width: 100%; background-color: red`);
      $(".playerProgress").text("DEAD");
    } else {
      $(".playerProgress").attr("aria-valuenow", `${playerHealth}`);
      $(".playerProgress").attr("style", `width:${playerHealthPerc}%`);
      $(".playerProgress").text(playerHealth);
    }
    // Print message of action
    $(".fightMessage").text(`${playerRobot.name} attacked ${enemyRobot.name} for ${playerAttack} points. ${enemyRobot.name} counter-attacked for ${enemyRobot.counterAttackPower} points.`);
    // Double playerAttack
    playerAttack *= 2;
    checkHealth();
  });

  // Listen for user to click resetBtn
  $(".resetBtn").on("click", function() {
    // Reload page
    location.reload();
  })

  // countEnemies() function
  function countEnemies() {
    for (i = 0; i < robotArray.length; i++) {
      if (robotArray[i].team === enemyRobot.team) {
        enemiesRemaining++;
      }
    }
  }

  // checkHealth() function
  function checkHealth() {
    if (playerHealth <= 0) {
      // If playerHealth is 0 or below, call lose() function
      lose();
    } else if (enemyHealth <= 0) {
      // If enemyHealth is 0 or below, call winRound() function
      winRound();
    }
  }

  // Win round function
  function winRound() {
    // Empty enemyArea
    $(".enemyArea").empty();
    // Decrease enemiesRemaining by 1
    enemiesRemaining--;
    // If enemiesRemaining 0
    if (enemiesRemaining === 0) {
      // Call winGame()
      winGame();
    } else {
      // If enemies remain
      // Print win round message
      $(".fightMessage").text("You win the round!<br>Robo-choose a new enemy");
      // call chooseNewEnemy()
      chooseNewEnemy();
    }
  }

  function chooseNewEnemy() {
    isCurrentlyFighting = false;
  }

  // Win game function

  // Lose function
  function lose() {
    $(".gameMessage").text("YOU LOSE");
  }

});
