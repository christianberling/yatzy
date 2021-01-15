class Player {
    constructor(name, id, noOfThurns = 15) {
        this.name = name;
        this.id = id;
        this.hiScore = [];
        this.score = 0;
        this.noOfThurns = noOfThurns;
    }
}

class Die {
    constructor() {
        this.value = '0';
    }

    throw() {
        this.value = Math.floor(Math.random() * 6) + 1;
    }
}

class Dice {
    constructor(noOfDice = 5) {
        this.dices = [];
        this.diceValues = [];
        this.diceCountedValues = new Array(6);
        for (let i = 0; i < noOfDice; i++) {
            this.dices.push(new Die());
        }
    }

    updateValues() {
        this.diceValues = [];
        this.diceCountedValues.fill(0);
        this.dices.forEach((die) => {
            this.diceValues.push(die.value);
            this.diceCountedValues[die.value - 1] += 1;
        });
    }

    pairs() {
        let sum = 0;
        for (let i = 0; i < this.diceCountedValues.length; i++) {
            if (this.diceCountedValues[i] >= 2) {
                sum = (i + 1) * 2 > sum ? (i + 1) * 2 : sum;
            }
        }
        return sum;
    }

    twopairs() {
        let first = 0;
        let second = 0;
        for (let i = 0; i < this.diceCountedValues.length; i++) {
            if ((first === 0) && this.diceCountedValues[i] >= 2) {
                first = (i + 1) * 2;
            } else if (this.diceCountedValues[i] >= 2) {
                second = (i + 1) * 2;
            }
        }
        return (first != 0 && second != 0) ? first + second : 0;
    }

    threes() {
        let sum = 0;
        for (let i = 0; i < this.diceCountedValues.length; i++) {
            if (this.diceCountedValues[i] >= 3) {
                sum = (i + 1) * 3;
            }
        }
        return sum;
    }

    fours() {
        let sum = 0;
        for (let i = 0; i < this.diceCountedValues.length; i++) {
            if (this.diceCountedValues[i] >= 4) {
                sum = (i + 1) * 4;
            }
        }
        return sum;
    }

    smallStraight() {
        let sum = 0;
        for (let i = 0; i < this.diceCountedValues.length - 1; i++) {
            if (this.diceCountedValues[i] == 1) {
                sum += (i + 1);
            } else
                return 0;
        }
        return sum;
    }

    largeStraight() {
        let sum = 0;
        for (let i = 1; i < this.diceCountedValues.length; i++) {
            if (this.diceCountedValues[i] == 1) {
                sum += (i + 1);
            } else
                return 0;
        }
        return sum;
    }

    fullHouse() {
        let first = 0;
        let second = 0;
        for (let i = 0; i < this.diceCountedValues.length; i++) {
            if (this.diceCountedValues[i] === 2) {
                first = (i + 1) * 2;
            }
            if (this.diceCountedValues[i] === 3) {
                second = (i + 1) * 3;
            }
        }
        return (first != 0 && second != 0) ? first + second : 0;
    }

    chance() {
        return this.diceValues.reduce((acc, current) => acc + current, 0);
    }

    yatzy() {
        let sum = this.diceCountedValues.indexOf(5);
        return (sum > 0 ? 50 : 0);
    }
}

class Protocoll {
    constructor(nameField, inputField, sumField, bonusField, totalField) {
        this.nameField = nameField;
        this.inputField = inputField;
        this.sumField = sumField;
        this.bonusField = bonusField;
        this.totalField = totalField;
    }

    addPlayers(players) {
        players.forEach((player, index) => {
            this.nameField[index].innerHTML = player.name;
        })
    }

