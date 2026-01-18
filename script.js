document.addEventListener('DOMContentLoaded', function() {
    const USERS_KEY = 'registration_users';
    
    // Получить всех пользователей
    function getUsers() {
        const data = localStorage.getItem(USERS_KEY);
        return data ? JSON.parse(data) : [];
    }
    
    // Сохранить пользователя
    function saveUser(login, password) {
        const users = getUsers();
        users.push({ login, password });
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
    }
    
    // Проверить, занят ли логин (для регистрации)
    function isLoginTaken(login) {
        const users = getUsers();
        return users.some(user => user.login === login);
    }
    
    // Проверить полное совпадение логина и пароля
    function isUserExists(login, password) {
        const users = getUsers();
        return users.some(user => user.login === login && user.password === password);
    }
    
    // Валидация логина
    function validateLogin(login, checkForExisting = true) {
        if (!login.trim()) return 'Логин обязателен';
        if (!/^[A-Za-z0-9_-]+$/.test(login)) return 'Только латинские буквы, цифры, _ и -';
        if (checkForExisting && isLoginTaken(login)) return 'Этот логин уже занят';
        return '';
    }
    
    // Валидация пароля
    function validatePassword(password) {
        if (!password) return 'Пароль обязателен';
        if (password.length < 6) return 'Пароль должен быть не менее 6 символов';
        return '';
    }
    
    // Показать/скрыть формы
    function showForm(formId) {
        document.getElementById('registrationForm').classList.toggle('hidden', formId !== 'register');
        document.getElementById('loginForm').classList.toggle('hidden', formId !== 'login');
    }
    
    // Показать сообщение
    function showMessage(text, isError = false) {
        const msg = document.getElementById('message');
        msg.textContent = text;
        msg.className = isError ? 'message error-message' : 'message success';
        setTimeout(() => msg.textContent = '', 3000);
    }
    
    // Очистить ошибки
    function clearErrors() {
        document.querySelectorAll('.error').forEach(el => el.textContent = '');
    }
    
    // === ИНИЦИАЛИЗАЦИЯ ===
    showForm('register');
    
    // Загрузить сохраненный логин
    const savedLogin = localStorage.getItem('last_login');
    if (savedLogin) {
        document.getElementById('login').value = savedLogin;
        document.getElementById('saveData').checked = true;
    }
    
        // === РЕГИСТРАЦИЯ ===
    document.getElementById('registrationForm').addEventListener('submit', function(e) {
        e.preventDefault();
        clearErrors();
        
        const login = document.getElementById('login').value;
        const password = document.getElementById('password').value;
        const saveData = document.getElementById('saveData').checked;
        
        let hasError = false;
        
        // Проверка логина (без проверки на занятость)
        const loginError = validateLogin(login, false); // false - не проверяем занятость
        if (loginError) {
            document.getElementById('loginError').textContent = loginError;
            hasError = true;
        }
        
        // Проверка пароля
        const passError = validatePassword(password);
        if (passError) {
            document.getElementById('passwordError').textContent = passError;
            hasError = true;
        }
        
        if (!hasError) {
            // СНАЧАЛА проверяем, занят ли логин (любым паролем)
            if (isLoginTaken(login)) {
                // Если логин занят, проверяем - тем же паролем или другим
                if (isUserExists(login, password)) {
                    // Если пользователь уже существует с тем же паролем - форма входа
                    showMessage('Вы уже зарегистрированы. Войдите в систему.', true);
                    showForm('login');
                    document.getElementById('loginInput').value = login;
                    document.getElementById('passwordInput').value = password;
                } else {
                    // Если логин занят, но пароль другой
                    document.getElementById('loginError').textContent = 'Этот логин уже занят';
                    showMessage('Логин уже занят другим пользователем.', true);
                }
            } else {
                // Логин свободен - регистрируем нового пользователя
                saveUser(login, password);
                
                if (saveData) {
                    localStorage.setItem('last_login', login);
                }
                
                showMessage(`Успешно зарегистрирован: ${login}`);
                document.getElementById('registrationForm').reset();
            }
        }
    });
    
    // === ВХОД ===
    document.getElementById('loginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        clearErrors();
        
        const login = document.getElementById('loginInput').value;
        const password = document.getElementById('passwordInput').value;
        
        if (isUserExists(login, password)) {
            showMessage(`Вход выполнен: ${login}`);
            document.getElementById('loginForm').reset();
            setTimeout(() => showForm('register'), 2000);
        } else {
            document.getElementById('loginError2').textContent = 'Неверный логин или пароль';
            showMessage('Ошибка входа', true);
        }
    });
    
    // === ПЕРЕКЛЮЧЕНИЕ ФОРМ ===
    document.getElementById('switchToLogin').addEventListener('click', function() {
        showForm('login');
        clearErrors();
    });
    
    document.getElementById('switchToReg').addEventListener('click', function() {
        showForm('register');
        clearErrors();
    });
    
    console.log('Система готова!');
});
