// Đảm bảo DOM đã sẵn sàng trước khi truy cập các phần tử
document.addEventListener('DOMContentLoaded', () => {

    // ==============================================
    // 1. Minh họa Arrays và Vòng lặp (forEach, for)
    // ==============================================
    const fruitListElement = document.getElementById('fruitList');
    const addFruitBtn = document.getElementById('addFruitBtn');
    const removeLastFruitBtn = document.getElementById('removeLastFruitBtn');
    const fruitFilterInput = document.getElementById('fruitFilterInput');
    const filterFruitsBtn = document.getElementById('filterFruitsBtn');
    const filteredFruitListElement = document.getElementById('filteredFruitList');

    // Khái niệm: Arrays
    let fruits = ['Táo', 'Chuối', 'Cam'];

    // Hàm hiển thị mảng ra danh sách HTML
    function renderFruitList(arr, element) {
        element.innerHTML = ''; // Xóa nội dung cũ
        // Khái niệm: Vòng lặp forEach
        arr.forEach(fruit => { // Duyệt qua từng phần tử trong mảng
            const li = document.createElement('li');
            li.textContent = fruit;
            element.appendChild(li);
        });
         // Minh họa vòng lặp for
         console.log("--- Minh họa Vòng lặp for (duyệt mảng trái cây) ---");
         for (let i = 0; i < arr.length; i++) {
              console.log(`Phần tử ${i}: ${arr[i]}`);
         }
         console.log("--------------------------------------------------");
    }

    // Hiển thị danh sách ban đầu
    renderFruitList(fruits, fruitListElement);
     renderFruitList(fruits, filteredFruitListElement); // Ban đầu hiển thị toàn bộ

    // Khái niệm: Xử lý sự kiện (addEventListener)
    // Thêm trái cây
    addFruitBtn.addEventListener('click', () => {
        // Khái niệm: Arrays (push - thêm phần tử vào cuối)
        fruits.push('Xoài');
        renderFruitList(fruits, fruitListElement);
         renderFruitList(fruits, filteredFruitListElement); // Cập nhật cả danh sách lọc
    });

    // Xóa trái cây cuối cùng
    removeLastFruitBtn.addEventListener('click', () => {
        // Khái niệm: Arrays (pop - xóa phần tử cuối)
        if (fruits.length > 0) {
            fruits.pop();
            renderFruitList(fruits, fruitListElement);
             renderFruitList(fruits, filteredFruitListElement); // Cập nhật cả danh sách lọc
        }
    });

     // Lọc trái cây
     filterFruitsBtn.addEventListener('click', () => {
         const filterText = fruitFilterInput.value.trim().toLowerCase();
         // Khái niệm: Arrays (filter - tạo mảng mới dựa trên điều kiện)
         // Khái niệm: String methods (toLowerCase, includes)
         const filteredFruits = fruits.filter(fruit =>
             fruit.toLowerCase().includes(filterText)
         );
         renderFruitList(filteredFruits, filteredFruitListElement);
     });

     // Minh họa vòng lặp while (ít dùng cho duyệt mảng trực tiếp)
     function demonstrateWhileLoop() {
          console.log("\n--- Minh họa Vòng lặp while ---");
          let count = 0;
          while (count < 3) {
               console.log("While count:", count);
               count++; // Quan trọng: Phải tăng biến điều kiện
          }
          console.log("------------------------------");
     }
     // Gọi hàm minh họa while (chỉ in ra console)
     demonstrateWhileLoop();


    // ==============================================
    // 2. Minh họa Objects
    // ==============================================
    const personInfoElement = document.getElementById('personInfo');
    const updateAgeBtn = document.getElementById('updateAgeBtn');

    // Khái niệm: Objects
    let person = {
        name: 'Nguyễn Văn A',
        age: 30,
        city: 'Hà Nội'
        // Khái niệm: Object có thể chứa hàm (method)
        // greet: function() { console.log("Xin chào, tôi là " + this.name); }
    };

    // Hàm hiển thị thông tin object
    function renderPersonInfo() {
        // Khái niệm: Truy cập thuộc tính Object (.)
        personInfoElement.innerHTML = `
            <p><strong>Tên:</strong> ${person.name}</p>
            <p><strong>Tuổi:</strong> ${person.age}</p>
            <p><strong>Thành phố:</strong> ${person.city}</p>
        `;
    }

    // Hiển thị thông tin ban đầu
    renderPersonInfo();

    // Cập nhật tuổi khi bấm nút
    updateAgeBtn.addEventListener('click', () => {
        // Khái niệm: Cập nhật thuộc tính Object
        person.age++; // Tăng tuổi lên 1
        renderPersonInfo(); // Cập nhật hiển thị
    });


    // ==============================================
    // 3. Minh họa Classes và Lập trình hướng đối tượng
    // ==============================================
    const carMakeInput = document.getElementById('carMakeInput');
    const carModelInput = document.getElementById('carModelInput');
    const carYearInput = document.getElementById('carYearInput');
    const createCarBtn = document.getElementById('createCarBtn');
    const carInfoElement = document.getElementById('carInfo');
     const carDriveBtn = document.getElementById('carDriveBtn');

    // Khái niệm: Classes
    // Định nghĩa một Class tên là Car
    class Car {
        // Constructor: Hàm khởi tạo đối tượng từ Class
        constructor(make, model, year) {
            // Thuộc tính (Properties) của đối tượng
            this.make = make;
            this.model = model;
            this.year = year;
            this.speed = 0; // Tốc độ ban đầu
        }

        // Phương thức (Methods) của đối tượng
        displayInfo() {
             return `Xe: ${this.make} ${this.model} (${this.year})`;
        }

        accelerate(amount) {
             this.speed += amount;
             console.log(`${this.make} ${this.model} đang tăng tốc. Tốc độ hiện tại: ${this.speed} km/h`);
        }

        brake(amount) {
             this.speed -= amount;
             if (this.speed < 0) this.speed = 0;
             console.log(`${this.make} ${this.model} đang giảm tốc. Tốc độ hiện tại: ${this.speed} km/h`);
        }
    }

    let myCar = null; // Biến lưu trữ đối tượng xe

    // Tạo đối tượng Car khi bấm nút
    createCarBtn.addEventListener('click', () => {
        const make = carMakeInput.value.trim();
        const model = carModelInput.value.trim();
        const year = parseInt(carYearInput.value); // Khái niệm: Chuyển đổi kiểu (parseInt)

        if (make && model && !isNaN(year)) {
            // Khái niệm: Tạo một Instance (đối tượng) từ Class
            myCar = new Car(make, model, year);
            carInfoElement.textContent = myCar.displayInfo(); // Gọi phương thức của đối tượng
             carDriveBtn.style.display = 'inline-block'; // Hiển thị nút lái xe
            console.log("--- Đối tượng Car đã tạo ---");
            console.log(myCar);
            console.log("----------------------------");

             // Xóa input sau khi tạo
             carMakeInput.value = '';
             carModelInput.value = '';
             carYearInput.value = '';

        } else {
            carInfoElement.textContent = 'Vui lòng nhập đầy đủ thông tin xe hợp lệ.';
             carDriveBtn.style.display = 'none';
             myCar = null;
        }
    });

     // Gọi phương thức của đối tượng Car khi bấm nút Lái xe
     carDriveBtn.addEventListener('click', () => {
          if (myCar) {
               myCar.accelerate(50); // Gọi phương thức accelerate
               myCar.brake(20);     // Gọi phương thức brake
          }
     });


    // ==============================================
    // 4. Minh họa Prototypes
    //    Class là cú pháp "syntactic sugar" trên cơ chế Prototype.
    //    Minh họa cách làm việc với prototype trực tiếp.
    // ==============================================
    const animalNameInput = document.getElementById('animalNameInput');
    const createAnimalBtn = document.getElementById('createAnimalBtn');
    const animalActionsElement = document.getElementById('animalActions');
    const animalOutputElement = document.getElementById('animalOutput');

    // Khái niệm: Hàm Constructor (kiểu cũ)
    function Animal(name) {
        this.name = name; // Thuộc tính của mỗi instance
    }

    // Khái niệm: Thêm phương thức vào Prototype
    // Phương thức này sẽ được CHIA SẺ giữa tất cả các instance của Animal
    Animal.prototype.speak = function() {
        // console.log(`${this.name} tạo ra âm thanh.`);
        animalOutputElement.textContent = `${this.name} tạo ra âm thanh.`;
    };

     Animal.prototype.walk = function() {
          // console.log(`${this.name} đang đi.`);
           animalOutputElement.textContent = `${this.name} đang đi.`;
     };


    let myAnimal = null;

    createAnimalBtn.addEventListener('click', () => {
        const name = animalNameInput.value.trim();
        if (name) {
            // Khái niệm: Tạo một Instance từ Constructor
            myAnimal = new Animal(name);
            animalOutputElement.textContent = `"${myAnimal.name}" đã được tạo.`;
            animalActionsElement.innerHTML = `
                 <button id="animalSpeakBtn">Kêu</button>
                 <button id="animalWalkBtn">Đi</button>
            `;
             console.log("--- Đối tượng Animal (Prototype) ---");
             console.log(myAnimal);
             // Kiểm tra prototype chain trong console
             console.log("myAnimal.__proto__ === Animal.prototype:", myAnimal.__proto__ === Animal.prototype);
             console.log("Animal.prototype (chứa speak, walk):", Animal.prototype);
             console.log("------------------------------------");


             // Gắn sự kiện cho các nút action (sử dụng lại logic event delegation nếu cần,
             // nhưng ví dụ đơn giản này gắn trực tiếp vào nút vừa tạo)
             document.getElementById('animalSpeakBtn').addEventListener('click', () => {
                  if(myAnimal) myAnimal.speak(); // Gọi phương thức từ prototype
             });
              document.getElementById('animalWalkBtn').addEventListener('click', () => {
                   if(myAnimal) myAnimal.walk(); // Gọi phương thức từ prototype
              });

             animalNameInput.value = ''; // Xóa input
        } else {
             animalOutputElement.textContent = 'Vui lòng nhập tên con vật.';
             animalActionsElement.innerHTML = '';
             myAnimal = null;
        }
    });


    // ==============================================
    // 5. Minh họa try...catch (Xử lý Lỗi)
    // ==============================================
    const num1Input = document.getElementById('num1Input');
    const num2Input = document.getElementById('num2Input');
    const divideBtn = document.getElementById('divideBtn');
    const divisionResultElement = document.getElementById('divisionResult');

    divideBtn.addEventListener('click', () => {
        const num1 = parseFloat(num1Input.value); // Khái niệm: Chuyển đổi kiểu
        const num2 = parseFloat(num2Input.value);

        // Khái niệm: try...catch block
        try {
            // Code có khả năng ném lỗi sẽ đặt trong khối 'try'
            if (isNaN(num1) || isNaN(num2)) {
                 // Ném ra một lỗi nếu input không phải số
                 throw new Error("Vui lòng nhập số hợp lệ.");
            }

            if (num2 === 0) {
                // Ném ra một lỗi tùy chỉnh khi chia cho 0
                throw new Error("Không thể chia cho số 0.");
            }

            // Thực hiện phép tính nếu không có lỗi
            const result = num1 / num2;

            // Cập nhật kết quả nếu thành công
            divisionResultElement.style.color = 'green';
            divisionResultElement.textContent = `Kết quả: ${result}`;

        } catch (error) {
            // Khái niệm: Khối 'catch' sẽ chạy nếu có lỗi xảy ra trong khối 'try'
            // Biến 'error' chứa đối tượng lỗi
            divisionResultElement.style.color = 'red';
            divisionResultElement.textContent = `Lỗi: ${error.message}`; // Hiển thị thông báo lỗi
            console.error("Đã xảy ra lỗi chia:", error); // Log lỗi chi tiết ra console
        } finally {
             // Khái niệm: Khối 'finally' (tùy chọn) luôn chạy sau 'try' hoặc 'catch',
             // bất kể có lỗi hay không. Thường dùng để dọn dẹp tài nguyên.
             console.log("Hoàn thành thao tác chia.");
        }
    });


    // ==============================================
    // 6. Minh họa Web Storage (localStorage)
    // ==============================================
    const localStorageInput = document.getElementById('localStorageInput');
    const saveToStorageBtn = document.getElementById('saveToStorageBtn');
    const loadFromStorageBtn = document.getElementById('loadFromStorageBtn');
    const storageOutputElement = document.getElementById('storageOutput');

    const storageKey = 'mySimpleValue'; // Key để lưu/tải dữ liệu

    // Lưu dữ liệu vào localStorage
    saveToStorageBtn.addEventListener('click', () => {
        const valueToSave = localStorageInput.value;
        // Khái niệm: localStorage.setItem(key, value)
        // value phải là chuỗi. Nếu muốn lưu object/array, cần JSON.stringify
        try {
             localStorage.setItem(storageKey, valueToSave);
             console.log(`Đã lưu "${valueToSave}" vào localStorage với key "${storageKey}".`);
             storageOutputElement.style.color = 'green';
             storageOutputElement.textContent = `Đã lưu: "${valueToSave}"`;
        } catch (e) {
             console.error("Lỗi khi lưu vào localStorage:", e);
             storageOutputElement.style.color = 'red';
             storageOutputElement.textContent = `Lỗi khi lưu: ${e.message}`;
        }
    });

    // Tải dữ liệu từ localStorage
    loadFromStorageBtn.addEventListener('click', () => {
        // Khái niệm: localStorage.getItem(key)
        const loadedValue = localStorage.getItem(storageKey);

        if (loadedValue !== null) { // getItem trả về null nếu key không tồn tại
            storageOutputElement.style.color = 'black';
            storageOutputElement.textContent = `Giá trị đã tải: "${loadedValue}"`;
            localStorageInput.value = loadedValue; // Đặt giá trị vào input
            console.log(`Đã tải "${loadedValue}" từ localStorage.`);
        } else {
            storageOutputElement.style.color = 'orange';
            storageOutputElement.textContent = 'Không tìm thấy giá trị đã lưu.';
            localStorageInput.value = '';
            console.log(`Key "${storageKey}" không tồn tại trong localStorage.`);
        }
    });

     // Tải dữ liệu khi trang vừa load (tự động)
     // Simulate loading on page load
     const initialLoadedValue = localStorage.getItem(storageKey);
      if (initialLoadedValue !== null) {
           storageOutputElement.style.color = 'black';
           storageOutputElement.textContent = `Giá trị đã tải khi trang load: "${initialLoadedValue}"`;
           localStorageInput.value = initialLoadedValue;
           console.log(`Đã tải "${initialLoadedValue}" từ localStorage khi trang load.`);
      } else {
          storageOutputElement.style.color = 'orange';
          storageOutputElement.textContent = 'Không tìm thấy giá trị đã lưu khi trang load.';
          localStorageInput.value = '';
          console.log(`Key "${storageKey}" không tồn tại trong localStorage khi trang load.`);
      }

     // sessionStorage hoạt động tương tự nhưng dữ liệu chỉ tồn tại trong phiên làm việc của tab/browser.
     // sessionStorage.setItem('sessionKey', 'sessionValue');
     // const sessionValue = sessionStorage.getItem('sessionKey');


    // ==============================================
    // 7. Minh họa Fetch API, Promises, async/await (Bất đồng bộ)
    // ==============================================
    const fetchDataBtn = document.getElementById('fetchDataBtn');
    const fetchStatusElement = document.getElementById('fetchStatus');
    const fetchResultElement = document.getElementById('fetchResult');

    // Khái niệm: Hàm async
    async function fetchDataFromApi() {
        const apiUrl = 'https://jsonplaceholder.typicode.com/posts/1'; // API mẫu công khai

        fetchStatusElement.textContent = 'Trạng thái: Đang tải...';
        fetchResultElement.textContent = ''; // Xóa kết quả cũ
         fetchResultElement.style.color = 'black'; // Reset màu

        // Khái niệm: try...catch (bắt lỗi trong async/await)
        try {
            // Khái niệm: await fetch(url) - Chờ request mạng hoàn thành. Trả về Response object (Promise).
            const response = await fetch(apiUrl);

            if (!response.ok) { // Khái niệm: Kiểm tra Response.ok (status code 200-299)
                // Nếu Response không OK, ném lỗi HTTP.
                throw new Error(`Lỗi HTTP! Trạng thái: ${response.status}`);
            }

            // Khái niệm: await response.json() - Chờ parse body thành JSON (Promise).
            const data = await response.json();

            // Cập nhật trạng thái và kết quả sau khi thành công
            fetchStatusElement.textContent = 'Trạng thái: Tải thành công!';
            fetchResultElement.textContent = JSON.stringify(data, null, 2); // Hiển thị JSON có format
            console.log("Dữ liệu đã tải (async/await):", data);

        } catch (error) {
            // Bắt lỗi từ fetch, response.json(), hoặc lỗi HTTP ném ra
            fetchStatusElement.textContent = 'Trạng thái: Tải thất bại!';
            fetchResultElement.textContent = `Lỗi: ${error.message}`;
            fetchResultElement.style.color = 'red';
            console.error("Lỗi Fetch (async/await):", error);
        } finally {
            // Khối finally chạy sau try hoặc catch
            console.log("Hoàn thành thao tác fetch.");
        }
    }

     // Khái niệm: Promises (Minh họa thay thế cho async/await, hoặc dùng kết hợp)
     function fetchDataWithPromises() {
          console.log("\n--- Minh họa Fetch với Promise chain (.then/.catch) ---");
           const apiUrl = 'https://jsonplaceholder.typicode.com/todos/1';
          fetch(apiUrl)
               .then(response => {
                    if (!response.ok) {
                         throw new Error(`Lỗi HTTP (Promise)! Trạng thái: ${response.status}`);
                    }
                    return response.json(); // Trả về Promise khác
               })
               .then(data => {
                    console.log("Dữ liệu đã tải (Promise chain):", data);
               })
               .catch(error => {
                    console.error("Lỗi Fetch (Promise chain):", error);
               })
               .finally(() => {
                    console.log("Fetch (Promise chain) kết thúc.");
               });
           console.log("------------------------------------------------------");
     }


    fetchDataBtn.addEventListener('click', () => {
        fetchDataFromApi(); // Gọi hàm async khi bấm nút
         fetchDataWithPromises(); // Gọi hàm promise (chỉ in ra console)
    });


    // ==============================================
    // 8. Minh họa Scope (Phạm vi Biến)
    // ==============================================
    const checkGlobalScopeBtn = document.getElementById('checkGlobalScopeBtn');
    const checkFunctionScopeBtn = document.getElementById('checkFunctionScopeBtn');
    const checkBlockScopeBtn = document.getElementById('checkBlockScopeBtn');
    const scopeOutputElement = document.getElementById('scopeOutput');

     let globalLet = "Tôi là global let"; // Global scope (trong ngữ cảnh file này)
     var globalVar = "Tôi là global var"; // Global scope (trong ngữ cảnh file này)
     const globalConst = "Tôi là global const"; // Global scope (trong ngữ cảnh file này)

    // Hàm minh họa function scope
    function functionScopeExample() {
        let functionLet = "Tôi là function let"; // Function scope
        var functionVar = "Tôi là function var"; // Function scope
        const functionConst = "Tôi là function const"; // Function scope

        // Có thể truy cập các biến global
        let output = `Trong functionScopeExample:\n`;
        output += ` - Global let: ${typeof globalLet !== 'undefined' ? globalLet : 'Không thể truy cập!'}\n`;
        output += ` - Global var: ${typeof globalVar !== 'undefined' ? globalVar : 'Không thể truy cập!'}\n`;
        output += ` - Global const: ${typeof globalConst !== 'undefined' ? globalConst : 'Không thể truy cập!'}\n`;

        // Có thể truy cập các biến trong hàm này
         output += ` - Function let: ${typeof functionLet !== 'undefined' ? functionLet : 'Không thể truy cập!'}\n`;
         output += ` - Function var: ${typeof functionVar !== 'undefined' ? functionVar : 'Không thể truy cập!'}\n`;
         output += ` - Function const: ${typeof functionConst !== 'undefined' ? functionConst : 'Không thể truy cập!'}\n`;


        // Minh họa block scope bên trong hàm
        if (true) {
            let blockLet = "Tôi là block let (trong IF)"; // Block scope
            var blockVar = "Tôi là block var (trong IF)"; // Vẫn là function scope!
            const blockConst = "Tôi là block const (trong IF)"; // Block scope

             output += ` - Block let (trong IF): ${typeof blockLet !== 'undefined' ? blockLet : 'Không thể truy cập!'}\n`;
             output += ` - Block var (trong IF): ${typeof blockVar !== 'undefined' ? blockVar : 'Không thể truy cập!'}\n`; // Có thể truy cập vì var không có block scope
             output += ` - Block const (trong IF): ${typeof blockConst !== 'undefined' ? blockConst : 'Không thể truy cập!'}\n`;

        }
        // console.log(blockLet); // Lỗi! let không ra khỏi block
        // console.log(blockConst); // Lỗi! const không ra khỏi block
        // console.log(blockVar); // Có thể truy cập! var không tuân theo block scope

        output += ` - Block var (ngoài IF): ${typeof blockVar !== 'undefined' ? blockVar : 'Không thể truy cập!'}\n`; // Chứng minh var không có block scope

         scopeOutputElement.textContent = output;
         console.log("--- Kết quả kiểm tra Scope (trong function) ---");
         console.log(output);
         console.log("---------------------------------------------");
    }

     // Minh họa block scope (bên ngoài hàm)
     function blockScopeExample() {
         let output = "Trong Block scope (ngoài hàm):\n";
         if (true) {
             let outerBlockLet = "Let outer block";
             const outerBlockConst = "Const outer block";
             var outerBlockVar = "Var outer block"; // Vẫn là global scope trong trường hợp này!

              output += ` - Outer Block let (trong IF): ${typeof outerBlockLet !== 'undefined' ? outerBlockLet : 'Không thể truy cập!'}\n`;
              output += ` - Outer Block const (trong IF): ${typeof outerBlockConst !== 'undefined' ? outerBlockConst : 'Không thể truy cập!'}\n`;
              output += ` - Outer Block var (trong IF): ${typeof outerBlockVar !== 'undefined' ? outerBlockVar : 'Không thể truy cập!'}\n`;

             if (true) {
                 let innerBlockLet = "Let inner block"; // Scope chỉ trong block IF con này
                 output += ` - Inner Block let (trong IF con): ${typeof innerBlockLet !== 'undefined' ? innerBlockLet : 'Không thể truy cập!'}\n`;
             }
             // console.log(innerBlockLet); // Lỗi!
         }

          // console.log(outerBlockLet); // Lỗi!
          // console.log(outerBlockConst); // Lỗi!
          // console.log(outerBlockVar); // Có thể truy cập! (trong trường hợp này nó là global)

         output += ` - Outer Block var (ngoài IF): ${typeof outerBlockVar !== 'undefined' ? outerBlockVar : 'Không thể truy cập!'}\n`;


         scopeOutputElement.textContent = output;
          console.log("--- Kết quả kiểm tra Scope (block ngoài hàm) ---");
          console.log(output);
          console.log("---------------------------------------------");

     }


    checkGlobalScopeBtn.addEventListener('click', () => {
         let output = "Trong Global Scope:\n";
         output += ` - Global let: ${typeof globalLet !== 'undefined' ? globalLet : 'Không thể truy cập!'}\n`;
         output += ` - Global var: ${typeof globalVar !== 'undefined' ? globalVar : 'Không thể truy cập!'}\n`;
         output += ` - Global const: ${typeof globalConst !== 'undefined' ? globalConst : 'Không thể truy cập!'}\n`;
          // Các biến trong hàm hoặc block khác không truy cập được từ đây
         output += ` - Function var (từ hàm khác): ${typeof functionVar !== 'undefined' ? functionVar : 'Không thể truy cập!'}\n`; // functionVar không tồn tại ở đây
         output += ` - Block let (từ block khác): ${typeof blockLet !== 'undefined' ? blockLet : 'Không thể truy cập!'}\n`; // blockLet không tồn tại ở đây

         scopeOutputElement.textContent = output;
          console.log("--- Kết quả kiểm tra Scope (global) ---");
          console.log(output);
          console.log("------------------------------------");
    });

    checkFunctionScopeBtn.addEventListener('click', () => {
        functionScopeExample(); // Chạy hàm minh họa scope trong hàm
    });

     checkBlockScopeBtn.addEventListener('click', () => {
         blockScopeExample(); // Chạy hàm minh họa block scope
     });

     // Khái niệm Modules được giải thích bằng text trong HTML và comment trong code.
     // Không thể minh họa import/export trong một file script đơn lẻ.


    // ==============================================
    // Tóm tắt chung các khái niệm đã dùng
    // ==============================================
     console.log("\n--- Tóm tắt các khái niệm đã dùng/minh họa ---");
     console.log("- DOM Manipulation (getElement, add/remove element, textContent, innerHTML, dataset, etc.)");
     console.log("- Xử lý sự kiện (addEventListener)");
     console.log("- Arrays (Khai báo, push, pop, filter, forEach)");
     console.log("- Objects (Khai báo, truy cập/cập nhật thuộc tính)");
     console.log("- Vòng lặp (forEach, for, while - minh họa)");
     console.log("- Classes (Khai báo Class, Constructor, Properties, Methods, tạo Instance)");
     console.log("- Prototypes (Hàm Constructor kiểu cũ, thêm phương thức vào Prototype, tạo Instance, prototype chain - minh họa)");
     console.log("- try...catch...finally (Xử lý lỗi, ném lỗi tùy chỉnh)");
     console.log("- Web Storage (localStorage.setItem/getItem)");
     console.log("- JSON.stringify/parse (Khi cần lưu Object/Array vào localStorage - không dùng trực tiếp trong ví dụ localStorage đơn giản này, nhưng đã giải thích)");
     console.log("- Chuyển đổi kiểu (parseFloat, parseInt)");
     console.log("- Kiểm tra giá trị (isNaN)");
     console.log("- Fetch API (Gọi request mạng)");
     console.log("- Promises (.then, .catch, .finally)");
     console.log("- async/await (Cú pháp cho Promise)");
     console.log("- Scope (Global, Function, Block - minh họa với var, let, const)");
     console.log("- Modules (Giải thích khái niệm)");
     console.log("\nKiểm tra lại trang web và Console (F12) để xem tương tác và output chi tiết!");

}); // Kết thúc DOMContentLoaded