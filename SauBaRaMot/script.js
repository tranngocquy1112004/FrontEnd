const diceElements = [
    document.getElementById('dice1'),
    document.getElementById('dice2'),
    document.getElementById('dice3')
];
const timeElement = document.getElementById('time');
const balanceElement = document.getElementById('current-balance');
const totalBetTaiElement = document.getElementById('total-bet-tai');
const totalBetXiuElement = document.getElementById('total-bet-xiu');
const placeBetButtons = document.querySelectorAll('.place-bet-button');
const betAmountInput = document.getElementById('bet-amount');
const gameResultElement = document.getElementById('game-result');
const individualDiceResultElement = document.getElementById('individual-dice-result');
const startGameButton = document.getElementById('start-game');
const bowlElement = document.getElementById('bowl');
const gameHistoryElement = document.getElementById('game-history'); // Lấy phần tử div chứa quả cầu lịch sử

let currentBalance = 10000000;
let timeLeft = 10;
let timerInterval;
let totalBetOnTai = 0;
let totalBetOnXiu = 0;
let gameInProgress = false;
let gameResultData = null; // Biến để lưu kết quả game sau khi hết giờ
// Bỏ mảng gameHistory nếu không dùng để lưu trữ logic
// let gameHistory = [];

// Cập nhật hiển thị số dư
function updateBalanceDisplay() {
    balanceElement.textContent = currentBalance;
}

// Cập nhật hiển thị tổng tiền cược vào từng cửa
function updateTotalBetDisplays() {
    totalBetTaiElement.textContent = totalBetOnTai;
    totalBetXiuElement.textContent = totalBetOnXiu;
}

// Hàm hiển thị số chấm trên xúc xắc
function showDiceResult(diceElement, result) {
    // Xóa tất cả các class show-X hiện có
    diceElement.classList.remove('show-1', 'show-2', 'show-3', 'show-4', 'show-5', 'show-6');
    // Thêm class show-X tương ứng với kết quả
    diceElement.classList.add(`show-${result}`);
}

// Hàm thêm kết quả vào lịch sử (sử dụng quả cầu)
function addHistoryEntry(outcome, diceValues) {
    const historySphere = document.createElement('div');
    historySphere.classList.add('history-sphere');
    // Thêm class màu dựa trên kết quả Tài hoặc Xỉu
    if (outcome === 'Tài') {
        historySphere.classList.add('tai');
    } else if (outcome === 'Xỉu') {
        historySphere.classList.add('xiu');
    }
     // Tùy chọn: Hiển thị tổng điểm nhỏ bên trong quả cầu
     historySphere.textContent = diceValues.reduce((sum, val) => sum + val, 0);


    gameHistoryElement.prepend(historySphere); // Thêm vào đầu danh sách (kết quả mới nhất ở trái)

    // Giới hạn số lượng quả cầu lịch sử hiển thị (tùy chọn)
    const maxHistoryItems = 15; // Ví dụ: giữ lại tối đa 15 quả cầu
    while (gameHistoryElement.children.length > maxHistoryItems) {
        gameHistoryElement.lastChild.remove(); // Xóa quả cầu cũ nhất (ở cuối)
    }
}


// Hàm cập nhật bộ đếm thời gian
function updateTimer() {
    timeElement.textContent = timeLeft;
    if (timeLeft === 0) {
        clearInterval(timerInterval);
        prepareForReveal(); // Khi hết giờ, chuẩn bị để người dùng nặn
    } else {
        timeLeft--;
    }
}

// Hàm bắt đầu game
function startGame() {
    if (gameInProgress) {
        return; // Không bắt đầu game mới nếu game cũ đang chạy
    }

    gameInProgress = true;
    timeLeft = 10;
    totalBetOnTai = 0; // Đặt lại tổng cược Tài
    totalBetOnXiu = 0; // Đặt lại tổng cược Xỉu
    updateTotalBetDisplays(); // Cập nhật hiển thị tổng cược về 0
    gameResultData = null; // Xóa kết quả game của vòng trước

    gameResultElement.textContent = 'Nhập số tiền và đặt cược...';
    individualDiceResultElement.textContent = ''; // Xóa kết quả từng xúc xắc cũ

    // Bật lại input và các nút đặt cược
    betAmountInput.disabled = false;
    placeBetButtons.forEach(button => button.disabled = false);
    startGameButton.disabled = true;


     // Ẩn kết quả cũ và hiển thị lại cái bát
    gameResultElement.textContent = '';
    bowlElement.classList.remove('hidden'); // Hiển thị cái bát

    // Reset xúc xắc về trạng thái ban đầu (không có chấm hiển thị) và bắt đầu lắc
     diceElements.forEach(dice => {
         // Xóa tất cả các class show-X
        dice.classList.remove('show-1', 'show-2', 'show-3', 'show-4', 'show-5', 'show-6');
         dice.classList.add('shaking'); // Bắt đầu animation lắc
     });


    timerInterval = setInterval(updateTimer, 1000);
}

