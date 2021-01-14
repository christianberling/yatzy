class Player {
    constructor(name, id) {
        this.name = name;
        this.id = id;
        this.hiScore = [];
        this.score = 0;
        this.noOfThurns = 2;
    }
}

class Die {
    constructor() {
        this.value = '0';
        this.throw();
    }

    throw() {
        this.value = Math.floor(Math.random() * 6) + 1;
        console.log('new dice value: ' + this.value);
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
        this.dices.forEach((die, index) => {
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
        let sum = (this.diceCountedValues.indexOf('5') + 1) * 5;
        console.log('yatzy diceCountedValues')
        console.log( this.diceCountedValues );
        return (sum > 0 ? 50 : 0);
    }
}

class Game {
    constructor(nameField, inputField, sumField, bonusField, totalField) {
        this.players = [];
        this.numberOfThrows = 3;
        this.numberOfTurns = 15;
        this.currentPlayerID = 0;
        this.nameField = nameField;
        this.inputField = inputField;
        this.sumField = sumField;
        this.bonusField = bonusField;
        this.totalField = totalField;
    }

    // addPlayer(name, inputField, nameField, sumField, totalSumField, bonusField, id) {
    //     let player = new Player(name, inputField, nameField, sumField, totalSumField, bonusField, id);
    //     this.players.push(player);
    // }

    addPlayer(name) {
        let player = new Player(name);
        this.players.push(player);
    }

    startNewTurn(startID) {
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

    throwDice(dices) {
        if (0 >= this.numberOfThrows)
            return;
        let htmldices = Array.from(document.getElementsByClassName("dice_dice"));
        let dicecheckboxes = Array.from(document.getElementsByClassName("dicecheckbox"));
        dices.dices.forEach((die, index) => {
            if (dicecheckboxes[index].checked == false) {
                console.log('checkbox not checked ' + index);
                die.throw();
            }
        });
        htmldices.forEach((dice, index) => {
            dice.innerHTML = dices.dices[index].value;
        });
        dices.updateValues;
        this.checkPossibleScores(dices);
        this.numberOfThrows -= 1;
        if (0 >= this.numberOfThrows) {
            document.getElementById('messages').innerHTML = 'Du har inga kast kvar, fyll i protokollet genom att klicka på den ruta du vill använda.';
        } else {
            document.getElementById('messages').innerHTML = 'Det är ' + this.players[this.currentPlayerID].name + 's tur. ';
            document.getElementById('messages').innerHTML += 'Du har ' + this.numberOfThrows + ' kast kvar.';
        }
    }

    checkPossibleScores(dices) {
        dices.updateValues();
        let currentPlayerInputs = [];
        for (let index = this.currentPlayerID; index < this.inputField.length; index += 4) {
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


    clearCheckBoxes() {
        let checkboxes = Array.from(document.getElementsByClassName("dicecheckbox"));
        checkboxes.forEach((box) => box.checked = false);
    }

    clearDices() {
        let htmldices = Array.from(document.getElementsByClassName("dice_dice"));
        htmldices.forEach((dice, index) => dice.innerHTML = '');
    }

    // resetGame() {
    //     document.getElementById("startform").classList.toggle("display_none");
    //     //document.getElementById("newgamebox").classList.toggle("display_none");
    //     //store();
    // }

    writeProtocoll(target) {
        let currentPlayerInputs = [];
        for (let index = this.currentPlayerID; index < this.inputField.length; index += 4) {
            currentPlayerInputs.push(this.inputField[index]);
        }
        currentPlayerInputs.forEach((cell) => {
            if (!cell.isSameNode(target) && cell.classList.contains('active'))
                cell.innerHTML = '';
            cell.classList.remove('active');
        })
        this.players[this.currentPlayerID].noOfThurns -= 1;
        this.clearCheckBoxes();
        this.clearDices();
        this.startNewTurn();
    }

    calculateScore() {
        this.players.forEach((player, playerID) => {
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
            this.players[playerID].score = sum;
        });
    }

    scoreWinner() {
        this.calculateScore();
        let winners = [...this.players];
        winners.sort((playerA, playerB) => playerB.score - playerA.score);
        this.store();
        document.getElementById('winner_name').innerHTML = winners[0].name;
        document.getElementById("winner_box").classList.remove("display_none");
        document.getElementById("dicebox").classList.add("display_none");
        document.getElementById("messagebox").classList.add("display_none");
        document.getElementById("newgamebox").classList.remove("display_none");
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

    store() {
        localStorage.setItem('players', JSON.stringify(this.players));
        //for (player of players) {
        //let player_name = player.name;
        //  localStorage.setItem('name', {player_name});
    }
}


document.addEventListener("DOMContentLoaded", function () {
    let dices = new Dice(5);
    let nameField = Array.from(document.getElementsByClassName('player_name'));
    let inputField = Array.from(document.getElementsByClassName('input'));
    let sumField = Array.from(document.getElementsByClassName('sum'));
    let bonusField = Array.from(document.getElementsByClassName('bonus'));
    let totalField = Array.from(document.getElementsByClassName('total'));
    let game = new Game(nameField, inputField, sumField, bonusField, totalField);

    document.getElementById("yatzy").addEventListener("click", (event) => {
        if (event.target.id == 'startbtn') {
            setupGame();
            game.clearDices();
            game.clearCheckBoxes();
        } else if (event.target.id == 'newgamebtn') {
            document.getElementById("startform").classList.remove("display_none");
            document.getElementById("newgamebox").classList.add("display_none");
            document.getElementById("winner_box").classList.add("display_none");
            document.getElementById("dicebox").classList.add("display_none");
            document.getElementById("messagebox").classList.add("display_none");
            game.clearDices();
            game.clearCheckBoxes();
            game.clearProtocoll();
        } else if (event.target.id == 'throwbtn') {
            game.throwDice(dices);
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
            newPlayers.forEach((name, index) => {
                game.addPlayer(name.value, index);
                Array.from(document.getElementsByClassName('player_name'))[index].innerHTML = name.value;
            });

            game.startNewTurn(0);

            document.getElementById("startform").classList.add("display_none");
            document.getElementById("newgamebox").classList.add("display_none");
            document.getElementById("winner_box").classList.add("display_none");
            document.getElementById("dicebox").classList.remove("display_none");
            document.getElementById("messagebox").classList.remove("display_none");
        }
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
