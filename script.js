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
        // Проверка логина И пароля
        return users.some(user => user.login === login && user.password === password);
    } else {
        // Проверка только логина
        return users.some(user => user.login === login);
    }
}

// Проверить логин на валидность
function validateLogin(login) {
    // 1. Не пустой
    if (!login.trim()) {
        return 'Логин обязателен';
    }
    
    // 2. Только латинские буквы, цифры, _ и -
    const validChars = /^[A-Za-z0-9_-]+$/;
    if (!validChars.test(login)) {
        return 'Только латинские буквы, цифры, _ и -';
    }
    
    return ''; // Ошибок нет
}

// Проверить пароль
function validatePassword(password) {
    // 1. Не пустой
    if (!password) {
        return 'Пароль обязателен';
    }
    
    // 2. Не менее 6 символов
    if (password.length < 6) {
        return 'Пароль должен быть не менее 6 символов';
    }
    
    return ''; // Ошибок нет
}

// Показать сообщение
function showMessage(text, isError = false) {
    const messageEl = document.getElementById('message');
    messageEl.textContent = text;
    messageEl.className = isError ? 'message error-message' : 'message success';
    
    // Автоочистка через 3 секунды
    setTimeout(() => {
        messageEl.textContent = '';
    }, 3000);
}

// Очистить ошибки
function clearErrors() {
    document.querySelectorAll('.error').forEach(el => {
        el.textContent = '';
    });
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
    
    // Проверяем логин
    const loginError = validateLogin(login);
    if (loginError) {
        document.getElementById('loginError').textContent = loginError;
    }
    
    // Проверяем пароль
    const passwordError = validatePassword(password);
    if (passwordError) {
        document.getElementById('passwordError').textContent = passwordError;
    }
    
    // Если ошибок нет
    if (!loginError && !passwordError) {
        // Проверяем, существует ли уже пользователь
        if (userExists(login, password)) {
            // Если пользователь уже есть - показываем форму входа
            showMessage('Пользователь уже существует. Войдите в систему.', true);
            showLoginForm();
            // Заполняем поля формы входа
            document.getElementById('loginInput').value = login;
            document.getElementById('passwordInput').value = password;
        } else {
            // Если пользователя нет - регистрируем
            saveUser(login, password);
            
            // Сохраняем логин, если отмечена галочка
            if (saveData) {
                localStorage.setItem('last_login', login);
            }
            
            // Показываем успех
            showMessage(`Пользователь "${login}" успешно зарегистрирован!`);
            
            // Очищаем форму
            document.getElementById('registrationForm').reset();
            
            // Остаемся на форме регистрации
        }
    }
});

// === ОБРАБОТКА ФОРМЫ ВХОДА ===
document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    clearErrors();
    
    const login = document.getElementById('loginInput').value;
    const password = document.getElementById('passwordInput').value;
    
    // Проверяем существование пользователя с такими данными
    if (userExists(login, password)) {
        // Успешный вход
        showMessage(`Добро пожаловать, ${login}! Вход выполнен успешно.`);
        document.getElementById('loginForm').reset();
        
        // Через 2 секунды возвращаем к регистрации
        setTimeout(() => {
            showRegistrationForm();
        }, 2000);
    } else {
        // Ошибка входа
        document.getElementById('loginError2').textContent = 'Неверный логин или пароль';
        showMessage('Ошибка входа. Проверьте данные.', true);
    }
});

// === ПЕРЕКЛЮЧЕНИЕ МЕЖДУ ФОРМАМИ (ручное) ===
// Кнопка "Уже есть аккаунт? Войти"
document.getElementById('switchToLogin').addEventListener('click', function() {
    showLoginForm();
});

// Кнопка "Нет аккаунта? Зарегистрироваться"
document.getElementById('switchToReg').addEventListener('click', function() {
    showRegistrationForm();
});

// === ЗАГРУЗКА СОХРАНЕННОГО ЛОГИНА ===
window.addEventListener('load', function() {
    const savedLogin = localStorage.getItem('last_login');
    if (savedLogin) {
        document.getElementById('login').value = savedLogin;
        document.getElementById('saveData').checked = true;
    }
    
    // Всегда показываем форму регистрации при загрузке
    showRegistrationForm();
    
    console.log('Форма регистрации готова к работе!');
});
