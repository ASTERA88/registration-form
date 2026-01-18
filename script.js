// ==================== КОНСТАНТЫ И ХРАНЕНИЕ ====================
const USERS_KEY = 'registration_users';
const AUTH_TOKEN_KEY = 'authToken';
const CURRENT_USER_KEY = 'currentUser';
const REMEMBER_ME_KEY = 'rememberMe';
const SAVED_LOGIN_KEY = 'savedLogin';
const LAST_LOGIN_KEY = 'last_login';

// ==================== РАБОТА С ПОЛЬЗОВАТЕЛЯМИ ====================
function getUsers() {
    const users = localStorage.getItem(USERS_KEY);
    return users ? JSON.parse(users) : [];
}

function saveUser(login, password) {
    const users = getUsers();
    users.push({ login, password });
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function userExists(login, password = null) {
    const users = getUsers();
    if (password) {
        return users.some(user => user.login === login && user.password === password);
    } else {
        return users.some(user => user.login === login);
    }
}

// ==================== ВАЛИДАЦИЯ ====================
function validateLogin(login) {
    if (!login.trim()) return 'Логин обязателен';
    const validChars = /^[A-Za-z0-9_-]+$/;
    if (!validChars.test(login)) return 'Только латинские буквы, цифры, _ и -';
    return '';
}

function validatePassword(password) {
    if (!password) return 'Пароль обязателен';
    if (password.length < 6) return 'Пароль должен быть не менее 6 символов';
    return '';
}

// ==================== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ====================
function showMessage(text, isError = false) {
    const messageEl = document.getElementById('message');
    messageEl.textContent = text;
    messageEl.className = isError ? 'message error-message' : 'message success';
    setTimeout(() => messageEl.textContent = '', 3000);
}

function clearErrors() {
    document.querySelectorAll('.error').forEach(el => el.textContent = '');
}

function showRegistrationForm() {
    document.getElementById('registrationForm').classList.remove('hidden');
    document.getElementById('loginForm').classList.add('hidden');
    clearErrors();
    document.getElementById('message').textContent = '';
}

function showLoginForm() {
    document.getElementById('loginForm').classList.remove('hidden');
    document.getElementById('registrationForm').classList.add('hidden');
    clearErrors();
    document.getElementById('message').textContent = '';
}

// ==================== АВТОАВТОРИЗАЦИЯ ====================
function checkAutoLogin() {
    // Если был выбран "Запомнить меня" - заполняем форму входа
    if (localStorage.getItem(REMEMBER_ME_KEY) === 'true') {
        const savedLogin = localStorage.getItem(SAVED_LOGIN_KEY);
        if (savedLogin) {
            const loginInput = document.getElementById('loginInput');
            const rememberMeCheckbox = document.getElementById('rememberMe');
            if (loginInput && rememberMeCheckbox) {
                loginInput.value = savedLogin;
                rememberMeCheckbox.checked = true;
            }
        }
    }
    
    return false;
}

// ==================== ОБРАБОТКА ФОРМЫ РЕГИСТРАЦИИ ====================
document.getElementById('registrationForm').addEventListener('submit', function(event) {
    event.preventDefault();
    clearErrors();
    
    const login = document.getElementById('login').value;
    const password = document.getElementById('password').value;
    const saveData = document.getElementById('saveData').checked;
    
    const loginError = validateLogin(login);
    const passwordError = validatePassword(password);
    
    if (loginError) document.getElementById('loginError').textContent = loginError;
    if (passwordError) document.getElementById('passwordError').textContent = passwordError;
    
    if (!loginError && !passwordError) {
        if (userExists(login, password)) {
            showMessage('Пользователь уже существует. Войдите в систему.', true);
            showLoginForm();
            document.getElementById('loginInput').value = login;
            document.getElementById('passwordInput').value = password;
        } else {
            saveUser(login, password);
            
            if (saveData) {
                localStorage.setItem(LAST_LOGIN_KEY, login);
            }
            
            showMessage(`Пользователь "${login}" успешно зарегистрирован!`);
            document.getElementById('registrationForm').reset();
        }
    }
});

// ==================== ОБРАБОТКА ФОРМЫ ВХОДА ====================
document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    clearErrors();
    
    const login = document.getElementById('loginInput').value;
    const password = document.getElementById('passwordInput').value;
    const rememberMe = document.getElementById('rememberMe').checked;
    
    if (userExists(login, password)) {
        // Сохраняем данные авторизации
        localStorage.setItem(AUTH_TOKEN_KEY, 'auth_' + Date.now());
        localStorage.setItem(CURRENT_USER_KEY, login);
        
        // Сохраняем настройку "Запомнить меня"
        if (rememberMe) {
            localStorage.setItem(REMEMBER_ME_KEY, 'true');
            localStorage.setItem(SAVED_LOGIN_KEY, login);
        } else {
            localStorage.removeItem(REMEMBER_ME_KEY);
            localStorage.removeItem(SAVED_LOGIN_KEY);
        }
        
        // ПЕРЕНАПРАВЛЕНИЕ НА СТРАНИЦУ СООБЩЕНИЙ
        showMessage('Вход выполнен! Перенаправление...');
        setTimeout(() => {
            window.location.href = 'messages.html';
        }, 1000);
        
    } else {
        document.getElementById('loginError2').textContent = 'Неверный логин или пароль';
        showMessage('Ошибка входа. Проверьте данные.', true);
    }
});

// ==================== ПЕРЕКЛЮЧЕНИЕ ФОРМ ====================
document.getElementById('switchToLogin').addEventListener('click', showLoginForm);
document.getElementById('switchToReg').addEventListener('click', showRegistrationForm);

// ==================== ИНИЦИАЛИЗАЦИЯ ====================
window.addEventListener('load', function() {
    // Загружаем сохраненный логин для регистрации
    const savedLogin = localStorage.getItem(LAST_LOGIN_KEY);
    if (savedLogin) {
        document.getElementById('login').value = savedLogin;
        document.getElementById('saveData').checked = true;
    }
    
    // Проверяем автоавторизацию (только заполняет поля)
    checkAutoLogin();
    
    // ВСЕГДА показываем форму регистрации при загрузке
    showRegistrationForm();
});

// ==================== ФУНКЦИЯ ВЫХОДА ====================
window.logoutUser = function() {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(CURRENT_USER_KEY);
    localStorage.removeItem(REMEMBER_ME_KEY);
    localStorage.removeItem(SAVED_LOGIN_KEY);
    window.location.href = 'index.html';
};
