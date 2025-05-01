// --- Các phần tử DOM chính ---
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
const gameHistoryElement = document.getElementById('game-history');
const quickBetButtons = document.querySelectorAll('.quick-bet-button');
const chatMessagesElement = document.getElementById('chat-messages');
const resetBalanceButton = document.getElementById('reset-balance');
const usernameInput = document.getElementById('username-input');
const loginButton = document.getElementById('login-button');
const currentUserDisplay = document.getElementById('current-user-display');
const chatMessageInput = document.getElementById('chat-message-input');
const sendChatMessageButton = document.getElementById('send-chat-message');
const sessionCountTaiElement = document.getElementById('session-count-tai');
const sessionCountXiuElement = document.getElementById('session-count-xiu');
const sessionHistoryGridElement = document.getElementById('session-history-grid');
const sessionDetailedHistoryElement = document.getElementById('session-detailed-history');
const prevPageButton = document.getElementById('prev-page');
const nextPageButton = document.getElementById('next-page');
const pageInfoSpan = document.getElementById('page-info');
const diceBowlContainer = document.querySelector('.dice-bowl-container');

// --- Biến trạng thái ---
let currentUser = null;
const INITIAL_BALANCE = 10000;
let currentBalance = INITIAL_BALANCE;
let timeLeft = 10;
let timerInterval = null;
let totalBetOnTai = 0;
let totalBetOnXiu = 0;
let gameInProgress = false;
let gameResultData = null;
let autoStartTimer = null;
let sessionHistory = [];
let currentPage = 1;
const itemsPerPage = 10;
let totalPages = 1;

// Biến trạng thái kéo bát (bowl drag)
let isDragging = false;
let dragOffsetX = 0;
let dragOffsetY = 0;
let initialBowlXRelativeToContainer = 0;
let initialBowlYRelativeToContainer = 0;

// --- Danh sách tin nhắn AI ---
const aiMessages = [
    "Ván này Tài có vẻ sáng cửa đấy anh em!",
    "Xỉu đang bệt kìa, theo Xỉu thôi!",
    "Má gêm lồn bịp",
    "Địt cụ game",
    "Theo cầu Tài nào!",
    "Đổi gió sang Xỉu xem sao?",
    "Xác xuất như con cặc",
    "Bố đến chịu con rồi đấy",
    "Tao bảo tay này Tài bây tin không?",
    "May mắn sẽ đến với người cược nào?",
    "Cửa nào đang hot nhất?",
    "Đợi chờ kết quả!",
    "Cầu này khó đoán quá!",
    "Tin vào trực giác của bạn!",
    "Lại cắm tiếp cái sổ đỏ của bà già thôi"
];

// --- Hàm lưu game vào localStorage (cho user hiện tại) ---
function saveGame() {
    if (!currentUser) return;
    const gameState = {
        balance: currentBalance,
        historyHTML: gameHistoryElement ? gameHistoryElement.innerHTML : '',
        sessionHistory: sessionHistory
    };
    localStorage.setItem(`taiXiuGame_User_${currentUser}`, JSON.stringify(gameState));
}

// --- Hàm tải game từ localStorage ---
function loadGame() {
    if (!currentUser) {
        resetGameState();
        updateBalanceDisplay();
        renderSessionHistory();
        gameResultElement.textContent = 'Nhập tên người dùng và Đăng nhập/Tải tài khoản để bắt đầu.';
        individualDiceResultElement.textContent = '';
        setBettingControlsEnabled(false);
        startGameButton.disabled = true;
        currentUserDisplay.textContent = 'Chưa đăng nhập';
        return;
    }
    const saved = localStorage.getItem(`taiXiuGame_User_${currentUser}`);
    if (saved) {
        const gameState = JSON.parse(saved);
        currentBalance = gameState.balance ?? INITIAL_BALANCE;
        if (gameHistoryElement && gameState.historyHTML !== undefined) {
            gameHistoryElement.innerHTML = gameState.historyHTML;
        } else if (gameHistoryElement) {
            gameHistoryElement.innerHTML = '';
        }
        sessionHistory = gameState.sessionHistory || [];
        addChatMessage(`[System] Chào mừng trở lại, ${currentUser}!`, 'system');
    } else {
        resetGameState();
        addChatMessage(`[System] Chào mừng người dùng mới, ${currentUser}!`, 'system');
    }
    updateBalanceDisplay();
    renderSessionHistory();
    updateTotalBetDisplays();
    gameResultElement.textContent = 'Click "Bắt đầu game mới" để chơi!';
    individualDiceResultElement.textContent = '';
    setBettingControlsEnabled(false);
    startGameButton.disabled = false;
    currentUserDisplay.textContent = currentUser;
}

