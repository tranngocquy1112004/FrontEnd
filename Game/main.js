let canvas = document.getElementById("game");

let ball = new Ball(canvas);
let paddle = new Paddle(canvas);

let bricks = [];
let isGameOver = false;
let isGameWin = false;

/**
 * Tạo và khởi tạo các viên gạch
 * Tính toán số cột dựa trên chiều rộng canvas và kích thước gạch
 * Tạo mảng 2D các viên gạch với 3 hàng
 */
function createBricks() {
    let col = Math.floor(canvas.width / (BRICK_WIDTH + SPACE_BIRCK));
    let row = 3;

    for (let i = 0; i < col; i++) {
        for (let j = 0; j < row; j++) {
            let brick = new Brick(canvas);
            // Tính toán vị trí x, y cho mỗi viên gạch
            brick.x = i * (BRICK_WIDTH + SPACE_BIRCK);
            brick.y = j * (BRICK_HEIGHT + SPACE_BIRCK);
            bricks.push(brick);
        }
    }
}

/**
 * Hàm chính điều khiển game loop
 * Cập nhật trạng thái game và xử lý logic game
 */
function main() {
    // Khởi tạo gạch nếu chưa có và game chưa kết thúc
    if (bricks.length === 0 && !isGameOver && !isGameWin) {
        createBricks();
    }

    if (!isGameOver && !isGameWin) {
        // Xóa màn hình và vẽ lại các đối tượng
        clearScreen();
        showBricks();
        paddle.display(canvas);
        ball.display(canvas);
        
        // Cập nhật vị trí và xử lý va chạm
        moveBall();
        ballPaddleCollision();
        checkCollision();

        // Kiểm tra điều kiện thua game
        if (ball.y > canvas.height - ball.radius) {
            isGameOver = true;
        }

        // Kiểm tra điều kiện thắng game
        if (bricks.length === 0) {
            isGameWin = true;
        }

        // Tiếp tục game loop
        requestAnimationFrame(main);
    } else {
        // Hiển thị thông báo kết quả
        if (isGameOver) {
            alert("Game Over!!");
        } else if (isGameWin) {
            alert("🎉 Winner!!");
        }

        // Reset game sau 2 giây
        setTimeout(() => {
            resetGame();
        }, 2000);
    }
}

// Bắt đầu game
main();

/**
 * Hiển thị tất cả các viên gạch lên canvas
 */
function showBricks() {
    for (let i = 0; i < bricks.length; i++) {
        bricks[i].display();
    }
}

/**
 * Xóa toàn bộ nội dung canvas
 */
function clearScreen() {
    let ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

/**
 * Xử lý va chạm giữa bóng và paddle
 * Tính toán góc phản xạ dựa trên điểm va chạm
 */
function ballPaddleCollision() {
    // Kiểm tra va chạm giữa bóng và paddle
    if (
        ball.y + ball.radius >= paddle.y &&
        ball.y - ball.radius <= paddle.y + paddle.height &&
        ball.x + ball.radius >= paddle.x &&
        ball.x - ball.radius <= paddle.x + paddle.width
    ) {
        // Đảo ngược hướng di chuyển theo trục y
        ball.dy = -Math.abs(ball.dy);

        // Tính toán điểm va chạm tương đối trên paddle
        let collidePoint = ball.x - (paddle.x + paddle.width / 2);
        collidePoint = collidePoint / (paddle.width / 2);  // Chuẩn hóa về [-1, 1]

        // Tính góc phản xạ (tối đa ±45 độ)
        let angle = collidePoint * (Math.PI / 4);

        // Cập nhật vector vận tốc mới
        let speed = Math.sqrt(ball.dx * ball.dx + ball.dy * ball.dy);
        ball.dx = speed * Math.sin(angle);
        ball.dy = -speed * Math.cos(angle);
    }
}

/**
 * Xử lý va chạm giữa bóng và các viên gạch
 * Xóa gạch khi bị va chạm và đổi hướng bóng
 */
function checkCollision() {
    for (let i = 0; i < bricks.length; i++) {
        if (checkCrash(ball, bricks[i])) {
            // Xác định hướng va chạm và đổi hướng bóng
            if (
                ball.y + ball.radius < bricks[i].y + bricks[i].height &&
                ball.y - ball.radius > bricks[i].y
            ) {
                ball.dx = -ball.dx;  // Va chạm ngang
            } else {
                ball.dy = -ball.dy;  // Va chạm dọc
            }

            // Xóa viên gạch bị va chạm
            bricks.splice(i, 1);
            break;
        }
    }
}

/**
 * Kiểm tra va chạm giữa hình tròn (bóng) và hình chữ nhật (gạch)
 * @param {Object} obj1 - Đối tượng hình tròn (bóng)
 * @param {Object} obj2 - Đối tượng hình chữ nhật (gạch)
 * @returns {boolean} - Kết quả kiểm tra va chạm
 */
function checkCrash(obj1, obj2) {
    // Tính toán các cạnh của hình tròn
    let left1 = obj1.x - obj1.radius;
    let right1 = obj1.x + obj1.radius;
    let top1 = obj1.y - obj1.radius;
    let bot1 = obj1.y + obj1.radius;

    // Tính toán các cạnh của hình chữ nhật
    let left2 = obj2.x;
    let right2 = obj2.x + obj2.width;
    let top2 = obj2.y;
    let bot2 = obj2.y + obj2.height;

    // Kiểm tra va chạm
    if (left1 > right2 || right1 < left2 || top1 > bot2 || bot1 < top2) {
        return false;
    }
    return true;
}

/**
 * Cập nhật vị trí bóng và xử lý va chạm với tường
 */
function moveBall() {
    // Va chạm với tường trái/phải
    if (ball.x < ball.radius || ball.x > canvas.width - ball.radius) {
        ball.dx = -ball.dx;
    }
    // Va chạm với tường trên
    if (ball.y < ball.radius) {
        ball.dy = -ball.dy;
    }

    // Cập nhật vị trí bóng
    ball.x += ball.dx;
    ball.y += ball.dy;
}

/**
 * Xử lý sự kiện bàn phím để di chuyển paddle
 */
window.addEventListener("keydown", function (event) {
    // Di chuyển sang trái (phím mũi tên trái)
    if (event.keyCode == 37) {
        paddle.x -= paddle.speed;
    }
    // Di chuyển sang phải (phím mũi tên phải)
    if (event.keyCode == 39) {
        paddle.x += paddle.speed;
    }

    // Giới hạn paddle không ra ngoài canvas
    if (paddle.x < 0) {
        paddle.x = 0;
    } else if (paddle.x > canvas.width - paddle.width) {
        paddle.x = canvas.width - paddle.width;
    }
});

/**
 * Reset game về trạng thái ban đầu
 */
function resetGame() {
    ball = new Ball(canvas);
    paddle = new Paddle(canvas);
    bricks = [];
    createBricks();
    isGameOver = false;
    isGameWin = false;
    main();
}
