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

// Проверить, существует ли логин
function isLoginTaken(login) {
    const users = getUsers();
    return users.some(user => user.login === login);
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
    
    // 3. Проверка на существование
    if (isLoginTaken(login)) {
        return 'Этот логин уже занят';
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
    // Очищаем все красные ошибки
    document.querySelectorAll('.error').forEach(el => {
        el.textContent = '';
    });
}

// === ПЕРЕКЛЮЧЕНИЕ МЕЖДУ ФОРМАМИ ===

// Кнопка "Уже есть аккаунт? Войти"
document.getElementById('switchToLogin').addEventListener('click', function() {
    document.getElementById('registrationForm').classList.add('hidden');
    document.getElementById('loginForm').classList.remove('hidden');
    clearErrors();
    document.getElementById('message').textContent = '';
});

// Кнопка "Нет аккаунта? Зарегистрироваться"
document.getElementById('switchToReg').addEventListener('click', function() {
    document.getElementById('loginForm').classList.add('hidden');
    document.getElementById('registrationForm').classList.remove('hidden');
    clearErrors();
    document.getElementById('message').textContent = '';
});

// === ОБРАБОТКА ФОРМЫ РЕГИСТРАЦИИ ===
document.getElementById('registrationForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Отменяем стандартную отправку
    
    clearErrors();
    
    // Получаем значения полей
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
    
    // Если ошибок нет - регистрируем
    if (!loginError && !passwordError) {
        // Сохраняем пользователя
        saveUser(login, password);
        
        // Сохраняем логин, если отмечена галочка
        if (saveData) {
            localStorage.setItem('last_login', login);
        }
        
        // Показываем успех
        showMessage(`Пользователь "${login}" успешно зарегистрирован!`);
        
        // Очищаем форму
        document.getElementById('registrationForm').reset();
        clearErrors();
        
        // Автоматически переключаем на форму входа
        setTimeout(() => {
            document.getElementById('registrationForm').classList.add('hidden');
            document.getElementById('loginForm').classList.remove('hidden');
        }, 1500);
    }
});

// === ОБРАБОТКА ФОРМЫ ВХОДА ===
document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    clearErrors();
    
    const login = document.getElementById('loginInput').value;
    const password = document.getElementById('passwordInput').value;
    
    // Ищем пользователя
    const users = getUsers();
    const user = users.find(u => u.login === login && u.password === password);
    
    if (user) {
        // Успешный вход
        showMessage(`Добро пожаловать, ${login}!`);
        document.getElementById('loginForm').reset();
        
        // Через 2 секунды показываем регистрацию
        setTimeout(() => {
            document.getElementById('loginForm').classList.add('hidden');
            document.getElementById('registrationForm').classList.remove('hidden');
        }, 2000);
    } else {
        // Ошибка входа
        document.getElementById('loginError2').textContent = 'Неверный логин или пароль';
        showMessage('Ошибка входа. Проверьте данные.', true);
    }
});

// === ЗАГРУЗКА СОХРАНЕННОГО ЛОГИНА ===
window.addEventListener('load', function() {
    const savedLogin = localStorage.getItem('last_login');
    if (savedLogin) {
        document.getElementById('login').value = savedLogin;
        document.getElementById('saveData').checked = true;
    }
    
    console.log('Форма регистрации готова к работе!');
});