// --- Hàm reset trạng thái game về mặc định ---
function resetGameState() {
    currentBalance = INITIAL_BALANCE;
    sessionHistory = [];
    if (gameHistoryElement) gameHistoryElement.innerHTML = '';
    totalBetOnTai = 0;
    totalBetOnXiu = 0;
    gameInProgress = false;
    gameResultData = null;
    if(timerInterval) clearInterval(timerInterval);
    if(autoStartTimer) clearTimeout(autoStartTimer);
    timeLeft = 10;
    timeElement.textContent = timeLeft;
    timeElement.classList.remove('low-time');
    bowlElement.classList.add('hidden');
    diceElements.forEach(dice => {
        dice.classList.remove('shaking');
        dice.classList.remove('show-1','show-2','show-3','show-4','show-5','show-6');
    });
    updateBalanceDisplay();
    updateTotalBetDisplays();
}

// --- Cập nhật hiển thị số dư ---
function updateBalanceDisplay() {
    balanceElement.textContent = currentBalance.toLocaleString('vi-VN');
}

// --- Cập nhật tổng cược hiển thị ---
function updateTotalBetDisplays() {
    totalBetTaiElement.textContent = totalBetOnTai.toLocaleString('vi-VN');
    totalBetXiuElement.textContent = totalBetOnXiu.toLocaleString('vi-VN');
}

// --- Hiển thị số chấm xúc xắc ---
function showDiceResult(diceElement, value) {
    diceElement.classList.remove('show-1','show-2','show-3','show-4','show-5','show-6');
    diceElement.classList.add(`show-${value}`);
}

// --- Thêm quả cầu lịch sử ---
function addHistoryEntry(outcome, diceValues, total) {
    if (!gameHistoryElement) return;
    const sphere = document.createElement('div');
    sphere.classList.add('history-sphere');
    if (outcome === 'Tài') sphere.classList.add('tai');
    else if (outcome === 'Xỉu') sphere.classList.add('xiu');
    else if (outcome === 'Bộ ba đồng nhất') sphere.classList.add('triple');
    sphere.textContent = total;
    gameHistoryElement.prepend(sphere);
    while (gameHistoryElement.children.length > 15) {
        gameHistoryElement.lastChild.remove();
    }
}

// --- Thêm tin nhắn chat ---
function addChatMessage(msg, type='ai') {
    const div = document.createElement('div');
    div.classList.add('chat-message');
    if (type === 'self') div.classList.add('self');
    else if (type === 'system') div.classList.add('system');
    div.textContent = msg;
    chatMessagesElement.appendChild(div);
    chatMessagesElement.scrollTop = chatMessagesElement.scrollHeight;
}

// --- Tin nhắn AI theo kết quả ---
function sendAIMessage(type) {
    if (type === 'outcome' && gameResultData) {
        const {outcome, total} = gameResultData;
        let msg = '';
        if (outcome === 'Tài') msg = `Kết quả là TÀI (${total} điểm)! Mấy thằng ngu theo Xỉu ra đê ngủ thôi em ơiiii `;
        else if (outcome === 'Xỉu') msg = `Kết quả là XỈU (${total} điểm)! Địt cụ mấy thằng ngu theo Tài`;
        else if (outcome === 'Bộ ba đồng nhất') msg = `Kết quả là Bộ ba đồng nhất (${total} điểm)! Nhà cái húp hết!`;
        else msg = `Kết quả cuối cùng: Tổng ${total} điểm.`;
        addChatMessage("[AI] " + msg, 'ai');
    }
}

// --- Tin nhắn AI ngẫu nhiên liên tục (chỉ khi đăng nhập) ---
function startContinuousChat() {
    const minInterval = 3000;
    const maxInterval = 8000;
    function scheduleMessage() {
        if (!currentUser) {
            setTimeout(scheduleMessage, 5000);
            return;
        }
        const msg = aiMessages[Math.floor(Math.random()*aiMessages.length)];
        if(chatMessagesElement.children.length >= 200) {
            chatMessagesElement.firstChild.remove();
        }
        addChatMessage("[AI] " + msg, 'ai');
        setTimeout(scheduleMessage, Math.random()*(maxInterval-minInterval)+minInterval);
    }
    setTimeout(scheduleMessage, 1000);
}

