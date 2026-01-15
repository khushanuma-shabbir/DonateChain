let selectedAmount = 0;

// Donation Selection
function selectAmount(amount, event) {
  selectedAmount = amount;
  
  const cards = document.querySelectorAll('.donation-card');
  cards.forEach(card => {
    card.style.borderColor = 'rgba(139, 195, 74, 0.3)';
    card.style.transform = 'scale(1)';
  });

  if (event && event.currentTarget) {
    event.currentTarget.style.borderColor = '#2e7d32';
    event.currentTarget.style.transform = 'scale(1.05)';
    event.currentTarget.style.boxShadow = '0 12px 35px rgba(46, 125, 50, 0.3)';
  }
}

// Contact Form
function handleContact() {
  const name = document.getElementById('contactName').value;
  const email = document.getElementById('contactEmail').value;
  const message = document.getElementById('contactMessage').value;

  if (name && email && message) {
    alert('🌱 Thank you for reaching out! We\'ll get back to you soon.\n\nTogether, we grow stronger!');
    document.getElementById('contactName').value = '';
    document.getElementById('contactEmail').value = '';
    document.getElementById('contactSubject').value = '';
    document.getElementById('contactMessage').value = '';
  } else {
    alert('🌿 Please fill in all required fields.');
  }
}

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (!href.startsWith("#")) return; // Allow external links
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
  const navbar = document.getElementById('navbar');
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// Parallax effect for floating leaves
document.addEventListener('mousemove', (e) => {
  const leaves = document.querySelectorAll('.leaf');
  leaves.forEach((leaf, index) => {
    const speed = (index + 1) * 0.015;
    const x = (window.innerWidth - e.pageX * speed) / 100;
    const y = (window.innerHeight - e.pageY * speed) / 100;
    leaf.style.transform = `translateX(${x}px) translateY(${y}px)`;
  });
});

// Entrance animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

document.querySelectorAll('.impact-card, .mission-card, .donation-card').forEach(card => {
  card.style.opacity = '0';
  card.style.transform = 'translateY(20px)';
  card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(card);
});
