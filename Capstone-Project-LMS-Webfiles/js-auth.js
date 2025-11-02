// Authentication System
class AuthSystem {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    init() {
        this.loadCurrentUser();
        this.setupEventListeners();
        console.log('Auth system initialized');
    }

    loadCurrentUser() {
        const userData = localStorage.getItem('lms_user');
        if (userData) {
            this.currentUser = JSON.parse(userData);
            this.updateAuthUI();
        }
    }

    updateAuthUI() {
        const authButton = document.getElementById('auth-button');
        if (authButton) {
            if (this.currentUser) {
                authButton.textContent = 'Dashboard';
                authButton.href = 'dashboard.html';
            } else {
                authButton.textContent = 'Login';
                authButton.href = 'login.html';
            }
        }
    }

    setupEventListeners() {
        // Login form handler
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        // Register form handler
        const registerForm = document.getElementById('register-form');
        if (registerForm) {
            registerForm.addEventListener('submit', (e) => this.handleRegister(e));
        }
    }

    async handleLogin(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const email = formData.get('email');
        const password = formData.get('password');

        if (!email || !password) {
            alert('Please fill in all fields');
            return;
        }

        try {
            const user = this.authenticateUser(email, password);
            
            if (user) {
                this.currentUser = user;
                localStorage.setItem('lms_user', JSON.stringify(user));
                alert('Login successful!');
                window.location.href = 'dashboard.html';
            } else {
                alert('Invalid email or password');
            }
        } catch (error) {
            alert('Login failed. Please try again.');
        }
    }

    async handleRegister(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const userData = {
            id: this.generateId(),
            fullname: formData.get('fullname'),
            email: formData.get('email'),
            password: formData.get('password'),
            createdAt: new Date().toISOString(),
            progress: {},
            enrolledCourses: ['github', 'jenkins']
        };

        // Basic validation
        if (!userData.fullname || !userData.email || !userData.password) {
            alert('Please fill in all fields');
            return;
        }

        if (formData.get('password') !== formData.get('confirm-password')) {
            alert('Passwords do not match');
            return;
        }

        try {
            this.registerUser(userData);
            this.currentUser = userData;
            localStorage.setItem('lms_user', JSON.stringify(userData));
            
            alert('Account created successfully!');
            window.location.href = 'dashboard.html';
            
        } catch (error) {
            alert('Registration failed. Please try again.');
        }
    }

    authenticateUser(email, password) {
        const users = JSON.parse(localStorage.getItem('lms_users') || '[]');
        return users.find(user => user.email === email && user.password === password);
    }

    registerUser(userData) {
        const users = JSON.parse(localStorage.getItem('lms_users') || '[]');
        
        // Check if user already exists
        if (users.find(user => user.email === userData.email)) {
            throw new Error('User already exists');
        }
        
        users.push(userData);
        localStorage.setItem('lms_users', JSON.stringify(users));
    }

    generateId() {
        return 'user_' + Math.random().toString(36).substr(2, 9);
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('lms_user');
        window.location.href = 'index.html';
    }
}

// Initialize auth system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.authSystem = new AuthSystem();
});