// --- Gửi tin nhắn người chơi ---
function sendPlayerMessage() {
    if (!currentUser) {
        addChatMessage("[System] Vui lòng đăng nhập để chat.", 'system');
        chatMessageInput.value = '';
        return;
    }
    const msg = chatMessageInput.value.trim();
    if (!msg) return;
    addChatMessage("You: " + msg, 'self');
    chatMessageInput.value = '';
}

// --- Hiển thị lịch sử phiên có phân trang ---
function renderSessionHistory() {
    sessionHistoryGridElement.innerHTML = '';
    sessionDetailedHistoryElement.innerHTML = '<h4>Chi tiết:</h4>';
    
    let taiCount = 0;
    let xiuCount = 0;
    totalPages = Math.max(1, Math.ceil(sessionHistory.length / itemsPerPage));
    if (currentPage < 1) currentPage = 1;
    if (currentPage > totalPages) currentPage = totalPages;
    
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageItems = sessionHistory.slice(start, end);
    
    pageItems.forEach(round => {
        const gridItem = document.createElement('div');
        gridItem.classList.add('history-grid-item');
        if (round.outcome === 'Tài') gridItem.classList.add('tai');
        else if (round.outcome === 'Xỉu') gridItem.classList.add('xiu');
        else if (round.outcome === 'Bộ ba đồng nhất') gridItem.classList.add('triple');
        sessionHistoryGridElement.appendChild(gridItem);
    });
    
    sessionHistory.forEach(round => {
        if (round.outcome === 'Tài') taiCount++;
        else if (round.outcome === 'Xỉu') xiuCount++;
    });
    sessionCountTaiElement.textContent = taiCount;
    sessionCountXiuElement.textContent = xiuCount;
    
    const recent = sessionHistory.slice(0, 10);
    if(recent.length > 0) {
        const reversed = [...recent].reverse();
        reversed.forEach((round, idx) => {
            const entry = document.createElement('div');
            const displayRoundNumber = sessionHistory.length - (recent.length - 1 - idx);
            entry.textContent = `Ván ${displayRoundNumber}: ${round.outcome} - (${round.values.join(' + ')}) = ${round.total} điểm`;
            sessionDetailedHistoryElement.appendChild(entry);
        });
    } else {
        const noHistory = document.createElement('div');
        noHistory.textContent = "Chưa có lịch sử chi tiết trong phiên này.";
        sessionDetailedHistoryElement.appendChild(noHistory);
    }
    
    pageInfoSpan.textContent = `Trang ${currentPage} / ${totalPages}`;
    prevPageButton.disabled = (currentPage === 1);
    nextPageButton.disabled = (currentPage === totalPages);
    
    const paginationControls = document.querySelector('.session-pagination');
    if(paginationControls) {
        paginationControls.style.display = totalPages > 1 ? 'flex' : 'none';
    }
}

// --- Điều hướng lịch sử ---
function goToPage(page) {
    if(page >= 1 && page <= totalPages) {
        currentPage = page;
        renderSessionHistory();
    }
}

prevPageButton.addEventListener('click', () => goToPage(currentPage - 1));
nextPageButton.addEventListener('click', () => goToPage(currentPage + 1));

// --- Cập nhật bộ đếm thời gian ---
function updateTimer() {
    timeElement.textContent = timeLeft;
    if (timeLeft > 0 && timeLeft <= 10) {
        timeElement.classList.add('low-time');
    } else {
        timeElement.classList.remove('low-time');
    }
    if (timeLeft === 0) {
        clearInterval(timerInterval);
        prepareForReveal();
    } else {
        timeLeft--;
    }
}

