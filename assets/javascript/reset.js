function reset() {
  isPlayerChosen = false;
  isCurrentlyFighting = false;
  isGameOver = false;
  playerRobot = {};
  enemyRobot = {};
  playerAttack = 0;
  basePlayerAttack = 0;
  playerHealth = 0;
  playerStartingHealth = 0;
  enemyStartingHealth = 0;
  playerHealthPerc = 0;
  enemyHealthPerc = 0;
  robotsRemaining = 0;
  robotArray = [];

  populateRobots();
}
