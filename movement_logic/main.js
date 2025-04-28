const canvas = document.querySelector("canvas")
let context = canvas.getContext("2d")

const BLOCK_SIZE = 20
const CANVAS_WIDTH = 20
const CANVAS_HEIGHT = 15

canvas.width = BLOCK_SIZE * CANVAS_WIDTH
canvas.height = BLOCK_SIZE * CANVAS_HEIGHT

let loop_keys = []

const piece = {
    position: {x: 0, y: 0},
    width: 1,
    height: 1
}

function update() {
    draw()

    window.requestAnimationFrame(update)
}

function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height)

    context.fillStyle = 'red'
    context.fillRect(piece.position.x * BLOCK_SIZE, piece.position.y * BLOCK_SIZE, piece.width * BLOCK_SIZE, piece.height * BLOCK_SIZE)
}

document.addEventListener("keydown", (event) => {
    loop_keys.push(event.key)
})

document.addEventListener("keyup", (event) => {
    loop_keys.splice(loop_keys.indexOf(event.key), 1)
})

setInterval(() => {
    if (loop_keys != "") {
        for (key of loop_keys) {
            if (key === "ArrowRight" && piece.position.x < CANVAS_WIDTH - 1) piece.position.x++
            if (key === "ArrowLeft" && piece.position.x > 0) piece.position.x--
            if (key === "ArrowUp" && piece.position.y > 0) piece.position.y--
            if (key === "ArrowDown" && piece.position.y < CANVAS_HEIGHT - 1) piece.position.y++
        }
    }
}, 30);

update()