// --- Bắt đầu game ---
function startGame() {
    if (!currentUser) {
        addChatMessage("[System] Vui lòng đăng nhập để bắt đầu game.", 'system');
        return;
    }
    if (autoStartTimer) {
        clearTimeout(autoStartTimer);
        autoStartTimer = null;
    }
    if (gameInProgress) return;
    
    gameInProgress = true;
    timeLeft = 10;
    totalBetOnTai = 0;
    totalBetOnXiu = 0;
    updateTotalBetDisplays();
    gameResultData = null;
    
    gameResultElement.textContent = 'Nhập số tiền và đặt cược...';
    individualDiceResultElement.textContent = '';
    
    setBettingControlsEnabled(true);
    startGameButton.disabled = true;
    
    bowlElement.classList.remove('hidden');
    bowlElement.style.cssText = `cursor: default; position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%);`;
    
    diceElements.forEach(dice => {
        dice.classList.remove('shaking','show-1','show-2','show-3','show-4','show-5','show-6');
        dice.classList.add('shaking');
    });
    
    timeElement.classList.remove('low-time');
    timerInterval = setInterval(updateTimer, 1000);
}

// --- Chuẩn bị hiển thị kết quả ---
function prepareForReveal() {
    gameInProgress = false;
    setBettingControlsEnabled(false);
    
    diceElements.forEach(dice => {
        dice.classList.remove('shaking','show-1','show-2','show-3','show-4','show-5','show-6');
    });
    
    const d1 = rollDice();
    const d2 = rollDice();
    const d3 = rollDice();
    const total = d1 + d2 + d3;
    
    let outcome;
    if(d1 === d2 && d2 === d3) outcome = 'Bộ ba đồng nhất';
    else if(total >= 11 && total <= 17) outcome = 'Tài';
    else if(total >= 4 && total <= 10) outcome = 'Xỉu';
    else outcome = 'Không xác định';
    
    gameResultData = {
        diceValues: [d1, d2, d3],
        total,
        outcome,
        betTai: totalBetOnTai,
        betXiu: totalBetOnXiu
    };
    
    gameResultElement.textContent = 'Hết giờ! Kéo (nặn) bát để xem kết quả!';
    individualDiceResultElement.textContent = '';
    
    bowlElement.classList.remove('hidden');
    bowlElement.style.cursor = 'grab';
    bowlElement.style.cssText = `position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%);`;
    
    const bowlRect = bowlElement.getBoundingClientRect();
    const containerRect = diceBowlContainer.getBoundingClientRect();
    initialBowlXRelativeToContainer = bowlRect.left - containerRect.left;
    initialBowlYRelativeToContainer = bowlRect.top - containerRect.top;
}

// --- Roll xúc xắc ngẫu nhiên 1 - 6 ---
function rollDice() {
    return Math.floor(Math.random() * 6) + 1;
}

// --- Bật/tắt controls đặt cược ---
function setBettingControlsEnabled(enabled) {
    betAmountInput.disabled = !enabled;
    placeBetButtons.forEach(btn => btn.disabled = !enabled);
    quickBetButtons.forEach(btn => btn.disabled = !enabled);
}

// --- Đặt cược sự kiện ---
placeBetButtons.forEach(button => {
    button.addEventListener('click', () => {
        if (!gameInProgress) {
            alert('Vui lòng bắt đầu game mới.');
            return;
        }
        if (!currentUser) {
            addChatMessage("[System] Vui lòng đăng nhập để đặt cược.", 'system');
            return;
        }
        const betAmount = parseInt(betAmountInput.value);
        const betType = button.dataset.betType;
        if (isNaN(betAmount) || betAmount <= 0) {
            alert('Vui lòng nhập số tiền cược hợp lệ.');
            return;
        }
        if (betAmount < 1000) {
            alert('Số tiền cược tối thiểu là 1000 đ.');
            return;
        }
        if (betAmount > currentBalance) {
            alert(`Số dư không đủ (${currentBalance.toLocaleString('vi-VN')} đ) để đặt cược số tiền này (${betAmount.toLocaleString('vi-VN')} đ).`);
            return;
        }
        currentBalance -= betAmount;
        updateBalanceDisplay();
        if (betType === 'tai') {
            totalBetOnTai += betAmount;
            gameResultElement.textContent = `Đã đặt ${betAmount.toLocaleString('vi-VN')} đ vào cửa TÀI. Tổng cược Tài: ${totalBetOnTai.toLocaleString('vi-VN')} đ`;
        } else if (betType === 'xiu') {
            totalBetOnXiu += betAmount;
            gameResultElement.textContent = `Đã đặt ${betAmount.toLocaleString('vi-VN')} đ vào cửa XỈU. Tổng cược Xỉu: ${totalBetOnXiu.toLocaleString('vi-VN')} đ`;
        }
        updateTotalBetDisplays();
        saveGame();
    });
});

