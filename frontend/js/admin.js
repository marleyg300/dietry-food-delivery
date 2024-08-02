document.addEventListener('DOMContentLoaded', () => {
    const allSideMenu = document.querySelectorAll('#sidebar .side-menu.top li a');

    allSideMenu.forEach(item => {
        const li = item.parentElement;

        item.addEventListener('click', function () {
            allSideMenu.forEach(i => {
                i.parentElement.classList.remove('active');
            });
            li.classList.add('active');
        });
    });

    // TOGGLE SIDEBAR
    const menuBar = document.querySelector('#content nav .bx.bx-menu');
    const sidebar = document.getElementById('sidebar');

    menuBar.addEventListener('click', function () {
        sidebar.classList.toggle('hide');
        document.querySelector('#content nav').classList.toggle('hide');
        document.querySelector('#content main').classList.toggle('hide');
        
        // Hide sidebar text when sidebar is collapsed
        const sideMenuText = document.querySelectorAll('#sidebar .side-menu .text');
        sideMenuText.forEach(text => {
            text.classList.toggle('hidden');
        });
    });

    const switchMode = document.getElementById('switch-mode');

    switchMode.addEventListener('change', function () {
        if (this.checked) {
            document.body.classList.add('dark');
        } else {
            document.body.classList.remove('dark');
        }
    });

    // Notification Bell Functionality
    const notificationBell = document.querySelector('.notification');
    const notificationNum = document.querySelector('.notification .num');

    let notifications = 8;

    function updateNotifications() {
        if (notifications > 0) {
            notificationNum.textContent = notifications;
            notificationNum.style.display = 'flex';
        } else {
            notificationNum.style.display = 'none';
        }
    }

    notificationBell.addEventListener('click', function () {
        notifications = 0;
        updateNotifications();
    });

    updateNotifications();
});
