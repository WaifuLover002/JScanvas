const canvas = document.querySelector("canvas")
let context = canvas.getContext("2d")
let elemLeft = canvas.offsetLeft + canvas.clientLeft
let elemTop = canvas.offsetTop + canvas.clientTop

const BLOCK_SIZE = 25
const BOARD_WIDTH = 18
const BOARD_HEIGHT = 14
const NUMBER_BOMBS = 40

if (NUMBER_BOMBS > (BOARD_WIDTH * BOARD_HEIGHT - 9)) {
    throw Error("Too much bombs")
}

const text_mult = 2

let board

canvas.width = BLOCK_SIZE * BOARD_WIDTH
canvas.height = BLOCK_SIZE * BOARD_HEIGHT

context.scale(BLOCK_SIZE, BLOCK_SIZE)

const board_mask = createArray(BOARD_HEIGHT, false).map(() =>
    createArray(BOARD_WIDTH, false)
)


function generateBoard(width, height, bomb_num, first_selection) {
    const bomb_list = []
    const rand_num_list = []

    const board = createArray(height, 0).map(() =>
        createArray(width, 0)
    )
    const no_list = [first_selection]
    const [x, y] = first_selection

    for (let j = y - 1; j <= (y + 1); j++) {
        for (let i = x - 1; i <= (x + 1); i++) {
            if (i >= 0 && i < BOARD_WIDTH && j >= 0 && j < BOARD_HEIGHT) {
                no_list.push([i, j])
            }
        }
    }
    
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
        no_list.forEach(pack => {
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
    if (board == undefined) {
        for (let j = 0; j < BOARD_HEIGHT; j++) {
            for (let i = 0; i < BOARD_WIDTH; i++) {
                if ((i + j) % 2 === 0) {
                    context.fillStyle = "green"
                    context.fillRect(i, j, 1, 1)
                } else {
                    context.fillStyle = "lightgreen"
                    context.fillRect(i, j, 1, 1)
                }
            }
        }
    } else {
        context.clearRect(0, 0, canvas.width, canvas.height)

        board.forEach((row, j) => {
            row.forEach((item, i) => {
                if (board_mask[j][i]) {
                    if (item === 'x') {
                        context.fillStyle = "red"
                        context.fillRect(i, j, 1, 1)
                    } else if (item != 0) {
                        context.scale((1 / BLOCK_SIZE) * text_mult, (1 / BLOCK_SIZE) * text_mult)
                        context.fillStyle = "darkblue"
                        context.fillText(item, ((i * BLOCK_SIZE) / text_mult) + 3.5, (((j + 1) * BLOCK_SIZE) / text_mult) - 3.5)
                        context.scale(BLOCK_SIZE / text_mult, BLOCK_SIZE / text_mult)
                    }
                } else {
                    if ((i + j) % 2 === 0) {
                        context.fillStyle = "green"
                        context.fillRect(i, j, 1, 1)
                    } else {
                        context.fillStyle = "lightgreen"
                        context.fillRect(i, j, 1, 1)
                    }
                }
            })
        })
    }
}

function createArray(size, item) {
    return Array(size).fill(item)
}

function checkEqual(a, b) {
    if (a[0] !== b[0]) return false
    if (a[1] !== b[1]) return false
    return true
}

function reveal_board(x, y) {
    if (!board_mask[y][x]) {
        board_mask[y][x] = true
        if (board[y][x] === 0) {
            for (let j = y - 1; j <= (y + 1); j++) {
                for (let i = x - 1; i <= (x + 1); i++) {
                    if (i >= 0 && i < BOARD_WIDTH && j >= 0 && j < BOARD_HEIGHT) {
                        if (board[j][i] === 0 && board_mask[j][i] === false) {
                            reveal_board(i, j)
                            break
                        }
                        if (board[j][i] !== 'x' && board_mask[j][i] === false) {
                            board_mask[j][i] = true
                        }
                    }
                }
            }
        } else if (board[y][x] === 'x') {
            lose_game()
        }
    }
}

function lose_game() {
    console.log("You lose")
}


document.addEventListener("click", (event) => {
    const x = Math.floor((event.pageX - elemLeft) / BLOCK_SIZE)
    const y = Math.floor((event.pageY - elemTop) / BLOCK_SIZE)
    const first_selection = [x, y]

    if (x < BOARD_WIDTH && y < BOARD_HEIGHT && x >= 0 && y >= 0) {
        if (board == undefined) {
            board = generateBoard(BOARD_WIDTH, BOARD_HEIGHT, NUMBER_BOMBS, first_selection)
        }
        reveal_board(x, y)
        draw()
    }
    
})

draw()