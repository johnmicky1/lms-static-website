// Main Application JavaScript
class LMSApp {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    init() {
        this.initializeSampleData();
        this.loadCurrentUser();
        this.setupEventListeners();
        console.log('LMS App initialized');
    }

    initializeSampleData() {
        if (!localStorage.getItem('lms_users')) {
            const sampleUsers = [
                {
                    id: 'user_1',
                    fullname: 'John Doe',
                    email: 'john@example.com',
                    password: 'password123',
                    createdAt: new Date().toISOString(),
                    progress: {
                        'github-lesson-1': true,
                        'github-lesson-2': true,
                        'jenkins-lesson-1': true
                    },
                    enrolledCourses: ['github', 'jenkins']
                }
            ];
            localStorage.setItem('lms_users', JSON.stringify(sampleUsers));
        }
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
        // Course card click handlers
        const courseCards = document.querySelectorAll('.course-card');
        courseCards.forEach(card => {
            card.addEventListener('click', (e) => {
                if (!e.target.classList.contains('btn')) {
                    const user = JSON.parse(localStorage.getItem('lms_user'));
                    if (!user) {
                        alert('Please login to access courses');
                        window.location.href = 'login.html';
                        return;
                    }
                    window.location.href = card.getAttribute('onclick').match(/'([^']+)'/)[1];
                }
            });
        });
    }
}

// Initialize the LMS application
document.addEventListener('DOMContentLoaded', () => {
    window.lmsApp = new LMSApp();
});