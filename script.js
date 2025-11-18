// Daily Tracker Application with PWA functionality
class DailyTracker {
    constructor() {
        this.data = this.loadFromStorage();
        this.currentDate = new Date();
        this.currentInput = null;
        this.deferredPrompt = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.renderAllSections();
        this.updateDateRestrictions();
        this.setupMenuToggle();
        this.registerServiceWorker();
        this.setupPWAInstallPrompt();
    }

    setupPWAInstallPrompt() {
        // Listen for the beforeinstallprompt event
        window.addEventListener('beforeinstallprompt', (e) => {
            // Prevent the mini-infobar from appearing on mobile
            e.preventDefault();
            // Stash the event so it can be triggered later
            this.deferredPrompt = e;
            // Show the install prompt
            this.showInstallPrompt();
        });

        // Listen for the appinstalled event
        window.addEventListener('appinstalled', () => {
            console.log('PWA was installed');
            this.hideInstallPrompt();
        });
    }

    showInstallPrompt() {
        // Check if we have a deferred prompt
        if (this.deferredPrompt) {
            const installPrompt = document.getElementById('install-prompt');
            installPrompt.classList.add('show');
        }
    }

    hideInstallPrompt() {
        const installPrompt = document.getElementById('install-prompt');
        installPrompt.classList.remove('show');
    }

    registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/service-worker.js')
                .then(registration => {
                    console.log('Service Worker registered with scope:', registration.scope);
                })
                .catch(error => {
                    console.log('Service Worker registration failed:', error);
                });
        }
    }

    setupMenuToggle() {
        const menuToggle = document.querySelector('.menu-toggle');
        const mobileMenu = document.querySelector('.mobile-menu');
        
        if (menuToggle && mobileMenu) {
            menuToggle.addEventListener('click', () => {
                const isExpanded = mobileMenu.style.display === 'block';
                mobileMenu.style.display = isExpanded ? 'none' : 'block';
                
                // Animate the menu icon
                const icon = menuToggle.querySelector('i');
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-times');
                
                if (!isExpanded) {
                    // Close menu when clicking outside on mobile
                    this.setupOutsideClickClose(mobileMenu);
                }
            });
        }
    }

    setupOutsideClickClose(menu) {
        const closeMenu = () => {
            menu.style.display = 'none';
            const icon = document.querySelector('.menu-toggle i');
            icon.classList.add('fa-bars');
            icon.classList.remove('fa-times');
            document.removeEventListener('click', clickHandler);
        };

        const clickHandler = (e) => {
            if (!menu.contains(e.target) && !e.target.closest('.menu-toggle')) {
                closeMenu();
            }
        };

        // Remove any existing listeners first
        document.removeEventListener('click', clickHandler);
        // Add new listener
        setTimeout(() => {
            document.addEventListener('click', clickHandler);
        }, 100);
    }

    setupEventListeners() {
        // Tab switching with active ripple effect
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                this.switchTab(e.target.dataset.tab);
            });
            
            // Add active ripple effect
            tab.addEventListener('mousedown', (e) => {
                const rect = tab.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const ripple = document.createElement('span');
                ripple.className = 'ripple';
                ripple.style.left = x + 'px';
                ripple.style.top = y + 'px';
                tab.appendChild(ripple);
                
                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
        });

        // Input change handlers
        document.querySelectorAll('.activity-input').forEach(input => {
            input.addEventListener('change', (e) => {
                this.handleInputChange(e);
            });
        });

        // Calendar button handlers with active effect
        document.querySelectorAll('.calendar-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.openCalendar(e);
            });
            
            // Add active ripple effect
            btn.addEventListener('mousedown', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const ripple = document.createElement('span');
                ripple.className = 'ripple';
                ripple.style.left = x + 'px';
                ripple.style.top = y + 'px';
                btn.appendChild(ripple);
                
                setTimeout(() => {
                    ripple.remove();
                }, 400);
            });
        });

        // Modal close
        document.querySelector('.close').addEventListener('click', () => {
            this.closeCalendar();
        });

        // Add active effect to close button
        document.querySelector('.close').addEventListener('mousedown', (e) => {
            const rect = e.target.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const ripple = document.createElement('span');
            ripple.className = 'ripple';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            e.target.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 300);
        });

        // Modal background click
        document.getElementById('calendar-modal').addEventListener('click', (e) => {
            if (e.target.id === 'calendar-modal') {
                this.closeCalendar();
            }
        });

        // Date picker change
        document.getElementById('date-picker').addEventListener('change', (e) => {
            this.handleDateChange(e);
        });

        // Reset button with active effect
        document.getElementById('reset-btn').addEventListener('click', () => {
            this.resetData();
        });

        document.getElementById('reset-btn').addEventListener('mousedown', (e) => {
            this.addRippleEffect(e.target, e);
        });

        // Export button with active effect
        document.getElementById('export-btn').addEventListener('click', () => {
            this.exportToExcel();
        });

        document.getElementById('export-btn').addEventListener('mousedown', (e) => {
            this.addRippleEffect(e.target, e);
        });

        // Install prompt handlers
        document.getElementById('install-btn').addEventListener('click', () => {
            this.promptInstall();
        });

        document.getElementById('install-dismiss').addEventListener('click', () => {
            this.hideInstallPrompt();
        });
    }

    promptInstall() {
        if (this.deferredPrompt) {
            // Show the install prompt
            this.deferredPrompt.prompt();
            
            // Wait for the user to respond to the prompt
            this.deferredPrompt.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    console.log('User accepted the install prompt');
                } else {
                    console.log('User dismissed the install prompt');
                }
                this.deferredPrompt = null;
            });
        }
    }

    addRippleEffect(element, e) {
        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const ripple = document.createElement('span');
        ripple.className = 'ripple';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        element.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 400);
    }

    switchTab(tabName) {
        // Hide all sections
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });
        
        // Show selected section
        document.getElementById(tabName).classList.add('active');
        
        // Update active tab
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        
        // Close mobile menu after selection on mobile
        const mobileMenu = document.querySelector('.mobile-menu');
        if (window.innerWidth <= 768 && mobileMenu) {
            mobileMenu.style.display = 'none';
            const icon = document.querySelector('.menu-toggle i');
            icon.classList.add('fa-bars');
            icon.classList.remove('fa-times');
        }
    }

    handleInputChange(e) {
        const input = e.target;
        const activity = input.dataset.activity;
        const value = input.value;
        const date = this.currentDate.toISOString().split('T')[0];

        if (value !== '') {
            if (!this.data[activity]) {
                this.data[activity] = {};
            }
            this.data[activity][date] = {
                value: value,
                timestamp: new Date().toISOString()
            };
            this.saveToStorage();
            this.renderHistory(activity);
            this.updateGeneralHistory();
        }
    }

    openCalendar(e) {
        const input = e.target.closest('.input-group').querySelector('.activity-input');
        this.currentInput = input;
        
        const modal = document.getElementById('calendar-modal');
        const datePicker = document.getElementById('date-picker');
        
        // Set current date as default
        datePicker.value = this.currentDate.toISOString().split('T')[0];
        
        modal.style.display = 'block';
    }

    closeCalendar() {
        document.getElementById('calendar-modal').style.display = 'none';
    }

    handleDateChange(e) {
        const selectedDate = new Date(e.target.value);
        this.currentDate = selectedDate;
        this.closeCalendar();
        
        // Focus back on the input that opened the calendar
        if (this.currentInput) {
            this.currentInput.focus();
        }
    }

    updateDateRestrictions() {
        const today = new Date();
        const maxDate = new Date(today);
        maxDate.setDate(maxDate.getDate() + 1); // Tomorrow is the max
        
        const minDate = new Date(today);
        minDate.setDate(minDate.getDate() - 3); // 3 days ago is the min
        
        const datePicker = document.getElementById('date-picker');
        datePicker.max = maxDate.toISOString().split('T')[0];
        datePicker.min = minDate.toISOString().split('T')[0];
    }

    renderHistory(activity) {
        const historyList = document.getElementById(`${activity}-history`);
        if (!historyList) return;

        historyList.innerHTML = '';

        if (this.data[activity]) {
            const sortedDates = Object.keys(this.data[activity]).sort((a, b) => 
                new Date(b) - new Date(a)
            );

            sortedDates.forEach(date => {
                const entry = this.data[activity][date];
                const historyItem = document.createElement('div');
                historyItem.className = 'history-item';
                
                const dateObj = new Date(date);
                const formattedDate = dateObj.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric'
                });

                historyItem.innerHTML = `
                    <span class="history-date">${formattedDate}</span>
                    <span class="history-value">${entry.value}</span>
                `;
                
                historyList.appendChild(historyItem);
            });
        }
    }

    updateGeneralHistory() {
        const generalHistory = document.getElementById('general-history');
        if (!generalHistory) return;

        let allEntries = [];

        Object.keys(this.data).forEach(activity => {
            Object.keys(this.data[activity]).forEach(date => {
                const entry = this.data[activity][date];
                const activityName = this.getActivityDisplayName(activity);
                allEntries.push({
                    date: date,
                    activity: activityName,
                    value: entry.value
                });
            });
        });

        // Sort by date (newest first)
        allEntries.sort((a, b) => new Date(b.date) - new Date(a.date));

        // Clear and rebuild
        generalHistory.innerHTML = '';
        
        if (allEntries.length === 0) {
            generalHistory.innerHTML = '<p style="color: var(--text-light); text-align: center; padding: 20px;">No activity recorded yet.</p>';
            return;
        }

        allEntries.forEach(item => {
            const entry = document.createElement('div');
            entry.className = 'history-item';
            
            const dateObj = new Date(item.date);
            const formattedDate = dateObj.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });

            entry.innerHTML = `
                <div style="flex: 1;">
                    <div style="font-weight: 500;">${item.activity}</div>
                    <div class="history-date">${formattedDate}</div>
                </div>
                <span class="history-value">${item.value}</span>
            `;
            
            generalHistory.appendChild(entry);
        });
    }

    getActivityDisplayName(activityKey) {
        const names = {
            'excel': 'Excel',
            'logistics': 'Logistics',
            'chess': 'Chess',
            'podcast': 'Podcast',
            'ibrat': 'Ibrat Academy',
            'vocabulary': 'Vocabulary',
            'book': 'Book Reading',
            'meditation': 'Meditation',
            'dissertation': 'Dissertation',
            'court': 'Court Case',
            'substance': 'Substance Learning',
            'squats': 'Squats',
            'pushups': 'Push-ups',
            'plank': 'Plank',
            'mountain': 'Mountain Climbers',
            'wakeup': 'Wake Up Time',
            'makebed': 'Make Bed',
            'withoutphone': 'Without Phone',
            'sleeptime': 'Sleep Time'
        };
        return names[activityKey] || activityKey;
    }

    renderAllSections() {
        // Render all activity histories
        Object.keys(this.data).forEach(activity => {
            this.renderHistory(activity);
        });
        
        // Update general history
        this.updateGeneralHistory();
    }

    resetData() {
        if (confirm('Are you sure you want to reset all data? This cannot be undone.')) {
            this.data = {};
            this.saveToStorage();
            this.renderAllSections();
            alert('All data has been reset.');
        }
    }

    exportToExcel() {
        let csvContent = "Activity,Date,Value,Timestamp\n";
        
        Object.keys(this.data).forEach(activity => {
            Object.keys(this.data[activity]).forEach(date => {
                const entry = this.data[activity][date];
                const activityName = this.getActivityDisplayName(activity);
                csvContent += `"${activityName}","${date}","${entry.value}","${entry.timestamp}"\n`;
            });
        });

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `daily_tracker_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    saveToStorage() {
        localStorage.setItem('dailyTrackerData', JSON.stringify(this.data));
    }

    loadFromStorage() {
        const saved = localStorage.getItem('dailyTrackerData');
        return saved ? JSON.parse(saved) : {};
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new DailyTracker();
});