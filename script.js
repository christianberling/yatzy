class Player {
  constructor(name, scoreInputFields, scoreField) {
    this.name = name;
    this.scoreInputFields = scoreInputFields;
    this.score = 0;
    this.scoreField = scoreField;
  }

  calculateScore() {
    const score = Array.from(this.scoreInputFields)
      .map(
        (inputField, index) =>
          (inputField.valueAsNumber ? inputField.valueAsNumber : 0) *
          (index + 1)
      ) // Index begins at zero, no zero score => add one
      .reduce((prev, curr) => prev + curr);
    this.scoreField.innerHTML = score;
  }
}

function checkBoxes() {
  const boxes = Array.from(document.getElementsByClassName("box"))
    .filter( (checking) => checking.checked).map( (box) => box.id );
  console.log('Check box array: ' + boxes);
}


class Bouns {}

window.addEventListener("DOMContentLoaded", () => {
  const playerOne = new Player(
    "Christian",
    document.getElementsByClassName("player_one_input"),
    document.getElementById("player_one_sum")
  );
  const playerTwo = new Player(
    "Aki",
    document.getElementsByClassName("player_two_input"),
    document.getElementById("player_two_sum")
  );
  const playerThree = new Player(
    "Patrik",
    document.getElementsByClassName("player_three_input"),
    document.getElementById("player_three_sum")
  );
  const playerFour = new Player(
    "Erik",
    document.getElementsByClassName("player_four_input"),
    document.getElementById("player_four_sum")
  );
  
  const players = [playerOne, playerTwo, playerThree, playerFour];

  document.getElementById("btn").addEventListener("click", () => {
    console.log("jag görs");

    for (player of players) {
      player.calculateScore();
    }
    checkBoxes();
  });


});
