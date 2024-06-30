document.addEventListener("DOMContentLoaded", function() {
    // Játék állapotváltozók
    let currentScore1 = 501;
    let currentScore2 = 501;
    let throws1 = [];
    let throws2 = [];
    let average1 = 0;
    let average2 = 0;
    let currentPlayer = 1;
    let isTwoPlayerMode = true;

    // DOM elemek kiválasztása
    const scoreDisplay1 = document.getElementById("current-score-1");
    const scoreDisplay2 = document.getElementById("current-score-2");
    const averageScoreDisplay1 = document.getElementById("average-score-1");
    const averageScoreDisplay2 = document.getElementById("average-score-2");
    const legsWonDisplay1 = document.getElementById("legs-won-1");
    const legsWonDisplay2 = document.getElementById("legs-won-2");
    const scoreInput = document.getElementById("score-input");
    const scoreBtn = document.getElementById("score-btn");
    const clearBtn = document.getElementById("clear-btn");
    const newGameBtn = document.getElementById("new-game-btn");
    const backToSetupBtn = document.getElementById("back-to-setup-btn");
    const numButtons = document.querySelectorAll(".num-btn");
    const player1Panel = document.getElementById("player1-panel");
    const player2Panel = document.getElementById("player2-panel");
    const onePlayerBtn = document.getElementById("one-player-btn");
    const twoPlayersBtn = document.getElementById("two-players-btn");
    const toggleDarkModeBtn = document.getElementById("toggle-dark-mode");

    // Dark Mode váltás
    toggleDarkModeBtn.addEventListener("click", function() {
        document.body.classList.toggle("dark-mode");
        updateActivePlayer();
    });

    // Kezdő képernyő gombok eseménykezelői
    onePlayerBtn.addEventListener("click", function() {
        isTwoPlayerMode = false;
        player2Panel.classList.add("hidden");
        player1Panel.classList.remove("active"); // Nem kell aktív kijelzés egy játékos módban
        startGame();
    });

    twoPlayersBtn.addEventListener("click", function() {
        isTwoPlayerMode = true;
        player2Panel.classList.remove("hidden");
        startGame();
    });

    // Játék indítása
    function startGame() {
        document.getElementById("setup").classList.add("hidden");
        document.getElementById("game").classList.remove("hidden");
        currentPlayer = 1; // Player 1 mindig kezd
        if (isTwoPlayerMode) {
            updateActivePlayer();
        }
    }

    // Aktív játékos kijelzése
    function updateActivePlayer() {
        if (isTwoPlayerMode) {
            if (currentPlayer === 1) {
                player1Panel.classList.add("active");
                player2Panel.classList.remove("active");
            } else {
                player1Panel.classList.remove("active");
                player2Panel.classList.add("active");
            }
        }
    }

    // Szám gombok eseménykezelői
    numButtons.forEach(button => {
        button.addEventListener("click", () => {
            scoreInput.value += button.getAttribute("data-value");
            if (scoreInput.value.length > 3) {
                scoreInput.value = scoreInput.value.slice(-3);
            }
        });
    });

    // Eseménykezelők
    scoreBtn.addEventListener("click", updateScore);
    scoreInput.addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
            updateScore();
        }
    });

    clearBtn.addEventListener("click", function() {
        scoreInput.value = "";
    });

    newGameBtn.addEventListener("click", startNewGame);
    backToSetupBtn.addEventListener("click", backToSetup);

    // Pontszám frissítése
    function updateScore() {
        let inputValue = parseInt(scoreInput.value);
        if (inputValue > 180) {
            alert("Érvénytelen érték! Maximum 180 lehet.");
            scoreInput.value = "";
            return;
        }

        if (!isNaN(inputValue)) {
            if (currentPlayer === 1) {
                handleScoreUpdate(1, inputValue);
            } else {
                handleScoreUpdate(2, inputValue);
            }
        }
    }

    // Pontszám frissítése és átlag újraszámítása
    function handleScoreUpdate(player, score) {
        if (player === 1) {
            if (currentScore1 - score === 0) {
                currentScore1 -= score;
                throws1.push(score);
                updateAverage(1);
                scoreDisplay1.textContent = currentScore1;
                alert("Player 1 wins the leg!");
                startNewLeg(1);
            } else if (currentScore1 - score < 0) {
                alert("A dobás túl sok!");
            } else {
                currentScore1 -= score;
                throws1.push(score);
                scoreDisplay1.textContent = currentScore1;
                updateAverage(1);
            }
        } else {
            if (currentScore2 - score === 0) {
                currentScore2 -= score;
                throws2.push(score);
                updateAverage(2);
                scoreDisplay2.textContent = currentScore2;
                alert("Player 2 wins the leg!");
                startNewLeg(2);
            } else if (currentScore2 - score < 0) {
                alert("A dobás túl sok!");
            } else {
                currentScore2 -= score;
                throws2.push(score);
                scoreDisplay2.textContent = currentScore2;
                updateAverage(2);
            }
        }
        scoreInput.value = "";
        if (isTwoPlayerMode) {
            switchPlayer();
        }
    }

    // Átlag frissítése
    function updateAverage(player) {
        if (player === 1) {
            const sum = throws1.reduce((a, b) => a + b, 0);
            average1 = throws1.length > 0 ? sum / throws1.length : 0;
            averageScoreDisplay1.textContent = average1.toFixed(2);
        } else {
            const sum = throws2.reduce((a, b) => a + b, 0);
            average2 = throws2.length > 0 ? sum / throws2.length : 0;
            averageScoreDisplay2.textContent = average2.toFixed(2);
        }
    }

    // Játékos váltása
    function switchPlayer() {
        currentPlayer = currentPlayer === 1 ? 2 : 1;
        updateActivePlayer();
    }

    // Új leg indítása
    function startNewLeg(winner) {
        if (winner === 1) {
            legsWonDisplay1.textContent = parseInt(legsWonDisplay1.textContent) + 1;
        } else {
            legsWonDisplay2.textContent = parseInt(legsWonDisplay2.textContent) + 1;
        }
        currentScore1 = 501;
        currentScore2 = 501;
        throws1 = [];
        throws2 = [];
        scoreDisplay1.textContent = currentScore1;
        scoreDisplay2.textContent = currentScore2;

        const totalLegsWon = parseInt(legsWonDisplay1.textContent) + parseInt(legsWonDisplay2.textContent);
        currentPlayer = totalLegsWon % 2 === 0 ? 2 : 1; // Ha páros, Player 2 kezd, ha páratlan, Player 1 kezd
        if (isTwoPlayerMode) {
            updateActivePlayer();
        }
    }

    // Új játék indítása
    function startNewGame() {
        currentScore1 = 501;
        currentScore2 = 501;
        throws1 = [];
        throws2 = [];
        average1 = 0;
        average2 = 0;
        legsWonDisplay1.textContent = 0;
        legsWonDisplay2.textContent = 0;
        scoreDisplay1.textContent = currentScore1;
        scoreDisplay2.textContent = currentScore2;
        averageScoreDisplay1.textContent = average1.toFixed(2);
        averageScoreDisplay2.textContent = average2.toFixed(2);
        currentPlayer = 1; // Always start with Player 1 for a new game
        if (isTwoPlayerMode) {
            updateActivePlayer();
        }
    }

    // Vissza a kezdő képernyőre
    function backToSetup() {
        document.getElementById("setup").classList.remove("hidden");
        document.getElementById("game").classList.add("hidden");
    }

    // Játék állapot mentése az ablak bezárásakor
    window.addEventListener('beforeunload', function () {
        localStorage.setItem('currentScore1', currentScore1);
        localStorage.setItem('currentScore2', currentScore2);
        localStorage.setItem('throws1', JSON.stringify(throws1));
        localStorage.setItem('throws2', JSON.stringify(throws2));
        localStorage.setItem('average1', average1);
        localStorage.setItem('average2', average2);
        localStorage.setItem('legsWon1', legsWonDisplay1.textContent);
        localStorage.setItem('legsWon2', legsWonDisplay2.textContent);
        localStorage.setItem('currentPlayer', currentPlayer);
        localStorage.setItem('isTwoPlayerMode', isTwoPlayerMode); // Mentjük a játékmódot
    });

    // Játék állapot betöltése az ablak betöltésekor
    window.addEventListener('load', function () {
        if (localStorage.getItem('currentScore1') !== null) {
            currentScore1 = parseInt(localStorage.getItem('currentScore1'));
            currentScore2 = parseInt(localStorage.getItem('currentScore2'));
            throws1 = JSON.parse(localStorage.getItem('throws1'));
            throws2 = JSON.parse(localStorage.getItem('throws2'));
            average1 = parseFloat(localStorage.getItem('average1'));
            average2 = parseFloat(localStorage.getItem('average2'));
            legsWonDisplay1.textContent = localStorage.getItem('legsWon1');
            legsWonDisplay2.textContent = localStorage.getItem('legsWon2');
            currentPlayer = parseInt(localStorage.getItem('currentPlayer'));
            isTwoPlayerMode = JSON.parse(localStorage.getItem('isTwoPlayerMode')); // Betöltjük a játékmódot

            scoreDisplay1.textContent = currentScore1;
            scoreDisplay2.textContent = currentScore2;
            averageScoreDisplay1.textContent = average1.toFixed(2);
            averageScoreDisplay2.textContent = average2.toFixed(2);
            if (isTwoPlayerMode) {
                updateActivePlayer();
            }
        }
    });

    // Aktív játékos kijelzése a játék indításakor
    if (isTwoPlayerMode) {
        updateActivePlayer();
    }
});