// Hàm chuẩn bị hiển thị kết quả (sau khi hết giờ)
function prepareForReveal() {
    gameInProgress = false; // Game kết thúc về mặt đặt cược và thời gian

    // Vô hiệu hóa input và các nút đặt cược
    betAmountInput.disabled = true;
    placeBetButtons.forEach(button => button.disabled = true);
    startGameButton.disabled = false; // Bật lại nút bắt đầu game mới

     // Dừng animation lắc xúc xắc
     diceElements.forEach(dice => {
        dice.classList.remove('shaking');
     });

    // Lắc xúc xắc (sinh số ngẫu nhiên) ngay khi hết giờ
    const dice1Value = rollDice();
    const dice2Value = rollDice();
    const dice3Value = rollDice();

    const total = dice1Value + dice2Value + dice3Value;

     // Xác định kết quả Tài hoặc Xỉu
    let gameOutcome;
    if (total >= 11 && total <= 17) {
        gameOutcome = 'Tài';
    } else if (total >= 4 && total <= 10) {
        gameOutcome = 'Xỉu';
    } else {
        gameOutcome = 'Không xác định';
    }

     // Lưu trữ dữ liệu kết quả để hiển thị khi người dùng nặn
    gameResultData = {
        diceValues: [dice1Value, dice2Value, dice3Value],
        total: total,
        outcome: gameOutcome,
        betTai: totalBetOnTai, // Lưu lại số tiền cược Tài của vòng này
        betXiu: totalBetOnXiu // Lưu lại số tiền cược Xỉu của vòng này
    };

    // Thay đổi thông báo để yêu cầu người dùng nặn
    gameResultElement.textContent = 'Hết giờ! Click vào bát để xem kết quả.';
     individualDiceResultElement.textContent = ''; // Xóa kết quả từng xúc xắc cũ (chưa nặn nên chưa biết)
}

// Hàm hiển thị kết quả cuối cùng (sau khi người dùng nặn)
function revealResult() {
    // Đảm bảo nút Bắt đầu game mới được bật lại
    startGameButton.disabled = false;

    if (!gameResultData || gameInProgress) {
        return; // Chỉ hiển thị khi có dữ liệu kết quả và game không còn trong tiến trình
    }

    // Hiển thị ảnh chấm trên từng xúc xắc dựa vào kết quả đã lưu
    showDiceResult(diceElements[0], gameResultData.diceValues[0]);
    showDiceResult(diceElements[1], gameResultData.diceValues[1]);
    showDiceResult(diceElements[2], gameResultData.diceValues[2]);

    // Nhấc cái bát lên (thêm class hidden)
    bowlElement.classList.add('hidden');

    // Xây dựng text kết quả
    let resultText = `Tổng điểm: ${gameResultData.total} - Kết quả: ${gameResultData.outcome}`;

    // Hiển thị kết quả từng xúc xắc
    individualDiceResultElement.textContent = `(${gameResultData.diceValues.join(' + ')})`;


     // Logic cập nhật tiền chuyển từ prepareForReveal sang đây
    let winAmount = 0;
    let loseAmount = 0;

     if (gameResultData.outcome === 'Tài') {
        winAmount = gameResultData.betTai * 2; // Thắng Tài, nhận gấp đôi tiền cược Tài
        loseAmount = gameResultData.betXiu; // Thua Xỉu, mất tiền cược Xỉu
    } else if (gameResultData.outcome === 'Xỉu') {
        winAmount = gameResultData.betXiu * 2; // Thắng Xỉu, nhận gấp đôi tiền cược Xỉu
        loseAmount = gameResultData.betTai; // Thua Tài, mất tiền cược Tài
    }

    currentBalance += winAmount; // Cộng tiền thắng (tiền thua đã trừ lúc đặt cược)

     updateBalanceDisplay(); // Cập thị hiển thị số dư sau khi xử lý thắng thua


    if (winAmount > 0) {
        resultText += ` - Bạn thắng ${winAmount} đ.`;
    } else if (loseAmount > 0) {
         resultText += ` - Bạn thua ${loseAmount} đ.`;
    } else {
         if (gameResultData.betTai > 0 || gameResultData.betXiu > 0) {
             resultText += ' - Bạn đã đặt cược nhưng không thắng.';
         } else {
             resultText += ' - Bạn chưa đặt cược.';
         }
    }

    resultText += ` Số dư cuối: ${currentBalance} đ`;


    gameResultElement.textContent = resultText;

    // Thêm kết quả vào lịch sử (sử dụng quả cầu)
    addHistoryEntry(gameResultData.outcome, gameResultData.diceValues);


    // Reset gameResultData sau khi hiển thị
    gameResultData = null;
}


