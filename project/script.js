const board = document.getElementById('board');
const playerScore = document.getElementById('player-score');
const aiScore = document.getElementById('ai-score');
const dice = document.getElementById('dice');
const rollBtn = document.getElementById('roll-btn');
const message = document.getElementById('message');

let playerPos = 0;
let aiPos = 0;
let currentTurn = 'player';
let playerName = "Player";

// Snakes and Ladders configuration
const snakes = { 77: 59, 46: 15, 93: 34, 29: 18, 85: 64, 37: 30, 32: 21, 61: 43, 98: 66 };
const ladders = { 4: 25, 9: 19, 27: 55, 33: 86, 48: 58, 56: 78, 60: 69, 62: 71, 74: 94 };

// Popup handling
window.onload = function() {
    document.getElementById("welcome-popup").style.display = "flex";
};

function startGame() {
    const inputField = document.getElementById("player-name-input");

    if (!inputField.checkValidity()) {
        inputField.reportValidity();
        return;
    }

    playerName = inputField.value.trim();
    document.getElementById("player-name-display").textContent = playerName;
    document.getElementById("welcome-popup").style.display = "none";
    message.textContent = `${playerName} starts the game!`;
}

// Click on OK button
document.getElementById("start-game-btn").addEventListener("click", startGame);

// Press Enter in input
document.getElementById("player-name-input").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        event.preventDefault(); // Prevent form submit
        startGame();
    }
});


// Create the board
function createBoard() {
    const colors = ['color-1', 'color-2', 'color-3', 'color-4', 'color-5'];
    for (let i = 100; i >= 1; i--) {
        const tile = document.createElement('div');
        tile.classList.add('tile');
        tile.id = `tile-${i}`;
        tile.textContent = i;
        const row = Math.floor((100 - i) / 10);
        const col = (i - 1) % 10;
        const colorIndex = (row + col) % 5;
        tile.classList.add(colors[colorIndex]);
        if (snakes[i]) tile.classList.add('snake');
        if (ladders[i]) tile.classList.add('ladder');
        board.appendChild(tile);
    }
    updatePositions();
}

// Update positions
function updatePositions() {
    document.querySelectorAll('.player, .ai').forEach(el => el.remove());
    if (playerPos > 0) {
        const playerTile = document.getElementById(`tile-${playerPos}`);
        const player = document.createElement('div');
        player.classList.add('player');
        playerTile.appendChild(player);
    }
    if (aiPos > 0) {
        const aiTile = document.getElementById(`tile-${aiPos}`);
        const ai = document.createElement('div');
        ai.classList.add('ai');
        aiTile.appendChild(ai);
    }
    playerScore.textContent = playerPos;
    aiScore.textContent = aiPos;
}

// Roll dice
function rollDice() {
    rollBtn.disabled = true;
    dice.classList.add('rolling');
    let rolls = 0;
    const rollInterval = setInterval(() => {
        const roll = Math.floor(Math.random() * 6) + 1;
        dice.textContent = roll;
        rolls++;
        if (rolls >= 15) {
            clearInterval(rollInterval);
            dice.classList.remove('rolling');
            const finalRoll = Math.floor(Math.random() * 6) + 1;
            dice.textContent = finalRoll;
            setTimeout(() => { movePlayer(finalRoll); }, 1000);
        }
    }, 100);
}

// Move player/AI
function movePlayer(roll) {
    if (currentTurn === 'player') {
        if (playerPos === 0 && roll !== 1) {
            message.textContent = `${playerName} needs 1 to start the game! Stayed at 0.`;
            updatePositions();
            currentTurn = 'ai';
            setTimeout(aiTurn, 2000);
            return;
        }
        if (playerPos + roll <= 100) {
            playerPos += roll;
            if (snakes[playerPos]) {
                message.textContent = `${playerName} hit a snake! Slid to ${snakes[playerPos]}.`;
                playerPos = snakes[playerPos];
            } else if (ladders[playerPos]) {
                message.textContent = `${playerName} climbed a ladder to ${ladders[playerPos]}!`;
                playerPos = ladders[playerPos];
            } else {
                message.textContent = `${playerName} moved to ${playerPos}.`;
            }
        } else {
            message.textContent = `${playerName} needs exact roll to reach 100! Stayed at ${playerPos}.`;
        }
        updatePositions();
        if (playerPos === 100) {
            message.textContent = `${playerName} wins! 🎉`;
            rollBtn.disabled = true;
            document.getElementById('play-again-btn').style.display = 'block';
            return;
        }
        currentTurn = 'ai';
        setTimeout(aiTurn, 2000);
    } else {
        if (aiPos === 0 && roll !== 1) {
            message.textContent = `AI needs 1 to start the game! Stayed at 0.`;
            updatePositions();
            currentTurn = 'player';
            setTimeout(() => { rollBtn.disabled = false; }, 1000);
            return;
        }
        if (aiPos + roll <= 100) {
            aiPos += roll;
            if (snakes[aiPos]) {
                message.textContent = `AI hit a snake! Slid to ${snakes[aiPos]}.`;
                aiPos = snakes[aiPos];
            } else if (ladders[aiPos]) {
                message.textContent = `AI climbed a ladder to ${ladders[aiPos]}!`;
                aiPos = ladders[aiPos];
            } else {
                message.textContent = `AI moved to ${aiPos}.`;
            }
        } else {
            message.textContent = `AI needs exact roll to reach 100! Stayed at ${aiPos}.`;
        }
        updatePositions();
        if (aiPos === 100) {
            message.textContent = `AI wins! 🤖`;
            rollBtn.disabled = true;
            document.getElementById('play-again-btn').style.display = 'block';
            return;
        }
        currentTurn = 'player';
        setTimeout(() => { rollBtn.disabled = false; }, 1000);
    }
}

// Restart game
function playAgain() {
    playerPos = 0;
    aiPos = 0;
    currentTurn = 'player';
    message.textContent = `${playerName} starts the game!`;
    updatePositions();
    rollBtn.disabled = false;
    document.getElementById('play-again-btn').style.display = 'none';
    dice.textContent = '1';
}

// AI turn
function aiTurn() { rollDice(); }

// Events
rollBtn.addEventListener('click', rollDice);
createBoard();