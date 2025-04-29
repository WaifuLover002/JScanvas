const canvas = document.querySelector("canvas")
let context = canvas.getContext("2d")
let elemLeft = canvas.offsetLeft + canvas.clientLeft
let elemTop = canvas.offsetTop + canvas.clientTop

const BLOCK_SIZE = 25
const BOARD_WIDTH = 10
const BOARD_HEIGHT = 8
const NUMBER_BOMBS = 15

const text_mult = 2


canvas.width = BLOCK_SIZE * BOARD_WIDTH
canvas.height = BLOCK_SIZE * BOARD_HEIGHT

context.scale(BLOCK_SIZE, BLOCK_SIZE)

function generateBoard(width, height, bomb_num) {
    const bomb_list = []
    const rand_num_list = []

    const board = createZeroArray(height).map(() =>
        createZeroArray(width)
    )
    
    while (rand_num_list.length < bomb_num) {
        const w = Math.floor(Math.random() * width)
        const h = Math.floor(Math.random() * height)
        const rand_pack = [w, h]
        let some_equal = false
        rand_num_list.forEach(pack => {
            if (checkEqual(pack, rand_pack)) {
                some_equal = true
            }
        })
        if (!some_equal) {
            rand_num_list.push(rand_pack)
        }
    }
    
    for (rand of rand_num_list) {
        const [w, h] = rand
        board[h][w] = 'x'
        bomb_list.push({ w: w, h: h })
    }
    
    for (bomb of bomb_list) {
        let w = bomb.w
        let h = bomb.h
        for (let j = h - 1; j <= (h + 1); j++) {
            for (let i = w - 1; i <= (w + 1); i++) {
                if (i >= 0 && i < BOARD_WIDTH && j >= 0 && j < BOARD_HEIGHT) {
                    if (board[j][i] != 'x') {
                        board[j][i]++
                    }
                }
            }
        }
    }
    return board
}

function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height)

    board.forEach((row, j) => {
        row.forEach((item, i) => {
            if (item === 'x') {
                context.fillStyle = "black"
                context.fillRect(i, j, 1, 1)
            } else if (item != 0) {
                context.scale((1 / BLOCK_SIZE) * text_mult, (1 / BLOCK_SIZE) * text_mult)
                context.fillStyle = "green"
                context.fillText(item, ((i * BLOCK_SIZE) / text_mult) + 3.5, (((j + 1) * BLOCK_SIZE) / text_mult) - 3.5)
                context.scale(BLOCK_SIZE / text_mult, BLOCK_SIZE / text_mult)
            }
        })
    })

    //context.fillStyle = 'red'
    //context.fillRect(piece.position.x, piece.position.y, piece.width, piece.height)
}

function createZeroArray(size) {
    return Array(size).fill(0)
}

function checkEqual(a, b) {
    if (a[0] !== b[0]) return false
    if (a[1] !== b[1]) return false
    return true
}


board = generateBoard(BOARD_WIDTH, BOARD_HEIGHT, NUMBER_BOMBS)

document.addEventListener("click", (event) => {
    piece.position.x = Math.floor((event.pageX - elemLeft) / BLOCK_SIZE)
    piece.position.y = Math.floor((event.pageY - elemTop) / BLOCK_SIZE)
    draw()
})

draw()