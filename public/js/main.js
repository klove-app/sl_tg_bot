// Функция для проверки загрузки DOM и всех элементов
function checkElements() {
    console.log('Проверка элементов:');
    const modal = document.getElementById('authModal');
    console.log('Модальное окно:', modal);
    const loginLink = document.querySelector('a.nav-link[href="#"]');
    console.log('Ссылка входа:', loginLink);
}

// Глобальные функции для работы с модальным окном
function openAuthModal() {
    console.log('Вызвана функция openAuthModal');
    const modal = document.getElementById('authModal');
    console.log('Найденное модальное окно:', modal);
    if (modal) {
        modal.style.display = 'block';
        modal.style.visibility = 'visible';
        modal.style.opacity = '1';
        console.log('Модальное окно открыто');
    } else {
        console.error('Модальное окно не найдено!');
    }
}

function closeAuthModal() {
    const modal = document.getElementById('authModal');
    if (modal) {
        modal.style.display = 'none';
        modal.style.visibility = 'hidden';
        modal.style.opacity = '0';
    }
}

// Функции для работы с формами авторизации
function switchTab(tabName) {
    console.log('Переключение на вкладку:', tabName);
    
    // Обновляем активную вкладку
    document.querySelectorAll('.auth-tab').forEach(tab => {
        const isActive = tab.dataset.tab === tabName;
        tab.classList.toggle('active', isActive);
        console.log('Вкладка:', tab.dataset.tab, isActive ? 'активна' : 'неактивна');
    });

    // Показываем соответствующую форму
    document.querySelectorAll('.auth-form').forEach(form => {
        const isActive = form.id === `${tabName}Form`;
        form.style.display = isActive ? 'block' : 'none';
        if (isActive) {
            form.classList.add('active');
        } else {
            form.classList.remove('active');
        }
        console.log('Форма:', form.id, isActive ? 'показана' : 'скрыта');
    });
}

function showError(formId, message) {
    console.log('Показ ошибки для формы:', formId, message);
    const errorElement = document.getElementById(`${formId}Error`);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
}

function showSuccess(formId, message) {
    console.log('Показ успеха для формы:', formId, message);
    const errorElement = document.getElementById(`${formId}Error`);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.color = '#10B981';
        errorElement.style.display = 'block';
    }
}

function clearError(formId) {
    console.log('Очистка ошибок для формы:', formId);
    const errorElement = document.getElementById(`${formId}Error`);
    if (errorElement) {
        errorElement.textContent = '';
        errorElement.style.display = 'none';
        errorElement.style.color = '#dc3545';
    }
}

function updateUserInterface(user) {
    console.log('Обновление интерфейса для пользователя:', user);
    const loginButton = document.getElementById('loginButton');
    if (loginButton && user) {
        loginButton.textContent = user.email;
        loginButton.href = '/dashboard';
        loginButton.removeEventListener('click', openAuthModal);
    }
}

// Инициализация после загрузки DOM
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM загружен, инициализация скриптов...');
    
    // Проверяем наличие элементов
    checkElements();

    // Добавляем обработчики для вкладок
    document.querySelectorAll('.auth-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            console.log('Клик по вкладке:', tab.dataset.tab);
            switchTab(tab.dataset.tab);
        });
    });

    // Обработчик формы входа
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            clearError('login');
            
            const submitButton = loginForm.querySelector('button[type="submit"]');
            submitButton.disabled = true;
            
            try {
                const email = document.getElementById('loginEmail').value;
                const password = document.getElementById('loginPassword').value;

                console.log('Попытка входа для:', email);
                const response = await login(email, password);
                
                if (response.success) {
                    showSuccess('login', 'Вход выполнен успешно!');
                    updateUserInterface(response.user);
                    setTimeout(() => {
                        closeAuthModal();
                    }, 1000);
                } else {
                    showError('login', response.error);
                }
            } catch (error) {
                showError('login', 'Произошла ошибка при входе');
            } finally {
                submitButton.disabled = false;
            }
        });
    }

    // Обработчик формы регистрации
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            clearError('register');
            
            const submitButton = registerForm.querySelector('button[type="submit"]');
            submitButton.disabled = true;
            
            try {
                const email = document.getElementById('registerEmail').value;
                const password = document.getElementById('registerPassword').value;
                const confirmPassword = document.getElementById('confirmPassword').value;

                if (password !== confirmPassword) {
                    showError('register', 'Пароли не совпадают');
                    return;
                }

                console.log('Попытка регистрации для:', email);
                const response = await register(email, password);
                
                if (response.success) {
                    showSuccess('register', 'Регистрация успешна! Сейчас вы будете перенаправлены на форму входа.');
                    setTimeout(() => {
                        switchTab('login');
                        clearError('register');
                    }, 2000);
                } else {
                    showError('register', response.error);
                }
            } catch (error) {
                showError('register', 'Произошла ошибка при регистрации');
            } finally {
                submitButton.disabled = false;
            }
        });
    }

    // Добавляем обработчик для кнопки входа
    const loginButton = document.getElementById('loginButton');
    if (loginButton) {
        loginButton.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Клик по кнопке входа');
            openAuthModal();
        });
        console.log('Обработчик для кнопки входа добавлен');
    } else {
        console.error('Кнопка входа не найдена');
    }

    // Добавляем обработчик для кнопки закрытия
    const closeButton = document.getElementById('closeModalBtn');
    if (closeButton) {
        closeButton.addEventListener('click', function() {
            console.log('Клик по кнопке закрытия');
            closeAuthModal();
        });
        console.log('Обработчик для кнопки закрытия добавлен');
    } else {
        console.error('Кнопка закрытия не найдена');
    }

    // Закрытие модального окна при клике вне его
    window.addEventListener('click', function(event) {
        const modal = document.getElementById('authModal');
        if (event.target === modal) {
            closeAuthModal();
        }
    });

    // Проверяем авторизацию при загрузке
    checkAuth().then(user => {
        if (user) {
            updateUserInterface(user);
        }
    });

    console.log('Инициализация скриптов завершена');
}); 