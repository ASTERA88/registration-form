// Хранение пользователей в localStorage
const USERS_KEY = 'registration_users';

// Получить всех пользователей
function getUsers() {
    const users = localStorage.getItem(USERS_KEY);
    return users ? JSON.parse(users) : [];
}

// Сохранить пользователя
function saveUser(login, password) {
    const users = getUsers();
    users.push({ login, password });
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

// Проверить, существует ли пользователь
function userExists(login, password = null) {
    const users = getUsers();
    if (password) {
        return users.some(user => user.login === login && user.password === password);
    } else {
        return users.some(user => user.login === login);
    }
}

// Проверить логин на валидность
function validateLogin(login) {
    if (!login.trim()) return 'Логин обязателен';
    const validChars = /^[A-Za-z0-9_-]+$/;
    if (!validChars.test(login)) return 'Только латинские буквы, цифры, _ и -';
    if (userExists(login)) return 'Этот логин уже занят';
    return '';
}

// Проверить пароль
function validatePassword(password) {
    if (!password) return 'Пароль обязателен';
    if (password.length < 6) return 'Пароль должен быть не менее 6 символов';
    return '';
}

// Показать сообщение
function showMessage(text, isError = false) {
    const messageEl = document.getElementById('message');
    messageEl.textContent = text;
    messageEl.className = isError ? 'message error-message' : 'message success';
    setTimeout(() => messageEl.textContent = '', 3000);
}

// Очистить ошибки
function clearErrors() {
    document.querySelectorAll('.error').forEach(el => el.textContent = '');
}

// Показать форму регистрации
function showRegistrationForm() {
    document.getElementById('registrationForm').classList.remove('hidden');
    document.getElementById('loginForm').classList.add('hidden');
    clearErrors();
    document.getElementById('message').textContent = '';
}

// Показать форму входа
function showLoginForm() {
    document.getElementById('loginForm').classList.remove('hidden');
    document.getElementById('registrationForm').classList.add('hidden');
    clearErrors();
    document.getElementById('message').textContent = '';
}

// === ОБРАБОТКА ФОРМЫ РЕГИСТРАЦИИ ===
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
            // Если пользователь уже есть - показываем форму входа
            showMessage('Пользователь уже существует. Войдите в систему.', true);
            showLoginForm();
            document.getElementById('loginInput').value = login;
            document.getElementById('passwordInput').value = password;
        } else {
            // Регистрируем нового пользователя
            saveUser(login, password);
            
            if (saveData) {
                localStorage.setItem('last_login', login);
            }
            
            showMessage(`Пользователь "${login}" успешно зарегистрирован!`);
            document.getElementById('registrationForm').reset();
        }
    }
});

// === ОБРАБОТКА ФОРМЫ ВХОДА ===
document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    clearErrors();
    
    const login = document.getElementById('loginInput').value;
    const password = document.getElementById('passwordInput').value;
    
    if (userExists(login, password)) {
        showMessage(`Добро пожаловать, ${login}! Вход выполнен успешно.`);
        document.getElementById('loginForm').reset();
        // Через 2 секунды возвращаем к регистрации
        setTimeout(() => showRegistrationForm(), 2000);
    } else {
        document.getElementById('loginError2').textContent = 'Неверный логин или пароль';
        showMessage('Ошибка входа. Проверьте данные.', true);
    }
});

// === ПЕРЕКЛЮЧЕНИЕ МЕЖДУ ФОРМАМИ ===
document.getElementById('switchToLogin').addEventListener('click', showLoginForm);
document.getElementById('switchToReg').addEventListener('click', showRegistrationForm);

// === ЗАГРУЗКА СОХРАНЕННОГО ЛОГИНА ===
window.addEventListener('load', function() {
    const savedLogin = localStorage.getItem('last_login');
    if (savedLogin) {
        document.getElementById('login').value = savedLogin;
        document.getElementById('saveData').checked = true;
    }
    
    // Всегда показываем форму регистрации при загрузке
    showRegistrationForm();
});
