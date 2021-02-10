function startGame() {
    $("#start").hide();
    $("#background-game").append("<div id='player' class='anima1'></div>");
    $("#background-game").append("<div id='enemy1' class='anima2'></div>");
    $("#background-game").append("<div id='enemy2'></div>");
    $("#background-game").append("<div id='friend' class='anima3'></div>");
    $("#background-game").append("<div id='scoreboard'></div>");
    $("#background-game").append("<div id='energy'></div>");


    let game = {};

    const KEY = {
        ARROWUP: 38,
        ARROWDOWN: 40,
        BACKSPACE: 32
    }

    let speed = 5;
    let positionY = parseInt(Math.random() * 334);

    let canFire = true;

    let gameOverValue = false;

    let score = 0;
    let savedFriends = 0;
    let lostFriends = 0;
    let currentEnergy = 3;


    const fireAudio = document.getElementById("fireAudio");
    const explosionAudio = document.getElementById("explosionAudio");
    const backgroundAudio = document.getElementById("backgroundAudio");
    const gameoverAudio = document.getElementById("gameoverAudio");
    const lostFriendAudio = document.getElementById("lostFriendAudio");
    const savedFriendAudio = document.getElementById("savedFriendAudio");

    game.pressed = [];

    backgroundAudio.addEventListener("ended", function () { backgroundAudio.currentTime = 0; backgroundAudio.play(); }, false);
    backgroundAudio.play();

    $(document).keydown(function (e) {
        game.pressed[e.which] = true;
    });

    $(document).keyup(function (e) {
        game.pressed[e.which] = false;
    });

    game.timer = setInterval(loop, 30);

    function loop() {
        backgroundMove();
        playerMove();
        enemy1Move();
        enemy2Move();
        friendMove();
        collision();
        scoreboard();
        energy();
    }

    function backgroundMove() {
        left = parseInt($("#background-game").css("background-position"));
        $("#background-game").css("background-position", left - 1);
    }

    function playerMove() {
        if (game.pressed[KEY.ARROWUP]) {
            let top = parseInt($("#player").css("top"));
            $("#player").css("top", top - 10);
            if (top <= 6) {

                $("#player").css("top", 6);
            }
        }
        if (game.pressed[KEY.ARROWDOWN]) {
            let top = parseInt($("#player").css("top"));
            $("#player").css("top", top + 10);
            if (top >= 434) {

                $("#player").css("top", 434);
            }
        }
        if (game.pressed[KEY.BACKSPACE]) {
            fire();
        }
    }

    function enemy1Move() {
        positionX = parseInt($("#enemy1").css("left"));
        $("#enemy1").css("left", positionX - speed);
        $("#enemy1").css("top", positionY);

        if (positionX <= 0) {
            positionY = parseInt(Math.random() * 334);
            $("#enemy1").css("left", 694);
            $("#enemy1").css("top", positionY);
        }
    }

    function enemy2Move() {
        positionX = parseInt($("#enemy2").css("left"));
        $("#enemy2").css("left", positionX - 3);
        if (positionX <= 0) {
            $("#enemy2").css("left", 775);
        }
    }

    function friendMove() {
        positionX = parseInt($("#friend").css("left"));
        $("#friend").css("left", positionX + 1);
        if (positionX > 906) {
            $("#friend").css("left", 0);
        }
    }

    function fire() {
        if (canFire) {
            fireAudio.play();
            canFire = false;
            let top = parseInt($("#player").css("top"));
            positionX = parseInt($("#player").css("left"));
            fireX = positionX + 185;
            topFire = top + 51;
            $("#background-game").append("<div id='fire'></div>");
            $("#fire").css("top", topFire);
            $("#fire").css("left", fireX);

            var timeFire = window.setInterval(execFire, 30);

        }

        function execFire() {
            positionX = parseInt($("#fire").css("left"));
            $("#fire").css("left", positionX + 15);

            if (positionX > 900) {
                window.clearInterval(timeFire);
                timeFire = null;
                $("#fire").remove();
                canFire = true;
            }
        }
    }

    function collision() {
        const collision1 = ($("#player").collision($("#enemy1")));
        const collision2 = ($("#player").collision($("#enemy2")));
        const collision3 = ($("#fire").collision($("#enemy1")));
        const collision4 = ($("#fire").collision($("#enemy2")));
        const collision5 = ($("#player").collision($("#friend")));
        const collision6 = ($("#enemy2").collision($("#friend")));

        if (collision1.length > 0) {
            currentEnergy--;
            enemy1X = parseInt($("#enemy1").css("left"));
            enemy1Y = parseInt($("#enemy1").css("top"));
            explosion1(enemy1X, enemy1Y);

            positionY = parseInt(Math.random() * 334);
            $("#enemy1").css("left", 694);
            $("#enemy1").css("top", positionY);
        }

        if (collision2.length > 0) {
            currentEnergy--;
            enemy2X = parseInt($("#enemy2").css("left"));
            enemy2Y = parseInt($("#enemy2").css("top"));
            explosion2(enemy2X, enemy2Y);

            $("#enemy2").remove();

            replaceEnemy2();

        }

        if (collision3.length > 0) {
            score += 100;
            speed += 0.3;
            enemy1X = parseInt($("#enemy1").css("left"));
            enemy1Y = parseInt($("#enemy1").css("top"));
            explosion1(enemy1X, enemy1Y);
            $("#fire").css("left", 950);
            positionY = parseInt(Math.random() * 334);
            $("#enemy1").css("left", 694);
            $("#enemy1").css("top", positionY);
        }

        if (collision4.length > 0) {
            score += 50;
            enemy2X = parseInt($("#enemy2").css("left"));
            enemy2Y = parseInt($("#enemy2").css("top"));
            explosion2(enemy2X, enemy2Y);
            $("#fire").css("left", 950);
            $("#enemy2").remove();

            replaceEnemy2();
        }

        if (collision5.length > 0) {
            savedFriendAudio.play();
            savedFriends++;
            replaceFriend();
            $("#friend").remove();
        }

        if (collision6.length > 0) {
            lostFriends++;
            friendX = parseInt($("#friend").css("left"));
            friendY = parseInt($("#friend").css("top"));
            explosion3(friendX, friendY);
            $("#friend").remove();
            replaceFriend();
        }

    }

    function explosion1(enemy1X, enemy1Y) {
        explosionAudio.play();
        $("#background-game").append("<div id='explosion1'></div>");
        $("#explosion1").css("background-image", "url(imgs/explosao.png)");
        var div = $("#explosion1");
        div.css("top", enemy1Y);
        div.css("left", enemy1X);
        div.animate({ width: 200, opacity: 0 }, "slow");

        var explosionTime = window.setInterval(removeExplosion, 1000);

        function removeExplosion() {
            div.remove();
            window.clearInterval(explosionTime);
            explosionTime = null;
        }

    }

    function explosion2(enemy2X, enemy2Y) {
        explosionAudio.play();
        $("#background-game").append("<div id=explosion2></div>");
        $("#explosion2").css("background-image", "url(imgs/explosao.png)");
        var div2 = $("#explosion2");
        div2.css("top", enemy2Y);
        div2.css("left", enemy2X);
        div2.animate({ width: 200, opacity: 0 }, "slow");

        var explosionTime = window.setInterval(removeExplosion, 1000);

        function removeExplosion() {
            div2.remove();
            window.clearInterval(explosionTime);
            explosionTime = null;
        }

    }

    function explosion3(friendX, friendY) {
        lostFriendAudio.play();
        $("#background-game").append("<div id='explosion3' class='anima4'></div>");
        $("#explosion3").css("left", friendX);
        $("#explosion3").css("top", friendY);
        var explosiontime3 = window.setInterval(explosionReset3, 1000);
        function explosionReset3() {
            $("#explosion3").remove();
            window.clearInterval(explosiontime3);
            explosiontime3 = null;
        }

    }

    function replaceEnemy2() {
        var collisionTime4 = window.setInterval(replace4, 5000);
        function replace4() {
            window.clearInterval(collisionTime4);
            collisionTime4 = null;
            if (gameOverValue == false) {
                $("#background-game").append("<div id=enemy2></div>");
            }
        }
    }

    function replaceFriend() {
        var friendTime = window.setInterval(replace6, 6000);

        function replace6() {
            window.clearInterval(friendTime);
            friendTime = null;

            if (gameOverValue == false) {
                $("#background-game").append("<div id='friend' class='anima3'></div>");
            }
        }
    }

    function scoreboard() {
        $("#scoreboard").html("<h2>Pontos: " + score + " Salvos: " + savedFriends + " Perdidos: " + lostFriends + "</h2>");
    }

    function energy() {
        if (currentEnergy == 3) {
            $("#energy").css("background-image", "url(imgs/energia3.png)");
        }
        if (currentEnergy == 2) {
            $("#energy").css("background-image", "url(imgs/energia2.png)");

        }
        if (currentEnergy == 1) {
            $("#energy").css("background-image", "url(imgs/energia1.png)");

        }
        if (currentEnergy == 0) {
            $("#energy").css("background-image", "url(imgs/energia0.png)");
            gameOver();
        }
    }

    function gameOver() {
        gameOverValue = true;
        backgroundAudio.pause();
        gameoverAudio.play();

        window.clearInterval(game.timer);
        game.timer = null;

        $("#player").remove();
        $("#enemy1").remove();
        $("#enemy2").remove();
        $("#friend").remove();

        $("#background-game").append("<div id='endGame'></div>");

        $("#endGame").html("<h1>Game Over</h1> <p>Sua pontuação foi: " + score + "</p>" + "<div id='restart' onClick=restartGame()> <h3>Jogar Novamente</h3></div>");

    }

}

function restartGame() {
    gameoverAudio.pause();
    $("#endGame").remove();
    startGame();
}