    checkPossibleScores(dices, currentPlayerID) {
        dices.updateValues();
        let currentPlayerInputs = [];
        for (let index = currentPlayerID; index < this.inputField.length; index += 4) {
            currentPlayerInputs.push(this.inputField[index]);
        }
        currentPlayerInputs.forEach((cell, index) => {
            if (cell.innerHTML == '' || cell.classList.contains('active')) {
                if (index < 6) {
                    cell.innerHTML = dices.diceCountedValues[index] * (index + 1);
                } else if (index === 6) {
                    cell.innerHTML = dices.pairs();
                } else if (index === 7) {
                    cell.innerHTML = dices.twopairs();
                } else if (index === 8) {
                    cell.innerHTML = dices.threes();
                } else if (index === 9) {
                    cell.innerHTML = dices.fours();
                } else if (index === 10) {
                    cell.innerHTML = dices.smallStraight();
                } else if (index === 11) {
                    cell.innerHTML = dices.largeStraight();
                } else if (index === 12) {
                    cell.innerHTML = dices.fullHouse();
                } else if (index === 13) {
                    cell.innerHTML = dices.chance();
                } else if (index === 14) {
                    cell.innerHTML = dices.yatzy();
                }
                cell.classList.add('active');
            }
        })
    }

    writeProtocoll(target, currentPlayerID, players) {
        let currentPlayerInputs = [];
        for (let index = currentPlayerID; index < this.inputField.length; index += 4) {
            currentPlayerInputs.push(this.inputField[index]);
        }
        currentPlayerInputs.forEach((cell) => {
            if (!cell.isSameNode(target) && cell.classList.contains('active')){
                cell.innerHTML = '';
            }
            cell.classList.remove('active');
        })
        players[currentPlayerID].noOfThurns -= 1;
    }

    calculateScore(players) {
        players.forEach((player, playerID) => {
            let currentPlayerInputs = [];
            for (let index = playerID; index < this.inputField.length; index += 4) {
                currentPlayerInputs.push(this.inputField[index]);
            }
            let sum = 0;
            for (let i = 0; i < 6; i++) {
                sum += Number(currentPlayerInputs[i].innerHTML);
            }
            this.sumField[playerID].innerHTML = sum;
            if (sum >= 63) {
                sum += 50;
                this.bonusField[playerID].innerHTML = 50;
            } else {
                this.bonusField[playerID].innerHTML = 0;
            }
            for (let i = 6; i < currentPlayerInputs.length; i++) {
                sum += Number(currentPlayerInputs[i].innerHTML);
            }
            this.totalField[playerID].innerHTML = sum;
            player.score = sum;
        });
    }

    clearProtocoll() {
        for (let field of this.inputField) {
            field.innerHTML = '';
        }
        for (let field of this.nameField) {
            field.innerHTML = '';
        }
        for (let field of this.sumField) {
            field.innerHTML = '';
        }
        for (let field of this.bonusField) {
            field.innerHTML = '';
        }
        for (let field of this.totalField) {
            field.innerHTML = '';
        }
    }
}

class Game {
    constructor(nameField, inputField, sumField, bonusField, totalField) {
        this.dices = new Dice(5);
        this.players = [];
        this.protocoll = new Protocoll(nameField, inputField, sumField, bonusField, totalField);
        this.numberOfThrows = 3;
        this.currentPlayerID = 0;
    }

    addPlayers(players) {
        players.forEach((name, id) => {
            this.players.push(new Player(name.value, id));
        }) 
        this.protocoll.addPlayers(this.players);
    }

    startNewTurn(startID) {
        this.clearDices();
        this.clearCheckBoxes();
        if (this.players[this.players.length - 1].noOfThurns > 0) {
            this.numberOfThrows = 3;
            if (startID !== undefined) {
                this.currentPlayerID = startID;
            } else {
                this.currentPlayerID = (this.currentPlayerID === this.players.length - 1) ? 0 : this.currentPlayerID + 1;
            }
            document.getElementById('messages').innerHTML = 'Det är ' + this.players[this.currentPlayerID].name + 's tur. ';
            document.getElementById('messages').innerHTML += 'Du har ' + this.numberOfThrows + ' kast kvar. ';
        } else {
            this.scoreWinner();
        }
    }

    throwDice() {
        if (0 >= this.numberOfThrows)
            return;
        let htmldices = Array.from(document.getElementsByClassName("dice_dice"));
        let dicecheckboxes = Array.from(document.getElementsByClassName("dicecheckbox"));
        this.dices.dices.forEach((die, index) => {
            if (dicecheckboxes[index].checked == false) {
                die.throw();
            }
        });
        htmldices.forEach((dice, index) => {
            dice.innerHTML = this.dices.dices[index].value;
        });
        this.dices.updateValues;
        this.protocoll.checkPossibleScores(this.dices, this.currentPlayerID);
        this.numberOfThrows -= 1;
        if (0 >= this.numberOfThrows) {
            document.getElementById('messages').innerHTML = 'Du har inga kast kvar, fyll i protokollet genom att klicka på den ruta du vill använda.';
        } else {
            document.getElementById('messages').innerHTML = 'Det är ' + this.players[this.currentPlayerID].name + 's tur. ';
            document.getElementById('messages').innerHTML += 'Du har ' + this.numberOfThrows + ' kast kvar.';
        }
    }

