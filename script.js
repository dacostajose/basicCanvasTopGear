function gameStart() {
    let pontuacao = document.querySelector("#pontuacao")
    let vidas = document.querySelector("#vidas")

    let ctx = document.querySelector("#gameCanvas").getContext("2d");
    let delta = 0;
    let gameOver = false
    let player = {
        position: 275,
        vidas: 3,
        pontuacao: 0
    }

    let enemies = []
    let turbo = false;

    let g = ["#00AA00", "#00FF00"]; // verde escuro / verde claro
    let rw = ["#FF0000", "#FFFFFF"]; // vermelho / branco
    let lg = ["#AAAAAA", "#777777"]; // cinza claro / cinza escuro
    let lastTime;
    let startTime = Date.now();

    function main() {
        let now = Date.now();
        render();
        lastTime = now;
        update(now - startTime)
        pontuacao.textContent = player.pontuacao
        vidas.textContent = player.vidas

        if (!gameOver) {
            requestAnimationFrame(main);
        }
    }



    const mov = {
        "a": () => { player.position = 150 },
        "s": () => { player.position = 275 },
        "d": () => { player.position = 400 },
        "w": () => { turbo = !turbo },
        "ArrowRight": () => {
            if (player.position === 150) {
                player.position = 275
            } else if (player.position === 275) {
                player.position = 400
            }

        },
        "ArrowLeft": () => {
            if (player.position === 275) {
                player.position = 150
            } else if (player.position === 400) {
                player.position = 275
            }
        },
        "ArrowUp": () => {
            turbo = !turbo
        }

    }

    function render() {
        // Limpa o cenário com a cor do céu
        ctx.fillStyle = "#3333FF";
        ctx.fillRect(0, 0, 600, 300);

        // Para cada linha de pixels na tela
        for (let i = 0; i < 150; i++) {
            let n = i * Math.log((i + 30) / 20)

            ctx.fillStyle = g[Math.floor((n + delta) % 40 / 20)];
            ctx.fillRect(0, 300 - i, 600, 1);

            ctx.fillStyle = rw[Math.floor((n + delta) % 20 / 10)];
            ctx.fillRect(10 + i, 300 - i, 600 - 2 * (10 + i), 1);

            ctx.fillStyle = lg[Math.floor((n + delta) % 40 / 20)];
            ctx.fillRect(20 + i, 300 - i, 600 - 2 * (20 + i), 1);
        }
        enemies.forEach((e) => {
            ctx.fillStyle = "#0f0"
            ctx.fillRect(e.position, e.prox, e.width, e.width);
        })

        // Avança pela pista (nesse exemplo, na velocidade do render; na prática, usar o tempo)
        delta += turbo ? 10 : 6;


    }


    function update(plTime) {
        ctx.fillStyle = "#000";
        ctx.fillRect(player.position, 225, 50, 50)
        let controler = Math.floor(Math.random() * 100 + 0)

        if (plTime % 100 == controler) {
            if (controler % 3 == 2) {
                enemies.push({ position: 275, prox: 100, width: 10 })

            } else if (controler % 3 == 0) {
                enemies.push({ position: 400, prox: 100, width: 10 })

            } else {
                enemies.push({ position: 150, prox: 100, width: 10 })

            }
        }
        enemies.forEach((e, index) => {
            if ((e.prox + (plTime % 30)) < 600) {
                e.prox += (plTime % 30) * (turbo ? 0.2 : 0.1)
                e.width += e.width * (turbo ? 0.04 : 0.02)
            } else {
                enemies.splice(index, 1)
            }
            if (e.position == player.position && e.prox < 235 && e.prox > 180) {
                player.vidas--
                enemies.splice(index, 1)
                //document.querySelector("#pontuacao").textContent = pontuacao
                if (player.vidas === 0) {
                    gameOver = true
                    reStart()
                    postResult()
                }
            }
        })

        player.pontuacao = plTime * (turbo ? 5 : 1);
        //document.querySelector("#pontos").textContent = Math.floor(pontuation / 100000)
    }

    main();

    document.addEventListener("keydown", (e) => {
        const keyPressed = e.key
        console.log(e)
        if (mov[keyPressed]) {
            mov[keyPressed]()
        } else {

        }
    });

}

let button = document.querySelector("#startGameButton")

button.addEventListener('click', () => {

    let formDiv = document.querySelector("#formSection")
    formDiv.classList.add("hidden")
    button.classList.add("hidden")
    let audio = document.querySelector("#gameaudio")
    let gamesec = document.querySelector("#gameSection")
    let gameControls = document.querySelector("#controls")

    let canv = document.createElement('canvas')

    let restartButton = document.createElement("button")
    let pontuacao = document.createElement("p")
    let vidas = document.createElement("p")


    let timer = document.querySelector("#timer")
    let timeCalc = 0
    let timeout = setInterval(() => {
        if (timeCalc === 4) {
            restartButton.classList.add("btn")
            restartButton.textContent = "reiniciar"
            restartButton.id = "restartButton"

            pontuacao.textContent = "0"
            pontuacao.id = "pontuacao"

            vidas.textContent = "3"
            vidas.id = "vidas"

            gameControls.appendChild(restartButton)

            gameControls.appendChild(pontuacao)
            gameControls.appendChild(vidas)

            canv.id = "gameCanvas"
            canv.width = 600
            canv.height = 300
            gamesec.appendChild(canv)
            gameStart()
            audio.play()
            restartButton.addEventListener("click", () => { reStart() })
            timeCalc = 0
            timer.textContent = ""
            clearTimeout(timeout)
        } else if (timeCalc === 3) {
            timeCalc++
            timer.textContent = "Vai !!!"
        } else {
            timeCalc++
            timer.textContent = timeCalc
        }
    }, 1000)

})

function reStart() {
    let formDiv = document.querySelector("#formSection")
    let restartButton = document.querySelector("#restartButton")
    let inputText = document.querySelector("#inputText")
    let gameCanvas = document.querySelector("#gameCanvas")
    let audio = document.querySelector("#gameaudio")
    let pontuacao = document.querySelector("#pontuacao")
    let vidas = document.querySelector("#vidas")
    pontuacao.remove()
    inputText.value = ""
    vidas.remove()
    formDiv.classList.remove("hidden")
    button.classList.remove("hidden")
    restartButton.remove()
    gameCanvas.remove()
    audio.pause();
    audio.currentTime = 0;
}

async function postResult() {
    const rep = fetch("htpp://localhost:300/ranking", {
        method: 'post',
        body: JSON.stringify({})
    })
}