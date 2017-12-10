$(document).ready(function() {

  // Welcome/instruction modal on page load
    $("#welcomeModal").modal("show");


  ////// GLOBAL VARIABLES //////

  // Initialize booleans that will be used for our event listener conditions
  var isPlayerChosen = false;
  var isCurrentlyFighting = false;
  var isGameOver = false;

  // Initialize round variable
  // Used for keeping track of rounds
  var round = 1;

  // Initialize playerRobot and enemyRobot
  // Used to store robot objects throughout game
  var playerRobot;
  var enemyRobot;

  // Initialize playerAttack and basePlayerAttack
  // Used to increase player attack power each time player attacks
  var playerAttack;
  var basePlayerAttack;

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

  // Initialize robotsRemaining
  // Used for determining if the player has defeated all enemies or not
  var robotsRemaining;

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

  // Create function to add robots to robotsArray
  function addRobot(name, profileImage, fightImage, healthPoints, attackPower, counterAttackPower) {
    robotArray.push(new Robot(name, profileImage, fightImage, healthPoints, attackPower, counterAttackPower));
  }

  // Populate robotArray
  addRobot("R2D2", "r2d2.jpg", "r2d2_fight.png", 100, 12, 5);
  addRobot("Johnny 5", "johnny5.jpg", "johnny5_fight.png", 150, 6, 20);
  addRobot("T-1000", "t-1000.jpg", "t-1000_fight.png", 120, 8, 10);
  addRobot("HAL9000", "hal9000.png", "hal9000_fight.png", 180, 4, 25);

  // Update robotsRemaining with robotsArray.length
  robotsRemaining = robotArray.length;

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

  // Hide certain buttons and messages until user picks robots to fight
  $(".gameBtn").hide();
  $(".healthArea").hide();


  //////// EVENT LISTENERS ////////

  // Listen for robotCard to be clicked (i.e. user chooses a player)
  $(".robotCard").on("click", function() {
    // If user hasn't chosen a player yet, their player is being chosen
    if (!isPlayerChosen) {
      // Run addPlayer() function and pass this as a paramter
      addPlayer(this);
    } else {
      // Otherwise the user has already chosen their player and is now choosing the enemy
      // Only do things to enemy card if isCurrentlyFighting = false
      if (!isCurrentlyFighting) {
        // Run addEnemy() function and pass this as a paramter
        addEnemy(this);
      } else {
        // Otherwise the user is currently fighting and should be notifyed to finish the current fight
        $(".message").text("Finish the current fight first!")
      }
    }
  });

  // Listen for robotCard to be hovered over
  $(".robotCard").hover( function() {
    // If user is choosing their robot
    if (!isPlayerChosen) {
      // Apply green background on hover
      $(this).addClass("backgroundGreen");
    } else {
      // If user is choosing their enemy
      // Apply red background on hover
      $(this).addClass("backgroundRed");
    }
  }, function() {
    // Remove classes when mouse leaves
    $(this).removeClass("backgroundGreen");
    $(this).removeClass("backgroundRed");
  });

  // Listen for user to click attackBtn
  $(".attackBtn").on("click", function() {
    // Only run combat logic if isCurrentlyFighting is true
    if (isCurrentlyFighting && !isGameOver) {

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

      // Call checkEnemyHealth() to see if enemy is dead
      checkEnemyHealth();
    }
  });


  // Listen for user to click resetBtn
  $(".resetBtn").on("click", function() {
    // Reload page
    location.reload();
  })


  ////// FUNCTIONS //////

  // addPlayer() function
  function addPlayer(robot) {
    // Remove card from playerArea
    $(robot).remove();

    // Update robotsRemaining
    robotsRemaining--;

    // Save chosen robot object to playerRobot
    playerRobot = robotArray[$(robot).attr("index")];

    // Save playerHealth and playerStartingHealth
    playerStartingHealth = playerRobot.healthPoints;
    playerHealth = playerStartingHealth;

    // Save playerAttack
    basePlayerAttack = playerRobot.attackPower;
    playerAttack = basePlayerAttack;

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

    // Set isPlayerChosen to true so that the next card clicked goes to enemyArea
    isPlayerChosen = true;

    // Set message to choose your first enemy
    $(".message").text("Robo-choose your first enemy");
  }

  // addEnemy() function
  function addEnemy(robot) {
    // Empty enemyArea
    $(".enemyArea").empty();
    // Remove card from enemyGrid
    $(robot).remove();
    // Update robotsRemaining
    robotsRemaining--;
    // Save chosen robot object to enemyRobot
    enemyRobot = robotArray[$(robot).attr("index")];
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
    // Call startFight() function
    startFight();
  }

  // startFight() function
  function startFight() {
    // Set isCurrentlyFighting to true
    isCurrentlyFighting = true;
    // Show attack and reset buttons
    $(".gameBtn").show();
    // Print round number and message
    $(".message").text("Click Robo-attack to attack.");
  }

  function checkEnemyHealth() {
    if (enemyHealth <= 0) {
      // Call winRound()
      winRound();
    } else {
      // If enemy isn't dead, counterattack
      enemyCounterAttack();
    }
  }

  function enemyCounterAttack() {
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

    // Check player health
    checkPlayerHealth();
  }

  function checkPlayerHealth() {
    if (playerHealth <= 0) {
      // Call lose()
      lose();
    } else {
      // No one died, print appropriate message
      $(".message").text(`${playerRobot.name} attacked ${enemyRobot.name} for ${playerAttack} points. ${enemyRobot.name} counter-attacked for ${enemyRobot.counterAttackPower} points. Keep attacking!`);
      // Increase playerAttack
      playerAttack += basePlayerAttack;
    }
  }

  // Win round function
  function winRound() {
    // If no enemies remain
    if (robotsRemaining === 0) {
      // Call winGame()
      winGame();
    } else {
      // If enemies remain
      // Print appropriate message
      $(".message").text(`${playerRobot.name} attacked ${enemyRobot.name} for ${playerAttack} points and killed him. Choose your next enemy!`);
      // Increase playerAttack
      playerAttack += basePlayerAttack;
      // Set isCurrentlyFighting to false
      isCurrentlyFighting = false;
    }
  }

  // Win game function
  function winGame() {
    // Print appropriate message to user
    $(".message").text(`${playerRobot.name} attacked ${enemyRobot.name} for ${playerAttack} points and killed him. No enemies remain. YOU WIN! Click reset to play again.`);
    // Set isCurrentlyFighting to false
    isCurrentlyFighting = false;
    isGameOver = true;
  }

  // Lose function
  function lose() {
    // Print appropriate message to user
    $(".message").text(`${playerRobot.name} attacked ${enemyRobot.name} for ${playerAttack} points. ${enemyRobot.name} counter-attacked for ${enemyRobot.counterAttackPower} points and killed ${playerRobot.name}. GAME OVER. Click reset to play again.`);
    // Set isCurrentlyFighting to false
    isCurrentlyFighting = false;
    isGameOver = true;
  }
});
