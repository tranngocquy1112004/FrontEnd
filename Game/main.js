let canvas = document.getElementById("game");

let ball = new Ball(canvas);
let paddle = new Paddle(canvas);

let bricks = [];
let isGameOver = false;
let isGameWin = false;

// Hàm khởi tạo bricks khi cần
function createBricks() {
    let col = Math.floor(canvas.width / (BRICK_WIDTH + SPACE_BIRCK));
    let row = 3;

    for (let i = 0; i < col; i++) {
        for (let j = 0; j < row; j++) {
            let brick = new Brick(canvas);
            brick.x = i * (BRICK_WIDTH + SPACE_BIRCK);
            brick.y = j * (BRICK_HEIGHT + SPACE_BIRCK);
            bricks.push(brick);
        }
    }
}

// Bắt đầu game
function main() {
    // Tạo bricks nếu chưa có
    if (bricks.length === 0 && !isGameOver && !isGameWin) {
        createBricks();
    }

    if (!isGameOver && !isGameWin) {
        clearScreen();
        showBricks();
        paddle.display(canvas);
        ball.display(canvas);
        moveBall();
        ballPaddleCollision();
        checkCollision();

        // Game over khi bóng rơi xuống đáy
        if (ball.y > canvas.height - ball.radius) {
            isGameOver = true;
        }

        // Thắng khi không còn viên gạch nào
        if (bricks.length === 0) {
            isGameWin = true;
        }

        requestAnimationFrame(main);
    } else {
        // Hiển thị kết quả
        if (isGameOver) {
            alert("Game Over!!");
        } else if (isGameWin) {
            alert("🎉 Winner!!");
        }

        setTimeout(() => {
            resetGame();
        }, 2000);
    }
}

main();

// Hàm hiển thị gạch
function showBricks() {
    for (let i = 0; i < bricks.length; i++) {
        bricks[i].display();
    }
}

// Hàm xóa màn hình
function clearScreen() {
    let ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// Va chạm bóng - paddle
function ballPaddleCollision() {
    // Nếu bóng chạm vào paddle
    if (
        ball.y + ball.radius >= paddle.y &&
        ball.y - ball.radius <= paddle.y + paddle.height &&
        ball.x + ball.radius >= paddle.x &&
        ball.x - ball.radius <= paddle.x + paddle.width
    ) {
        // Bóng phản xạ lên
        ball.dy = -Math.abs(ball.dy);

        // Tính điểm va chạm giữa bóng và paddle
        let collidePoint = ball.x - (paddle.x + paddle.width / 2);

        // Chuẩn hóa giá trị từ [-paddle.width/2, paddle.width/2] về [-1, 1]
        collidePoint = collidePoint / (paddle.width / 2);

        // Tính góc lệch (max ±π/4)
        let angle = collidePoint * (Math.PI / 4);

        // Đổi hướng bóng theo góc phản xạ
        let speed = Math.sqrt(ball.dx * ball.dx + ball.dy * ball.dy);
        ball.dx = speed * Math.sin(angle);
        ball.dy = -speed * Math.cos(angle);
    }
}

// Va chạm bóng - gạch
function checkCollision() {
    for (let i = 0; i < bricks.length; i++) {
        if (checkCrash(ball, bricks[i])) {
            // Xác định hướng
            if (
                ball.y + ball.radius < bricks[i].y + bricks[i].height &&
                ball.y - ball.radius > bricks[i].y
            ) {
                ball.dx = -ball.dx;
            } else {
                ball.dy = -ball.dy;
            }

            bricks.splice(i, 1);
            break;
        }
    }
}

// Kiểm tra va chạm giữa hình tròn và hình chữ nhật
function checkCrash(obj1, obj2) {
    let left1 = obj1.x - obj1.radius;
    let right1 = obj1.x + obj1.radius;
    let top1 = obj1.y - obj1.radius;
    let bot1 = obj1.y + obj1.radius;

    let left2 = obj2.x;
    let right2 = obj2.x + obj2.width;
    let top2 = obj2.y;
    let bot2 = obj2.y + obj2.height;

    if (left1 > right2 || right1 < left2 || top1 > bot2 || bot1 < top2) {
        return false;
    }
    return true;
}

// Di chuyển bóng
function moveBall() {
    if (ball.x < ball.radius || ball.x > canvas.width - ball.radius) {
        ball.dx = -ball.dx;
    }
    if (ball.y < ball.radius) {
        ball.dy = -ball.dy;
    }

    ball.x += ball.dx;
    ball.y += ball.dy;
}

// Lắng nghe phím di chuyển paddle
window.addEventListener("keydown", function (event) {
    if (event.keyCode == 37) {
        paddle.x -= paddle.speed;
    }
    if (event.keyCode == 39) {
        paddle.x += paddle.speed;
    }

    // Giới hạn paddle không ra ngoài
    if (paddle.x < 0) {
        paddle.x = 0;
    } else if (paddle.x > canvas.width - paddle.width) {
        paddle.x = canvas.width - paddle.width;
    }
});

// Reset lại game
function resetGame() {
    ball = new Ball(canvas);
    paddle = new Paddle(canvas);
    bricks = [];
    createBricks();
    isGameOver = false;
    isGameWin = false;
    main();
}