    writeProtocoll(target) {
        this.protocoll.writeProtocoll(target, this.currentPlayerID, this.players);
        this.clearCheckBoxes();
        this.clearDices();
        this.startNewTurn();
    }

    clearCheckBoxes() {
        let checkboxes = Array.from(document.getElementsByClassName("dicecheckbox"));
        checkboxes.forEach((box) => box.checked = false);
    }

    clearDices() {
        let htmldices = Array.from(document.getElementsByClassName("dice_dice"));
        htmldices.forEach((dice, index) => dice.innerHTML = '');
    }

    clearProtocoll() {
        this.protocoll.clearProtocoll();
    }
    scoreWinner() {
        this.protocoll.calculateScore(this.players);
        let winners = [...this.players];
        winners.sort((playerA, playerB) => playerB.score - playerA.score);
        document.getElementById('winner_name').innerHTML = winners[0].name;
        document.getElementById("winner_box").classList.remove("display_none");
        document.getElementById("dicebox").classList.add("display_none");
        document.getElementById("messagebox").classList.add("display_none");
        document.getElementById("newgamebox").classList.remove("display_none");
    }

    store() {
        localStorage.setItem('players', JSON.stringify(this.players));
        //for (player of players) {
        //let player_name = player.name;
        //  localStorage.setItem('name', {player_name});
    }
}


document.addEventListener("DOMContentLoaded", function () {
    let nameField = Array.from(document.getElementsByClassName('player_name'));
    let inputField = Array.from(document.getElementsByClassName('input'));
    let sumField = Array.from(document.getElementsByClassName('sum'));
    let bonusField = Array.from(document.getElementsByClassName('bonus'));
    let totalField = Array.from(document.getElementsByClassName('total'));

    let game = new Game(nameField, inputField, sumField, bonusField, totalField);

    document.getElementById("yatzy").addEventListener("click", (event) => {
        if (event.target.id == 'startbtn') {
            setupGame();
        } else if (event.target.id == 'newgamebtn') {
            showNewGameForm();
            game.clearDices();
            game.clearCheckBoxes();
            game.clearProtocoll();
        } else if (event.target.id == 'throwbtn') {
            game.throwDice();
        } else if (event.target.classList.contains('active')) {
            game.writeProtocoll(event.target);
        } else if (event.target.id == 'calculatebtn') {
            game.calculateScore();
        }
    });

    function setupGame() {
        let newPlayers = Array.from(document.getElementsByClassName('form_player_name'))
            .filter(name => name.value.trim().length > 0);
        if (newPlayers.length < 2) {
            alert('Du måste ange minst två spelare');
            return;
        } else {
            game.addPlayers(newPlayers);
            game.startNewTurn(0);
            showGameControlls();
        }
    }

    function showNewGameForm() {
        document.getElementById("startform").classList.remove("display_none");
        document.getElementById("newgamebox").classList.add("display_none");
        document.getElementById("winner_box").classList.add("display_none");
        document.getElementById("dicebox").classList.add("display_none");
        document.getElementById("messagebox").classList.add("display_none");
    }

    function showGameControlls() {
        document.getElementById("startform").classList.add("display_none");
        document.getElementById("newgamebox").classList.add("display_none");
        document.getElementById("winner_box").classList.add("display_none");
        document.getElementById("dicebox").classList.remove("display_none");
        document.getElementById("messagebox").classList.remove("display_none");
    }

    // function store() {
    //     for (player of players) {
    //         let player_name = player.name;
    //         /*            if (typeof localStorage.getItem('name') !== 'undefined') 
    //                         name.value = localStorage.getItem('name');
    //                     if (typeof localStorage.getItem('email') !== 'undefined')
    //                         email.value = localStorage.getItem('email'); */
    //         localStorage.setItem('name', player_name);
    //     }
    // }


})
