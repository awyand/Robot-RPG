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
    constructor(name, profileImage, fightImage, healthPoints, attackPower, counterAttackPower, manufacturer, buildYear, height, weight, fullName) {
      this.name = name;
      this.profileImage = "assets/images/" + profileImage;
      this.fightImage = "assets/images/" + fightImage;
      this.healthPoints = healthPoints;
      this.attackPower = attackPower;
      this.counterAttackPower = counterAttackPower;
      this.manufacturer = manufacturer;
      this.buildYear = buildYear;
      this.height = height;
      this.weight = weight;
      this.fullName = fullName;
    }
  }

  // Create function to add robots to robotsArray
  function addRobot(name, profileImage, fightImage, healthPoints, attackPower, counterAttackPower, manufacturer, buildYear, height, weight, fullName) {
    robotArray.push(new Robot(name, profileImage, fightImage, healthPoints, attackPower, counterAttackPower, manufacturer, buildYear, height, weight, fullName));
  }

  // Populate robotArray
  addRobot("R2D2", "r2d2_square.jpg", "r2d2_fight.png", 100, 12, 5, "Industrial Automation", "32 BBY", "1.09m", "32kg", "Second Generation Robotic Droid Series-2 (R2D2)");
  addRobot("Johnny 5", "johnny5_square.jpg", "johnny5_fight.png", 150, 6, 20, "NOVA Laboratory", "1986", "1.98m", "Unknown", "Strategic Artificial Intelligence Nuclear Transport (S.A.I.N.T) Prototype Number 5 (Johnny 5)");
  addRobot("T-1000", "t-1000_square.jpg", "t-1000_fight.png", 120, 8, 10, "Skynet", "2029", "1.83m", "147kg", "Terminator 1000 Series (T-1000)");
  addRobot("HAL9000", "hal9000.png", "hal9000_fight.png", 180, 4, 25, "University of Illinois Coordinated Science Laboratory", "1997", "3.66m", "Unknown", "Heuristically Programmed Algorithmic Computer 9000 (HAL-9000)");

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
         <div class="card-body robotCardBody">
           <p class="card-title robotCardTitle">${currentRobot.name}</p>
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
        $(".enemyProgress").attr("style", "width: 100%; background-color: #CC0000");
        $(".enemyProgress").text("DEAD");
      } else {
        $(".enemyProgress").attr("aria-valuenow", `${enemyHealth}`);
        $(".enemyProgress").text(enemyHealth);
        // Conditional health colors
        if (enemyHealthPerc <= 25) {
          $(".enemyProgress").attr("style", `background-color: #CC0000; width:${enemyHealthPerc}%`);
        } else if (enemyHealthPerc <= 50) {
          $(".enemyProgress").attr("style", `background-color: #FFA719; width:${enemyHealthPerc}%`);
        } else if (enemyHealthPerc <= 75) {
          $(".enemyProgress").attr("style", `background-color: #DBC900; width:${enemyHealthPerc}%`);
        }
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

    // Save robot stats to a variable to add to popover
    var playerRobotStats = `
        <p><strong>Full Name:</strong> ${playerRobot.fullName}</p>
        <p><strong>Manufacturer:</strong> ${playerRobot.manufacturer}</p>
        <p><strong>Build Year:</strong> ${playerRobot.buildYear}</p>
        <p><strong>Height:</strong> ${playerRobot.height}</p>
        <p><strong>Weight:</strong> ${playerRobot.weight}</p>
    `;

    // Add clicked robot fightImage to playerArea
    $(".playerArea").append(`<img class="fightImage text-center" src="${playerRobot.fightImage}">`);
    // Add clicked robot name to playerArea
    $(".playerArea").append(`<h4 class="robotName text-center">${playerRobot.name}</h4>`);
    // Add clicked robot health bar to playerArea
    $(".playerArea").append(
      `<div class="progress">
      <div class="progress-bar playerProgress" role="progressbar" aria-valuenow="${playerRobot.healthPoints}" aria-valuemin="0" aria-valuemax="${playerRobot.healthPoints}" style="width:${playerRobot.healthPoints}%">
      ${playerRobot.healthPoints}
      </div>
      </div>`);

    // Add a button with popover to playerArea
    $(".playerArea").append(
      `<a id="playerStats" tabindex="0" class="btn btn-lg btn-primary" role="button" data-html="true" data-toggle="popover" data-trigger="focus" title="${playerRobot.name} Stats" data-content="${playerRobotStats}">Stats</a>`
    );

    // Enable popover
    $("#playerStats").popover();

    // Set isPlayerChosen to true so that the next card clicked goes to enemyArea
    isPlayerChosen = true;

    // Set message to choose your first enemy
    $(".message").text("Robo-choose your first enemy");
  }

  // addEnemy() function
  function addEnemy(robot) {
    // Remove enemyArea elements except .robotTitle
    $(".enemyArea").find("*").not(".robotTitle").remove();
    // Remove card from enemyGrid
    $(robot).remove();
    // Update robotsRemaining
    robotsRemaining--;
    // Save chosen robot object to enemyRobot
    enemyRobot = robotArray[$(robot).attr("index")];
    // Save enemyStartingHealth and enemyHealth
    enemyStartingHealth = enemyRobot.healthPoints;
    enemyHealth = enemyRobot.healthPoints;

    // Save robot stats to a variable to add to popover
    var enemyRobotStats = `
        <p><strong>Full Name:</strong> ${enemyRobot.fullName}</p>
        <p><strong>Manufacturer:</strong> ${enemyRobot.manufacturer}</p>
        <p><strong>Build Year:</strong> ${enemyRobot.buildYear}</p>
        <p><strong>Height:</strong> ${enemyRobot.height}</p>
        <p><strong>Weight:</strong> ${enemyRobot.weight}</p>
    `;

    // Add clicked robot fightImage to enemyArea
    $(".enemyArea").append(`<img class="fightImage text-center" src="${enemyRobot.fightImage}">`);
    // Add clicked robot name to enemyArea
    $(".enemyArea").append(`<h4 class="robotName text-center">${enemyRobot.name}</h4>`);
    // Add clicked robot health bar to enemyArea
    $(".enemyArea").append(
      `<div class="progress">
      <div class="progress-bar enemyProgress" role="progressbar" aria-valuenow="${enemyRobot.healthPoints}" aria-valuemin="0" aria-valuemax="${enemyRobot.healthPoints}" style="width:${enemyRobot.healthPoints}%">
      ${enemyRobot.healthPoints}
      </div>
      </div>`);

    // Add a button with popover to enemyArea
    $(".enemyArea").append(
      `<a id="enemyStats" tabindex="0" class="btn btn-lg btn-primary" role="button" data-html="true" data-toggle="popover" data-trigger="focus" title="${enemyRobot.name} Stats" data-content="${enemyRobotStats}">Stats</a>`
    );

    // Enable popover
    $("#enemyStats").popover();

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
    $(".message").text("Click Robo-Attack to attack.");
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
      $(".playerProgress").attr("style", "width: 100%; background-color: #CC0000");
      $(".playerProgress").text("DEAD");
    } else {
      $(".playerProgress").attr("aria-valuenow", `${playerHealth}`);
      // $(".playerProgress").attr("style", `width:${playerHealthPerc}%`);
      $(".playerProgress").text(playerHealth);
      // Conditional health colors
      if (playerHealthPerc <= 25) {
        $(".playerProgress").attr("style", `background-color: #CC0000; width:${playerHealthPerc}%`);
      } else if (playerHealthPerc <= 50) {
        $(".playerProgress").attr("style", `background-color: #FFA719; width:${playerHealthPerc}%`);
      } else if (playerHealthPerc <= 75) {
        $(".playerProgress").attr("style", `background-color: #DBC900; width:${playerHealthPerc}%`);
      }
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
      $(".message").text(`${playerRobot.name} attacked ${enemyRobot.name} for ${playerAttack} points. ${enemyRobot.name} counter-attacked for ${enemyRobot.counterAttackPower} points.`);
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
    $(".message").text(`${playerRobot.name} attacked ${enemyRobot.name} for ${playerAttack} points and killed him. No enemies remain. YOU WIN! Click Robo-Reset to play again.`);
    // Set isCurrentlyFighting to false
    isCurrentlyFighting = false;
    isGameOver = true;
  }

  // Lose function
  function lose() {
    // Print appropriate message to user
    $(".message").text(`${playerRobot.name} attacked ${enemyRobot.name} for ${playerAttack} points. ${enemyRobot.name} counter-attacked for ${enemyRobot.counterAttackPower} points and killed ${playerRobot.name}. GAME OVER. Click Robo-Reset to play again.`);
    // Set isCurrentlyFighting to false
    isCurrentlyFighting = false;
    isGameOver = true;
  }
});