// --- Đặt cược nhanh ---
quickBetButtons.forEach(button => {
    button.addEventListener('click', () => {
        if (!gameInProgress || !currentUser) return;
        const betAmountType = button.dataset.amount;
        let amount = betAmountType === 'all' ? currentBalance : parseInt(betAmountType);
        if (isNaN(amount) || amount <= 0) return;
        if (amount < 1000 && betAmountType !== 'all') {
            alert('Số tiền cược tối thiểu là 1000 đ.');
            return;
        }
        if (amount > currentBalance) return;
        betAmountInput.value = amount;
        // Có thể tự động đặt cược sau khi chọn số tiền nếu muốn
    });
});

// --- Đặt lại số dư ---
function resetBalance() {
    if(!currentUser) {
        addChatMessage("[System] Vui lòng đăng nhập để đặt lại tiền.", 'system');
        return;
    }
    currentBalance = INITIAL_BALANCE;
    updateBalanceDisplay();
    saveGame();
    addChatMessage(`[System] Số dư của ${currentUser} đã được đặt lại về ${INITIAL_BALANCE.toLocaleString('vi-VN')} đ.`, 'system');
}
resetBalanceButton.addEventListener('click', resetBalance);

// --- Chat gửi tin nhắn người chơi ---
sendChatMessageButton.addEventListener('click', sendPlayerMessage);
chatMessageInput.addEventListener('keypress', e => {
    if(e.key === 'Enter') {
        e.preventDefault();
        sendPlayerMessage();
    }
});

// --- Bắt đầu game khi bấm nút ---
startGameButton.addEventListener('click', startGame);

// --- Đăng nhập người dùng ---
loginButton.addEventListener('click', () => {
    const username = usernameInput.value.trim();
    if (!username) {
        addChatMessage("[System] Vui lòng nhập tên người dùng.", 'system');
        return;
    }
    currentUser = username;
    loadGame();
    setBettingControlsEnabled(false);
    startGameButton.disabled = false;
});
usernameInput.addEventListener('keypress', e => {
    if(e.key === 'Enter') {
        e.preventDefault();
        loginButton.click();
    }
});

// --- Xử lý kéo bát (mousedown) ---
bowlElement.addEventListener('mousedown', event => {
    if (!gameInProgress && gameResultData) {
        isDragging = true;
        const bowlRect = bowlElement.getBoundingClientRect();
        dragOffsetX = event.clientX - bowlRect.left;
        dragOffsetY = event.clientY - bowlRect.top;
        const containerRect = diceBowlContainer.getBoundingClientRect();
        const leftRel = bowlRect.left - containerRect.left;
        const topRel = bowlRect.top - containerRect.top;
        bowlElement.style.position = 'absolute';
        bowlElement.style.left = `${leftRel}px`;
        bowlElement.style.top = `${topRel}px`;
        bowlElement.style.transform = 'none';
        initialBowlXRelativeToContainer = leftRel;
        initialBowlYRelativeToContainer = topRel;
        bowlElement.style.cursor = 'grabbing';
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
        event.preventDefault();
    }
});

// --- Di chuyển khi kéo ---
function onMouseMove(event) {
    if (!isDragging) return;
    const containerRect = diceBowlContainer.getBoundingClientRect();
    let left = event.clientX - containerRect.left - dragOffsetX;
    let top = event.clientY - containerRect.top - dragOffsetY;
    bowlElement.style.left = `${left}px`;
    bowlElement.style.top = `${top}px`;
    // Hiện dấu chấm xúc xắc khi kéo xa
    if(gameResultData) {
        diceElements.forEach((diceEl, idx) => {
            const diceRect = diceEl.getBoundingClientRect();
            const diceCenterX = diceRect.left + diceEl.offsetWidth/2;
            const diceCenterY = diceRect.top + diceEl.offsetHeight/2;
            const bowlCenterX = left + bowlElement.offsetWidth/2;
            const bowlCenterY = top + bowlElement.offsetHeight/2;
            const distance = Math.hypot(bowlCenterX - diceCenterX, bowlCenterY - diceCenterY);
            const threshold = (bowlElement.offsetWidth/2) + (diceEl.offsetWidth/2)*0.5;
            const revealStart = threshold * 0.8;
            if(distance > revealStart) {
                if(!diceEl.classList.contains(`show-${gameResultData.diceValues[idx]}`)) {
                    showDiceResult(diceEl, gameResultData.diceValues[idx]);
                }
            } else {
                diceEl.classList.remove('show-1','show-2','show-3','show-4','show-5','show-6');
            }
        });
    }
}

