function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    type();
}

document.addEventListener('DOMContentLoaded', function() {
    const roleElement = document.getElementById('member-role');
    if (roleElement) {
        const text = roleElement.textContent;
        typeWriter(roleElement, text);
    }
});

const themeToggle = document.querySelector('.theme-toggle');
if (themeToggle) {
    themeToggle.addEventListener('click', function() {
        document.body.classList.toggle('light-mode');
        if (document.body.classList.contains('light-mode')) {
            themeToggle.textContent = '🌞';
            document.body.style.setProperty('--bg-gif', 'url("https://i.pinimg.com/originals/a2/06/1b/a2061b029b7d7b9ff43c6e86fcdbb2ce.gif")');
        } else {
            themeToggle.textContent = '🌙';
            document.body.style.setProperty('--bg-gif', 'url("https://i.pinimg.com/originals/40/07/64/40076432aa0d5ceec4ca320b57755592.gif")');
        }
    });
}

// Navbar scroll animation
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});
