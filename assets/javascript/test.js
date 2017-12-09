// Initialize isPlayerChosen variable
var isPlayerChosen;

// Initialize round variable
var round;

// Initialize indexOfPlayer and indexofEnemy
var indexOfPlayer;
var indexofEnemy;

// Initialize player and enemy health
var playerHealth;
var enemyHealth;

// Initialize robotArray as empty array
var robotArray = [];

// Declare Robot class
class Robot {
  constructor(name, team, profileImage, fightImage, healthPoints, attackPower, counterAttackPower) {
    this.name = name;
    this.team = team;
    this.profileImage = "assets/images/" + profileImage;
    this.fightImage = "assets/images/" + fightImage;
    this.healthPoints = healthPoints;
    this.attackPower = attackPower;
    this.counterAttackPower = counterAttackPower;
  }
}

// Populate robotArray
robotArray[0] = new Robot("Baymax", "hero", "baymax.jpeg", "image", 120, 8, 10);
robotArray[1] = new Robot("R2D2", "hero", "r2d2.jpg", "image", 100, 0, 5);
robotArray[2] = new Robot("Johnny 5", "hero", "johnny5.jpg", "image", 150, 0, 20);
robotArray[3] = new Robot("Wall-E", "hero", "wall-e.jpg", "image", 180, 0, 25);
robotArray[4] = new Robot("T-1000", "villain", "t-1000.jpg", "image", 120, 0, 10);
robotArray[5] = new Robot("HAL9000", "villain", "hal9000.png", "image", 100, 0, 5);
robotArray[6] = new Robot("Mechagodzilla", "villain", "mechagodzilla.jpg", "image", 150, 0, 20);
robotArray[7] = new Robot("Megatron", "villain", "megatron.jpg", "image", 180, 0, 25);

$(document).ready(function() {
  // For every Robot in robotArray
  $.each(robotArray, function(index, value) {
    // Append a card to the appropriate HTML grid (heroGrid or villainGrid)

    var indexOfRobot = index;

    $(`#${this.team}Grid`).append(
      `<div class="card robotCard" index="${indexOfRobot}">
      <img src="${robotArray[indexOfRobot].profileImage}" class="card-img-top robotCardImage">
      <div class="card-body">
      <h4 class="card-title">${robotArray[indexOfRobot].name}</h4>
      </div>
      </div>`
    );
  });

  // Listen for robotCard to be clicked (i.e. user chooses a player)
  $(".robotCard").on("click", function() {
    // If user hasn't chosen a player yet
    if (!isPlayerChosen) {

      // Save indexOfPlayer
      indexOfPlayer = $(this).attr("index");

      // Save playerHealth
      playerHealth = robotArray[indexOfPlayer].healthPoints;

      // If user chooses a hero
      if (robotArray[indexOfPlayer].team === "hero") {
        // Hide heroesCard
        $("#heroesCard").hide();
        // Expand villainsCollapse
        $("#villainsCollapse").addClass("show");
      } else {
        // Otherwise the user chose a villain
        // Hide villainsCard
        $("#villainsCard").hide();
        // Expand heroesCollapse
        $("#heroesCollapse").addClass("show");
      }

      // Add clicked player to playerArea within fighting area
      $(".playerArea").append(this);

      // Set isPlayerChosen to true so that the next card clicked goes to enemyArea
      isPlayerChosen = true;

      // Set message to choose your first enemy
      $("#message").text("Choose your first enemy");
    } else {
      // Save indexofEnemy
      indexofEnemy = $(this).attr("index");
      // Save enemyHealth
      enemyHealth = robotArray[indexofEnemy].healthPoints;
      // Add chosen card to enemyArea
      $(".enemyArea").append(this);
      // Hide all other characters
      $(".teamCard").hide();
      // Call fight() function
      startFight();
    }

  });

  // Fight function
  function startFight() {
    // Show attack and reset buttons
    $(".gameBtn").show();
    // Print round number
    $("#message").text(`Round ${round}...FIGHT!`);
    // Show healthArea and populate
    $(".healthArea").show();
    $("#playerHealth").text(playerHealth);
    $("#enemyHealth").text(enemyHealth);
    // If user clicks attack button
    $("#attackBtn").on("click", function() {
    })
  }


  // Reset
  function reset() {
    isPlayerChosen = false;
    round = 1;
    $(".gameBtn").hide();
    $(".healthArea").hide();
  }


  ////// Calls //////
  reset();

});
