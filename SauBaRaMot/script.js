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
    
    // Lấy các nút đặt cược nhanh
    const quickBetButtons = document.querySelectorAll('.quick-bet-button');
    
    // Lấy phần tử div hiển thị tin nhắn chat
    const chatMessagesElement = document.getElementById('chat-messages');
    
    // Lấy nút đặt lại tiền
    const resetBalanceButton = document.getElementById('reset-balance');
    
    // --- CÁC BIẾN MỚI CHO TÀI KHOẢN NGƯỜI DÙNG ---
    const usernameInput = document.getElementById('username-input');
    const loginButton = document.getElementById('login-button');
    const currentUserDisplay = document.getElementById('current-user-display');
    let currentUser = null; // Biến lưu trữ tên người dùng hiện tại
    
    // --- CÁC BIẾN CHO CHAT, KÉO BÁT VÀ LỊCH SỬ PHIÊN ---
    const chatMessageInput = document.getElementById('chat-message-input');
    const sendChatMessageButton = document.getElementById('send-chat-message');
    
    let isDragging = false; // Biến theo dõi trạng thái kéo bát
    let dragOffsetX = 0; // Lưu khoảng cách từ góc bát đến điểm click chuột (theo chiều ngang)
    let dragOffsetY = 0; // Lưu khoảng cách từ góc bát đến điểm click chuột (theo chiều dọc)
    const diceBowlContainer = document.querySelector('.dice-bowl-container'); // Container chứa bát và xúc xắc
    
    // Biến lưu vị trí ban đầu của bát khi bắt đầu kéo (để tính khoảng cách kéo)
    let initialBowlXRelativeToContainer = 0;
    let initialBowlYRelativeToContainer = 0;
    
    // Biến và hằng số cho Lịch sử Phiên
    const sessionCountTaiElement = document.getElementById('session-count-tai');
    const sessionCountXiuElement = document.getElementById('session-count-xiu');
    const sessionHistoryGridElement = document.getElementById('session-history-grid');
    const sessionDetailedHistoryElement = document.getElementById('session-detailed-history');
    
    // NEW Pagination elements
    const prevPageButton = document.getElementById('prev-page');
    const nextPageButton = document.getElementById('next-page');
    const pageInfoSpan = document.getElementById('page-info');
    
    
    let sessionHistory = []; // Mảng lưu trữ lịch sử cho phiên chơi hiện tại
    const MAX_SESSION_HISTORY_GRID = 50; // Giới hạn số lượng ván hiển thị trong lưới lịch sử (Biến này vẫn tồn tại nhưng logic hiển thị lưới không dùng đến nó nữa theo yêu cầu trước)
    const MAX_DETAILED_HISTORY = 10; // Giới hạn số lượng ván hiển thị chi tiết
    
    // NEW Pagination state
    let currentPage = 1;
    const itemsPerPage = 10; // Người dùng yêu cầu 10 item mỗi trang
    let totalPages = 1;
    
    
    // Khóa localStorage cơ sở, sẽ thêm tên người dùng vào
    const STORAGE_BASE_KEY = 'taiXiuGame_User_';
    const INITIAL_BALANCE = 10000; // Định nghĩa số tiền ban đầu
    
    
    let currentBalance = INITIAL_BALANCE; // Sử dụng hằng số cho giá trị mặc định
    let timeLeft = 10; // Thời gian cho mỗi ván
    let timerInterval; // Biến lưu trữ ID của bộ đếm thời gian
    let totalBetOnTai = 0; // Tổng tiền cược vào cửa Tài trong ván hiện tại
    let totalBetOnXiu = 0; // Tổng tiền cược vào cửa Xỉu trong ván hiện tại
    let gameInProgress = false; // Trạng thái game đang diễn ra hay không
    let gameResultData = null; // Biến để lưu kết quả game sau khi hết giờ đặt cược
    let autoStartTimer = null; // Biến lưu trữ ID của timer tự động bắt đầu game mới
    
    
    // Danh sách các tin nhắn AI có thể sử dụng (lịch sự và game-related, bao gồm cả những tin nhắn bạn cung cấp)
    const aiMessages = [
        "Ván này Tài có vẻ sáng cửa đấy anh em!",
        "Xỉu đang bệt kìa, theo Xỉu thôi!",
        "Má gêm lồn bịp", // Tin nhắn từ người dùng
        "Địt cụ game",   // Tin nhắn từ người dùng
        "Theo cầu Tài nào!",
        "Đổi gió sang Xỉu xem sao?",
        "Xác xuất như con cặc", // Tin nhắn từ người dùng
        "Bố đến chịu con rồi đấy",
        "Tao bảo tay này Tài bây tin không?",
        "May mắn sẽ đến với người cược nào?",
        "Cửa nào đang hot nhất?",
        "Đợi chờ kết quả!",
        "Cầu này khó đoán quá!",
        "Tin vào trực giác của bạn!",
        "Lại cắm tiếp cái sổ đỏ của bà già thôi" // Tin nhắn từ người dùng
    ];
    
    
    // Hàm lưu trạng thái game vào Local Storage (Lưu cho người dùng hiện tại)
    function saveGame() {
        if (!currentUser) {
            console.warn("Không có người dùng đăng nhập. Không thể lưu game.");
            return;
        }
        const gameState = {
            balance: currentBalance,
            historyHTML: gameHistoryElement ? gameHistoryElement.innerHTML : '', // Lưu lịch sử quả cầu (kiểm tra tồn tại)
            sessionHistory: sessionHistory // Lưu lịch sử phiên dạng mảng
        };
        localStorage.setItem(STORAGE_BASE_KEY + currentUser, JSON.stringify(gameState));
    }
    
    // Hàm tải trạng thái game từ Local Storage (Tải cho người dùng hiện tại)
    function loadGame() {
        if (!currentUser) {
            // Nếu không có người dùng, reset về trạng thái mặc định
            resetGameState();
            updateBalanceDisplay();
            renderSessionHistory();
            gameResultElement.textContent = 'Nhập tên người dùng và Đăng nhập/Tải tài khoản.';
            individualDiceResultElement.textContent = '';
            setBettingControlsEnabled(false);
            startGameButton.disabled = true; // Nút bắt đầu game bị vô hiệu hóa nếu chưa đăng nhập
            currentUserDisplay.textContent = 'Chưa đăng nhập';
            return;
        }
    
        const savedState = localStorage.getItem(STORAGE_BASE_KEY + currentUser);
        if (savedState) {
            const gameState = JSON.parse(savedState);
            currentBalance = gameState.balance;
            if (gameHistoryElement && gameState.historyHTML !== undefined) { // Kiểm tra phần tử và dữ liệu lịch sử quả cầu tồn tại
              gameHistoryElement.innerHTML = gameState.historyHTML; // Tải lịch sử quả cầu
            } else if (gameHistoryElement) {
                // Nếu không có historyHTML trong savedState nhưng phần tử tồn tại, xóa lịch sử cũ
                gameHistoryElement.innerHTML = '';
            }
            sessionHistory = gameState.sessionHistory || []; // Tải lịch sử phiên, mặc định là mảng rỗng
            addChatMessage(`[System] Chào mừng trở lại, ${currentUser}!`, 'system');
    
        } else {
            // Nếu không có dữ liệu lưu cho người dùng này, khởi tạo mới
            resetGameState(); // Reset state game về mặc định
            addChatMessage(`[System] Chào mừng người dùng mới, ${currentUser}!`, 'system');
        }
    
        updateBalanceDisplay(); // Cập nhật hiển thị số dư
        renderSessionHistory(); // *** Render lịch sử phiên sau khi tải ***
    
        // Cập nhật hiển thị ban đầu các thành phần khác sau khi tải/khởi tạo
        updateTotalBetDisplays();
        gameResultElement.textContent = 'Click "Bắt đầu game mới" để chơi!';
        individualDiceResultElement.textContent = '';
    
        // Đảm bảo các nút cược bị vô hiệu hóa khi mới tải trừ khi game bắt đầu
        setBettingControlsEnabled(false);
        startGameButton.disabled = false; // Nút bắt đầu game luôn sẵn sàng khi tải cho user đã login
        currentUserDisplay.textContent = currentUser; // Hiển thị tên người dùng hiện tại
    }
    
    // Hàm reset trạng thái game về mặc định (khi chưa có dữ liệu user hoặc user mới)
    function resetGameState() {
        currentBalance = INITIAL_BALANCE;
        sessionHistory = [];
        if (gameHistoryElement) {
            gameHistoryElement.innerHTML = ''; // Xóa lịch sử quả cầu
        }
        totalBetOnTai = 0;
        totalBetOnXiu = 0;
        gameInProgress = false;
        gameResultData = null;
        // Dừng timer nếu đang chạy
        if (timerInterval) clearInterval(timerInterval);
        if (autoStartTimer) clearTimeout(autoStartTimer);
        timeLeft = 10; // Reset thời gian
        timeElement.textContent = timeLeft; // Cập nhật hiển thị thời gian
        timeElement.classList.remove('low-time');
        // Ẩn bát và reset xúc xắc về trạng thái ban đầu
        bowlElement.classList.add('hidden');
        diceElements.forEach(dice => {
            dice.classList.remove('shaking');
            dice.classList.remove('show-1', 'show-2', 'show-3', 'show-4', 'show-5', 'show-6');
        });
    }
    
    
    // Cập nhật hiển thị số dư
    function updateBalanceDisplay() {
        balanceElement.textContent = currentBalance.toLocaleString('vi-VN'); // Định dạng tiền tệ Việt Nam
    }
    
    // Cập nhật hiển thị tổng tiền cược vào từng cửa
    function updateTotalBetDisplays() {
        totalBetTaiElement.textContent = totalBetOnTai.toLocaleString('vi-VN');
        totalBetXiuElement.textContent = totalBetOnXiu.toLocaleString('vi-VN');
    }
    
    // Hàm hiển thị số chấm trên xúc xắc
    function showDiceResult(diceElement, result) {
        // Xóa tất cả các class show-X hiện có
        diceElement.classList.remove('show-1', 'show-2', 'show-3', 'show-4', 'show-5', 'show-6');
        // Thêm class show-X tương ứng với kết quả
        diceElement.classList.add(`show-${result}`);
    }
    
    // Hàm thêm kết quả vào lịch sử quả cầu (Hiển thị tổng điểm)
    function addHistoryEntry(outcome, diceValues, total) { // Thêm tham số total
        // Chỉ thêm vào lịch sử quả cầu nếu phần tử tồn tại trên trang
        if (!gameHistoryElement) {
            return;
        }
    
        const historySphere = document.createElement('div');
        historySphere.classList.add('history-sphere');
    
        // Thêm class màu dựa trên kết quả Tài/Xỉu/Bộ ba đồng nhất
        if (outcome === 'Tài') {
            historySphere.classList.add('tai');
        } else if (outcome === 'Xỉu') {
            historySphere.classList.add('xiu');
        } else if (outcome === 'Bộ ba đồng nhất') {
            historySphere.classList.add('triple');
        }
    
        // Hiển thị TỔNG điểm thay vì chữ Tài/Xỉu/B3
        historySphere.textContent = total;
    
    
        gameHistoryElement.prepend(historySphere);
    
        const maxOldHistoryItems = 15; // Giới hạn lịch sử quả cầu
        while (gameHistoryElement.children.length > maxOldHistoryItems) {
            gameHistoryElement.lastChild.remove();
        }
    }
    
    // Hàm thêm tin nhắn vào chatbox (đã sửa để nhận thêm loại tin nhắn)
    function addChatMessage(message, type = 'ai') { // Mặc định là tin nhắn AI
        const chatMessageDiv = document.createElement('div');
        chatMessageDiv.classList.add('chat-message');
        if (type === 'self') {
            chatMessageDiv.classList.add('self'); // Thêm class 'self' nếu là tin nhắn của người chơi
        } else if (type === 'system') {
            chatMessageDiv.classList.add('system'); // Thêm class 'system' cho tin nhắn hệ thống (ví dụ: đặt lại tiền)
        }
        chatMessageDiv.textContent = message;
        chatMessagesElement.appendChild(chatMessageDiv);
    
        chatMessagesElement.scrollTop = chatMessagesElement.scrollHeight;
    }
    
    // Hàm tạo và gửi tin nhắn AI (triggered by game events - outcome)
    function sendAIMessage(type) {
        let message = "";
        if (type === 'outcome' && gameResultData) {
             const outcome = gameResultData.outcome;
            const total = gameResultData.total;
            if (outcome === 'Tài') {
                message = `Kết quả là TÀI (${total} điểm)! Mấy thằng ngu theo Xỉu ra đê ngủ thôi em ơiiii `;
            } else if (outcome === 'Xỉu') {
                message = `Kết quả là XỈU (${total} điểm)! Địt cụ mấy thằng ngu theo Tài`;
            } else if (outcome === 'Bộ ba đồng nhất') {
                 message = `Kết quả là Bộ ba đồng nhất (${total} điểm)! Nhà cái húp hết!`;
            } else {
                 message = `Kết quả cuối cùng: Tổng ${total} điểm.`;
            }
             addChatMessage("[AI] " + message, 'ai');
        }
    }
    
    // --- HÀM THÊM TIN NHẮN NGẪU NHIÊN TỪ AI (CHO CHẾ ĐỘ VÔ CỰC) ---
    function addRandomChatMessage() {
        const minInterval = 3000;
        const maxInterval = 8000;
    
        function scheduleNextMessage() {
            // Chỉ gửi tin nhắn AI nếu đang có người dùng đăng nhập
            if (!currentUser) {
                // Nếu không có user, dừng hoặc lên lịch kiểm tra lại sau
                setTimeout(scheduleNextMessage, 5000); // Kiểm tra lại sau 5s
                return;
            }
    
            const randomIndex = Math.floor(Math.random() * aiMessages.length);
            const message = aiMessages[randomIndex];
    
            setTimeout(() => {
                if (chatMessagesElement.children.length < 200) {
                    addChatMessage("[AI] " + message, 'ai');
                } else {
                    chatMessagesElement.firstChild.remove();
                    addChatMessage("[AI] " + message, 'ai');
                }
                scheduleNextMessage(); // Lên lịch tin nhắn tiếp theo sau khi gửi
            }, Math.random() * (maxInterval - minInterval) + minInterval);
        }
    
        // Bắt đầu chuỗi chat sau 1 giây khi hàm được gọi lần đầu
        setTimeout(() => {
            scheduleNextMessage();
        }, 1000);
    }
    
    // --- HÀM GỬI TIN NHẮN CỦA NGƯỜI CHƠI ---
    function sendPlayerMessage() {
        if (!currentUser) {
            addChatMessage("[System] Vui lòng đăng nhập để chat.", 'system');
            chatMessageInput.value = '';
            return;
        }
        const messageText = chatMessageInput.value.trim();
    
        if (messageText === '') {
            return;
        }
    
        addChatMessage("You: " + messageText, 'self');
        chatMessageInput.value = '';
    }
    
    
    // --- HÀM RENDER LỊch SỬ PHIÊN DẠNG LƯỚI VÀ CHI TIẾT (CÓ PHÂN TRANG) ---
    function renderSessionHistory() {
        // Xóa hiển thị lịch sử cũ
        sessionHistoryGridElement.innerHTML = '';
        sessionDetailedHistoryElement.innerHTML = '<h4>Chi tiết:</h4>'; // Giữ lại tiêu đề
    
        let taiCount = 0;
        let xiuCount = 0;
    
        // Tính tổng số trang dựa trên toàn bộ lịch sử
        totalPages = Math.max(1, Math.ceil(sessionHistory.length / itemsPerPage));
    
        // Đảm bảo currentPage nằm trong phạm vi hợp lệ
        if (currentPage < 1) currentPage = 1;
        if (currentPage > totalPages) currentPage = totalPages;
    
    
        // Tính toán chỉ mục bắt đầu và kết thúc cho trang hiện tại
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        // Lấy phần lịch sử cần hiển thị cho trang hiện tại
        const historyToDisplay = sessionHistory.slice(startIndex, endIndex);
    
    
        // Render các item lưới cho trang hiện tại (GIỮ NGUYÊN, chỉ thêm class màu)
        historyToDisplay.forEach(round => {
            const gridItem = document.createElement('div');
            gridItem.classList.add('history-grid-item');
            if (round.outcome === 'Tài') {
                gridItem.classList.add('tai');
            } else if (round.outcome === 'Xỉu') {
                gridItem.classList.add('xiu');
            } else if (round.outcome === 'Bộ ba đồng nhất') {
                 gridItem.classList.add('triple');
            }
            sessionHistoryGridElement.appendChild(gridItem);
        });
    
        // Tính và cập nhật số đếm Tài/Xỉu (cho TOÀN BỘ lịch sử, không chỉ trang hiện tại)
        sessionHistory.forEach(round => {
            if (round.outcome === 'Tài') taiCount++;
            else if (round.outcome === 'Xỉu') xiuCount++;
        });
        sessionCountTaiElement.textContent = taiCount;
        sessionCountXiuElement.textContent = xiuCount;
    
    
        // Render lịch sử chi tiết cho các ván gần đây (không phân trang phần này)
        const recentHistory = sessionHistory.slice(0, MAX_DETAILED_HISTORY); // Lấy 10 ván gần nhất
         if (recentHistory.length > 0) {
             // Đảo ngược thứ tự để ván mới nhất hiển thị trên cùng trong danh sách chi tiết
             const reversedRecentHistory = [...recentHistory].reverse(); // Tạo bản sao và đảo ngược
             reversedRecentHistory.forEach((round, index) => {
                  const detailedEntry = document.createElement('div');
                  // Tính số thứ tự ván hiển thị
                  const displayRoundNumber = sessionHistory.length - (recentHistory.length - 1 - index); // Số ván thực tế từ cuối
    
    
                  let entryText = `Ván ${displayRoundNumber}: ${round.outcome} - (${round.values.join(' + ')}) = ${round.total} điểm`;
                  detailedEntry.textContent = entryText;
                  sessionDetailedHistoryElement.appendChild(detailedEntry); // Thêm vào cuối
             });
         } else {
              const noHistoryMessage = document.createElement('div');
              noHistoryMessage.textContent = "Chưa có lịch sử chi tiết trong phiên này.";
              sessionDetailedHistoryElement.appendChild(noHistoryMessage);
         }
    
    
        // --- Cập nhật các nút phân trang ---
        pageInfoSpan.textContent = `Trang ${currentPage} / ${totalPages}`;
    
        prevPageButton.disabled = (currentPage === 1); // Vô hiệu hóa nút "Trước" nếu đang ở trang 1
        nextPageButton.disabled = (currentPage === totalPages); // Vô hiệu hóa nút "Sau" nếu đang ở trang cuối
    
    
        // Ẩn hoặc hiển thị toàn bộ khu vực phân trang nếu chỉ có 1 trang
        const paginationControls = document.querySelector('.session-pagination');
        if (paginationControls) {
           if (totalPages <= 1) {
               paginationControls.style.display = 'none';
           } else {
               paginationControls.style.display = 'flex'; // Sử dụng flex như trong CSS
           }
        }
    }
    
    
    // --- CÁC HÀM ĐIỀU HƯỚNG TRANG LỊch SỬ ---
    function goToPage(page) {
        if (page >= 1 && page <= totalPages) {
            currentPage = page; // Cập nhật trang hiện tại
            renderSessionHistory(); // Render lại lịch sử cho trang mới
        }
    }
    
    // Thêm trình lắng nghe sự kiện click cho các nút phân trang
    prevPageButton.addEventListener('click', () => {
        goToPage(currentPage - 1); // Chuyển về trang trước
    });
    
    nextPageButton.addEventListener('click', () => {
        goToPage(currentPage + 1); // Chuyển sang trang sau
    });
    
    
    // Hàm cập nhật bộ đếm thời gian
    function updateTimer() {
        timeElement.textContent = timeLeft;
    
        if (timeLeft <= 10 && timeLeft > 0) {
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
    
    // Hàm bắt đầu game
    function startGame() {
        if (!currentUser) {
            addChatMessage("[System] Vui lòng đăng nhập để bắt đầu game.", 'system');
            return;
        }
    
        if (autoStartTimer !== null) {
            clearTimeout(autoStartTimer);
            autoStartTimer = null;
        }
    
        if (gameInProgress) {
            return;
        }
    
        gameInProgress = true;
        timeLeft = 10;
        totalBetOnTai = 0;
        totalBetOnXiu = 0;
        updateTotalBetDisplays();
        gameResultData = null;
    
        gameResultElement.textContent = 'Nhập số tiền và đặt cược...';
        individualDiceResultElement.textContent = '';
    
        setBettingControlsEnabled(true); // Bật điều khiển đặt cược
        startGameButton.disabled = true;
    
        bowlElement.classList.remove('hidden');
        bowlElement.style.cursor = 'default';
        bowlElement.style.position = 'absolute';
        bowlElement.style.left = '50%';
        bowlElement.style.top = '50%';
        bowlElement.style.transform = 'translate(-50%, -50%)';
    
        diceElements.forEach(dice => {
            dice.classList.remove('shaking');
            dice.classList.remove('show-1', 'show-2', 'show-3', 'show-4', 'show-5', 'show-6'); // Đảm bảo ẩn chấm
            dice.classList.add('shaking');
        });
    
        timeElement.classList.remove('low-time');
    
        timerInterval = setInterval(updateTimer, 1000);
    }
    
    // Hàm chuẩn bị hiển thị kết quả (sau khi hết giờ)
    function prepareForReveal() {
        gameInProgress = false;
    
        setBettingControlsEnabled(false); // Vô hiệu hóa điều khiển đặt cược
    
        diceElements.forEach(dice => {
            dice.classList.remove('shaking');
            dice.classList.remove('show-1', 'show-2', 'show-3', 'show-4', 'show-5', 'show-6'); // Đảm bảo ẩn chấm
        });
    
        const dice1Value = rollDice();
        const dice2Value = rollDice();
        const dice3Value = rollDice();
        const total = dice1Value + dice2Value + dice3Value;
    
        let gameOutcome;
        if (dice1Value === dice2Value && dice2Value === dice3Value) {
             gameOutcome = 'Bộ ba đồng nhất';
        } else if (total >= 11 && total <= 17) {
            gameOutcome = 'Tài';
        } else if (total >= 4 && total <= 10) {
            gameOutcome = 'Xỉu';
        } else {
            gameOutcome = 'Không xác định'; // Trường hợp này hiếm xảy ra trong Tài Xỉu 3 xúc xắc
        }
    
        gameResultData = {
            diceValues: [dice1Value, dice2Value, dice3Value],
            total: total,
            outcome: gameOutcome,
            betTai: totalBetOnTai,
            betXiu: totalBetOnXiu
        };
    
        gameResultElement.textContent = 'Hết giờ! Kéo (nặn) bát để xem kết quả!';
        individualDiceResultElement.textContent = '';
    
        bowlElement.classList.remove('hidden');
        bowlElement.style.cursor = 'grab';
    
         // Reset bowl position to its original centered state before dragging starts
         bowlElement.style.position = 'absolute';
         bowlElement.style.left = '50%';
         bowlElement.style.top = '50%';
         bowlElement.style.transform = 'translate(-50%, -50%)';
    
         // Capture initial position after resetting styles for drag calculation
         const bowlRect = bowlElement.getBoundingClientRect();
         const containerRect = diceBowlContainer.getBoundingClientRect();
         initialBowlXRelativeToContainer = bowlRect.left - containerRect.left;
         initialBowlYRelativeToContainer = bowlRect.top - containerRect.top;
    }
    
    // *** HÀM XỬ LÝ KÉO BÁT (NẶN) ***
    
    // Hàm xử lý khi nhấn chuột xuống trên bát
    bowlElement.addEventListener('mousedown', (event) => {
        // Chỉ cho phép kéo nếu game không trong tiến trình đặt cược và có kết quả cần hiển thị
        if (!gameInProgress && gameResultData !== null) {
            isDragging = true;
    
            const bowlRect = bowlElement.getBoundingClientRect();
            dragOffsetX = event.clientX - bowlRect.left;
            dragOffsetY = event.clientY - bowlRect.top;
    
            const containerRect = diceBowlContainer.getBoundingClientRect();
            const currentBowlLeftRelativeToContainer = bowlRect.left - containerRect.left;
            const currentBowlTopRelativeToContainer = bowlRect.top - containerRect.top;
    
            bowlElement.style.position = 'absolute';
            bowlElement.style.left = currentBowlLeftRelativeToContainer + 'px';
            bowlElement.style.top = currentBowlTopRelativeToContainer + 'px';
            bowlElement.style.transform = 'none';
    
            initialBowlXRelativeToContainer = currentBowlLeftRelativeToContainer;
            initialBowlYRelativeToContainer = currentBowlTopRelativeToContainer;
    
    
            bowlElement.style.cursor = 'grabbing';
    
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
    
            event.preventDefault();
        }
    });
    
    // Hàm xử lý khi di chuyển chuột (khi đang kéo)
    function onMouseMove(event) {
        if (!isDragging) return;
    
        const containerRect = diceBowlContainer.getBoundingClientRect();
        const containerLeft = containerRect.left;
        const containerTop = containerRect.top;
    
        let newBowlLeftRelativeToContainer = event.clientX - containerLeft - dragOffsetX;
        let newBowlTopRelativeToContainer = event.clientY - containerTop - dragOffsetY;
    
        bowlElement.style.left = newBowlLeftRelativeToContainer + 'px';
        bowlElement.style.top = newBowlTopRelativeToContainer + 'px';
    
    
        // --- LOGIC HIỂN THỊ CHẤM DẦN DẦN KHI KÉO BÁT ĐI ---
        if (gameResultData !== null) {
            diceElements.forEach((diceElement, index) => {
                 const diceRect = diceElement.getBoundingClientRect();
                 const diceLeftRelativeToContainer = diceRect.left - containerRect.left;
                 const diceTopRelativeToContainer = diceRect.top - containerRect.top;
    
                 const bowlCenterXRelativeToContainer = newBowlLeftRelativeToContainer + bowlElement.offsetWidth / 2;
                 const bowlCenterYRelativeToContainer = newBowlTopRelativeToContainer + bowlElement.offsetHeight / 2;
                 const diceCenterXRelativeToContainer = diceLeftRelativeToContainer + diceElement.offsetWidth / 2;
                 const diceCenterYRelativeToContainer = diceTopRelativeToContainer + diceElement.offsetHeight / 2;
    
                 const distance = Math.sqrt(
                     Math.pow(bowlCenterXRelativeToContainer - diceCenterXRelativeToContainer, 2) +
                     Math.pow(bowlCenterYRelativeToContainer - diceCenterYRelativeToContainer, 2)
                 );
    
                 const coveringDistanceThreshold = (bowlElement.offsetWidth / 2) + (diceElement.offsetWidth / 2) * 0.5;
                 const revealStartDistance = coveringDistanceThreshold * 0.8;
                 const revealEndDistance = coveringDistanceThreshold * 1.5;
    
    
                 const diceValue = gameResultData.diceValues[index];
    
                 if (distance > revealStartDistance) {
                     if (!diceElement.classList.contains(`show-${diceValue}`)) {
                          showDiceResult(diceElement, diceValue);
                     }
                 } else {
                      diceElement.classList.remove('show-1', 'show-2', 'show-3', 'show-4', 'show-5', 'show-6');
                 }
            });
        }
    }
    
    // Hàm xử lý khi thả chuột ra
    function onMouseUp() {
        if (!isDragging) return;
    
        isDragging = false;
        bowlElement.style.cursor = 'pointer';
    
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
    
        // Hiển thị chấm cuối cùng trên xúc xắc khi thả chuột ra
        if (gameResultData !== null) {
            showDiceResult(diceElements[0], gameResultData.diceValues[0]);
            showDiceResult(diceElements[1], gameResultData.diceValues[1]);
            showDiceResult(diceElements[2], gameResultData.diceValues[2]);
        }
    
        revealResultPostDrag();
    }
    
    // *** HÀM XỬ LÝ CÁC BƯỚC SAU KHI NẶN XONG (ẨN BÁT, HIỂN THỊ TỔNG, TÍNH TIỀN, LỊch SỬ, TỰ ĐỘNG GAME MỚI) ***
    function revealResultPostDrag() {
         if (gameInProgress || !gameResultData) {
              return;
         }
    
         bowlElement.classList.add('hidden');
    
         let resultText = `Tổng điểm: ${gameResultData.total}`;
         individualDiceResultElement.textContent = `(${gameResultData.diceValues.join(' + ')})`;
    
         if (gameResultData.outcome === 'Tài') {
             resultText += ' - Kết quả: TÀI';
             if (gameResultData.betTai > 0) {
                  let payout = gameResultData.betTai * 2;
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
                 let payout = gameResultData.betXiu * 2;
                 currentBalance += payout;
                 resultText += ` - Bạn thắng ${gameResultData.betXiu.toLocaleString('vi-VN')} đ (Nhận ${payout.toLocaleString('vi-VN')} đ).`;
              } else if (gameResultData.betTai > 0) {
                 resultText += ` - Bạn thua ${gameResultData.betTai.toLocaleString('vi-VN')} đ.`;
              } else {
                 resultText += ' - Bạn chưa đặt cược.';
              }
         } else if (gameResultData.outcome === 'Bộ ba đồng nhất') {
             resultText += ' - Kết quả: Bộ ba đồng nhất!';
             let totalLostInTriples = gameResultData.betTai + gameResultData.betXiu;
             if (totalLostInTriples > 0) {
                 resultText += ` - Bạn thua ${totalLostInTriples.toLocaleString('vi-VN')} đ do Bộ ba đồng nhất.`;
              } else {
                 resultText += ' - Bạn chưa đặt cược.';
              }
         } else {
             resultText += ' - Không xác định kết quả.';
         }
    
    
         updateBalanceDisplay();
         gameResultElement.textContent = resultText;
    
         // *** Cập nhật Lịch sử Phiên và Lịch sử Quả cầu ***
         if (gameResultData !== null) {
             sessionHistory.unshift({
                 outcome: gameResultData.outcome,
                 values: [...gameResultData.diceValues],
                 total: gameResultData.total
             });
    
             // Thêm kết quả vào lịch sử quả cầu (Sử dụng total điểm)
             addHistoryEntry(gameResultData.outcome, gameResultData.diceValues, gameResultData.total); // Truyền thêm total
    
             // Không giới hạn lịch sử phiên theo yêu cầu của bạn
    
             // Render lại lịch sử - quay về trang 1 khi có kết quả mới
             currentPage = 1;
             renderSessionHistory(); // Hàm này chịu trách nhiệm cập nhật Lịch sử Phiên
         }
    
    
         saveGame(); // Lưu trạng thái game của người dùng hiện tại
         sendAIMessage('outcome');
    
         gameResultData = null;
    
         // --- TỰ ĐỘNG BẮT ĐẦU GAME MỚI SAU 3 GIÂY ---
         gameResultElement.textContent += ' | Ván mới bắt đầu sau 3 giây...';
         startGameButton.disabled = true;
         autoStartTimer = setTimeout(() => {
             startGame();
         }, 3000);
    }
    
    
    // Hàm mô phỏng lắc xúc xắc (sinh số ngẫu nhiên từ 1 đến 6)
    function rollDice() {
        return Math.floor(Math.random() * 6) + 1;
    }
    
    // Hàm bật/tắt các nút và input đặt cược
    function setBettingControlsEnabled(enabled) {
        betAmountInput.disabled = !enabled;
        placeBetButtons.forEach(button => button.disabled = !enabled);
        quickBetButtons.forEach(button => button.disabled = !enabled);
    }
    
    
    // Lắng nghe sự kiện click cho các nút "Đặt Cược" (Tài và Xỉu)
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
            saveGame(); // Lưu trạng thái sau khi đặt cược
        });
    });
    
    // Lắng nghe sự kiện click cho các nút đặt cược nhanh
    quickBetButtons.forEach(button => {
        button.addEventListener('click', () => {
            if (!gameInProgress || !currentUser) { // Chỉ cho phép đặt cược nhanh khi game đang chạy VÀ có user
                 return;
            }
    
            const betAmountType = button.dataset.amount;
            let amountToBet = 0;
    
            if (betAmountType === 'all') {
                 amountToBet = currentBalance;
            } else {
                 amountToBet = parseInt(betAmountType);
            }
    
             if (isNaN(amountToBet) || amountToBet <= 0) {
                 return;
             }
    
             if (amountToBet < 1000 && betAmountType !== 'all') {
                 alert('Số tiền cược tối thiểu là 1000 đ.');
                 return;
             }
    
             if (amountToBet > currentBalance) {
                 return;
             }
    
            betAmountInput.value = amountToBet;
            // Tự động đặt cược khi nhấn nút quick bet (Tùy chọn)
            // Bạn có thể thêm logic ở đây để mô phỏng click vào nút "Đặt Cược Tài" hoặc "Đặt Cược Xỉu"
            // Ví dụ: placeBetButtons[0].click(); // Tự động đặt vào Tài sau khi chọn tiền
        });
    });
    
    
    // *** HÀM XỬ LÝ ĐẶT LẠI TIỀN ***
    function resetBalance() {
        if (!currentUser) {
            addChatMessage("[System] Vui lòng đăng nhập để đặt lại tiền.", 'system');
            return;
        }
        currentBalance = INITIAL_BALANCE; // Đặt lại số dư về giá trị ban đầu
        updateBalanceDisplay(); // Cập nhật hiển thị số dư
        // KHÔNG XÓA sessionHistory ở đây theo yêu cầu của bạn
        saveGame(); // Lưu trạng thái (số dư đã reset, lịch sử vẫn giữ nguyên)
    
        addChatMessage("[System] Số dư của " + currentUser + " đã được đặt lại về " + INITIAL_BALANCE.toLocaleString('vi-VN') + " đ.", 'system'); // Thông báo chỉ đặt lại tiền
    }
    
    // *** Lắng nghe sự kiện click cho nút đặt lại tiền ***
    resetBalanceButton.addEventListener('click', resetBalance);
    
    // --- THÊM TRÌNH LẮNG NGHE SỰ KIỆN CHO CHAT INPUT VÀ NÚT GỬI ---
    sendChatMessageButton.addEventListener('click', sendPlayerMessage);
    
    chatMessageInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            sendPlayerMessage();
        }
    });
    
    
    // Lắng nghe sự kiện bắt đầu game mới
    startGameButton.addEventListener('click', startGame);
    
    
    // --- LOGIC XỬ LÝ TÀI KHOẢN NGƯỜI DÙNG ---
    
    // Hàm xử lý khi nhấn nút Đăng nhập / Tải tài khoản
    loginButton.addEventListener('click', () => {
        const desiredUsername = usernameInput.value.trim();
        if (desiredUsername === '') {
            addChatMessage("[System] Vui lòng nhập tên người dùng.", 'system');
            return;
        }
        currentUser = desiredUsername; // Đặt tên người dùng hiện tại
        loadGame(); // Tải dữ liệu game cho người dùng này
        setBettingControlsEnabled(false); // Vô hiệu hóa đặt cược ngay sau khi login, chờ bắt đầu game mới
        startGameButton.disabled = false; // Bật nút bắt đầu game
    });
    
    // Thêm trình lắng nghe sự kiện cho input username khi nhấn Enter
    usernameInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            loginButton.click(); // Tự động click nút login khi nhấn Enter
        }
    });
    
    
    // Khởi tạo trạng thái ban đầu khi tải trang
    // Không gọi loadGame() ngay lúc này, chờ người dùng đăng nhập
    resetGameState(); // Đảm bảo trạng thái game sạch ban đầu
    setBettingControlsEnabled(false); // Vô hiệu hóa các nút đặt cược ban đầu
    startGameButton.disabled = true; // Vô hiệu hóa nút bắt đầu game ban đầu
    currentUserDisplay.textContent = 'Chưa đăng nhập';
    gameResultElement.textContent = 'Nhập tên người dùng và Đăng nhập/Tải tài khoản để bắt đầu.';
    
    
    // --- Start the continuous chat (sẽ chỉ gửi tin nhắn AI khi có currentUser) ---
    startContinuousChat();