// --- Thả chuột ngừng kéo ---
function onMouseUp() {
    if(!isDragging) return;
    isDragging = false;
    bowlElement.style.cursor = 'pointer';
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
    if(gameResultData) {
        diceElements.forEach((diceEl, idx) => showDiceResult(diceEl, gameResultData.diceValues[idx]));
    }
    revealResultPostDrag();
}

// --- Xử lý hiển thị kết quả sau kéo ---
function revealResultPostDrag() {
    if (gameInProgress || !gameResultData) return;

    bowlElement.classList.add('hidden');

    let resultText = `Tổng điểm: ${gameResultData.total}`;
    individualDiceResultElement.textContent = `(${gameResultData.diceValues.join(' + ')})`;

    if (gameResultData.outcome === 'Tài') {
        resultText += ' - Kết quả: TÀI';
        if (gameResultData.betTai > 0) {
            const payout = gameResultData.betTai * 2;
            currentBalance += payout;
            resultText += ` - Bạn thắng ${gameResultData.betTai.toLocaleString('vi-VN')} đ (Nhận ${payout.toLocaleString('vi-VN')} đ).`;
        } else if (gameResultData.betXiu > 0) {
            resultText += ` - Bạn thua ${gameResultData.betXiu.toLocaleString('vi-VN')} đ.`;
        } else {
            resultText += ' - Bạn chưa đặt cược.';
        }
    } else if (gameResultData.outcome === 'Xỉu') {
        resultText += ' - Kết quả: XỈU';
        if (gameResultData.betXiu > 0) {
            const payout = gameResultData.betXiu * 2;
            currentBalance += payout;
            resultText += ` - Bạn thắng ${gameResultData.betXiu.toLocaleString('vi-VN')} đ (Nhận ${payout.toLocaleString('vi-VN')} đ).`;
        } else if (gameResultData.betTai > 0) {
            resultText += ` - Bạn thua ${gameResultData.betTai.toLocaleString('vi-VN')} đ.`;
        } else {
            resultText += ' - Bạn chưa đặt cược.';
        }
    } else if (gameResultData.outcome === 'Bộ ba đồng nhất') {
        resultText += ' - Kết quả: Bộ ba đồng nhất!';
        const totalLost = gameResultData.betTai + gameResultData.betXiu;
        if (totalLost > 0) {
            resultText += ` - Bạn thua ${totalLost.toLocaleString('vi-VN')} đ do Bộ ba đồng nhất.`;
        } else {
            resultText += ' - Bạn chưa đặt cược.';
        }
    } else {
        resultText += ' - Không xác định kết quả.';
    }

    updateBalanceDisplay();
    gameResultElement.textContent = resultText;

    // Cập nhật lịch sử phiên và quả cầu
    sessionHistory.unshift({
        outcome: gameResultData.outcome,
        values: [...gameResultData.diceValues],
        total: gameResultData.total
    });
    addHistoryEntry(gameResultData.outcome, gameResultData.diceValues, gameResultData.total);

    currentPage = 1;
    renderSessionHistory();

    saveGame();
    sendAIMessage('outcome');
    gameResultData = null;

    // Tự động bắt đầu game mới sau 3 giây
    gameResultElement.textContent += ' | Ván mới bắt đầu sau 3 giây...';
    startGameButton.disabled = true;
    autoStartTimer = setTimeout(startGame, 3000);
}

// --- Khởi tạo giao diện ---
resetGameState();
setBettingControlsEnabled(false);
startGameButton.disabled = true;
currentUserDisplay.textContent = 'Chưa đăng nhập';
gameResultElement.textContent = 'Nhập tên người dùng và Đăng nhập/Tải tài khoản để bắt đầu.';

// --- Bắt đầu chat AI liên tục ---
startContinuousChat();