// Hàm mô phỏng lắc xúc xắc (sinh số ngẫu nhiên)
function rollDice() {
    return Math.floor(Math.random() * 6) + 1;
}

// Lắng nghe sự kiện click cho các nút "Đặt Cược" (Tài và Xỉu)
placeBetButtons.forEach(button => {
    button.addEventListener('click', () => {
        if (!gameInProgress) {
            alert('Vui lòng bắt đầu game mới.');
            return;
        }

        const betAmount = parseInt(betAmountInput.value);
        const betType = button.dataset.betType; // Lấy loại cược từ thuộc tính data-bet-type

        if (isNaN(betAmount) || betAmount <= 0) {
            alert('Vui lòng nhập số tiền cược hợp lệ.');
            return;
        }
         if (betAmount < 1000) { // Thêm kiểm tra số tiền cược tối thiểu
             alert('Số tiền cược tối thiểu là 1000 đ.');
             return;
         }


        if (betAmount > currentBalance) {
            alert(`Số dư không đủ (${currentBalance} đ) để đặt cược số tiền này (${betAmount} đ).`);
            return;
        }

        // Đặt cược thành công
        currentBalance -= betAmount; // Trừ tiền cược khỏi số dư ngay lập tức
        updateBalanceDisplay(); // Cập nhật hiển thị số dư

        if (betType === 'tai') {
            totalBetOnTai += betAmount; // Cộng vào tổng tiền cược Tài
             gameResultElement.textContent = `Đã đặt ${betAmount} đ vào cửa TÀI. Tổng cược Tài: ${totalBetOnTai} đ`;
        } else if (betType === 'xiu') {
            totalBetOnXiu += betAmount; // Cộng vào tổng tiền cược Xỉu
             gameResultElement.textContent = `Đã đặt ${betAmount} đ vào cửa XỈU. Tổng cược Xỉu: ${totalBetOnXiu} đ`;
        }

        updateTotalBetDisplays(); // Cập nhật hiển thị tổng tiền cược trên giao diện


        // Tùy chọn: Vô hiệu hóa nút đặt cược sau khi đặt tiền, hoặc cho phép đặt nhiều lần
        // Hiện tại, cho phép đặt nhiều lần cho đến khi hết giờ hoặc hết tiền.
        // Nếu muốn chỉ đặt 1 lần, thêm disabled = true ở đây và xử lý logic bật lại.
    });
});

// Lắng nghe sự kiện click vào bát để "nặn" (nhấc bát lên)
bowlElement.addEventListener('click', () => {
    // Chỉ cho phép nặn khi game KHÔNG trong tiến trình (đã hết giờ) VÀ bát đang hiển thị VÀ có dữ liệu kết quả
    if (!gameInProgress && !bowlElement.classList.contains('hidden') && gameResultData !== null) {
         revealResult(); // Gọi hàm hiển thị kết quả
    } else if (gameInProgress) {
        // Tùy chọn: thông báo nếu người dùng click bát khi game đang chạy
        // alert('Chờ hết thời gian đặt cược.');
    }
});


// Lắng nghe sự kiện bắt đầu game mới
startGameButton.addEventListener('click', startGame);

// Khởi tạo game và hiển thị số dư ban đầu khi trang tải
updateBalanceDisplay(); // Hiển thị số dư ban đầu
startGame(); // Bắt đầu game đầu tiên khi trang tải