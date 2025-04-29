const canvas = document.querySelector("canvas")
let context = canvas.getContext("2d")
let elemLeft = canvas.offsetLeft + canvas.clientLeft
let elemTop = canvas.offsetTop + canvas.clientTop

const BLOCK_SIZE = 25
const CANVAS_WIDTH = 10
const CANVAS_HEIGHT = 8
const NUMBER_BOMBS = 10

canvas.width = BLOCK_SIZE * CANVAS_WIDTH
canvas.height = BLOCK_SIZE * CANVAS_HEIGHT

context.scale(BLOCK_SIZE, BLOCK_SIZE)

const board = createZeroArray(CANVAS_HEIGHT).map(() =>
    createZeroArray(CANVAS_WIDTH)
)

for (let i = 0; i < NUMBER_BOMBS; i++) {
    const w = Math.floor(Math.random() * CANVAS_WIDTH)
    const h = Math.floor(Math.random() * CANVAS_HEIGHT)
    board[h][w] = 2
}

const piece = {
    position: {x: 0, y: 0},
    width: 1,
    height: 1
}

function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height)

    context.fillStyle = "blue"
    board.forEach((row, j) => {
        row.forEach((item, i) => {
            if (item === 2) {
                context.fillRect(i, j, 1, 1)
            }
        })
    })

    context.fillStyle = 'red'
    context.fillRect(piece.position.x, piece.position.y, piece.width, piece.height)
}

function createZeroArray(size) {
    return Array(size).fill(0)
}

document.addEventListener("click", (event) => {
    piece.position.x = Math.floor((event.pageX - elemLeft) / BLOCK_SIZE)
    piece.position.y = Math.floor((event.pageY - elemTop) / BLOCK_SIZE)
    draw()
})

draw()