async function vote(candidateId) {
    try {
        const response = await fetch(`/vote/${candidateId}`, {
            method: 'POST'
        });
        const data = await response.json();

        if (data.success) {
            // 更新显示的票数
            document.getElementById(`votes-${candidateId}`).textContent = data.votes;
            alert('投票成功！');
        } else {
            alert('投票失败，请稍后重试。');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('投票失败，请稍后重试。');
    }
}

let slideIndices = {};

document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.candidate-card').forEach(card => {
        const slides = card.querySelectorAll('.slide');
        if (slides.length > 0) {
            const candidateId = slides[0].dataset.candidate;
            slideIndices[candidateId] = 0;
            showSlides(candidateId, 0);
        }
    });
});

function changeSlide(candidateId, n) {
    const currentIndex = slideIndices[candidateId] || 0;
    showSlides(candidateId, currentIndex + n);
}

function currentSlide(candidateId, n) {
    showSlides(candidateId, n);
}

function showSlides(candidateId, n) {
    const card = document.querySelector(`.candidate-card:has(.slide[data-candidate="${candidateId}"])`);
    const slides = card.querySelectorAll('.slide');
    const dots = card.querySelectorAll('.dot');

    if (!slides.length) return;

    if (n >= slides.length) n = 0;
    if (n < 0) n = slides.length - 1;

    slideIndices[candidateId] = n;

    slides.forEach(slide => {
        slide.style.display = "none";
    });

    dots.forEach(dot => {
        dot.classList.remove("active");
    });

    slides[n].style.display = "block";
    if (dots[n]) {
        dots[n].classList.add("active");
    }
}

// 弹窗相关变量
const modal = document.getElementById('imageModal');
const closeBtn = document.querySelector('.close-modal');
let currentGallery = null;
let currentIndex = 0;

function openModal(candidateId) {
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';

    // 隐藏所有图片组，显示选中的图片组
    document.querySelectorAll('.modal-gallery').forEach(gallery => {
        gallery.style.display = 'none';
    });

    currentGallery = document.getElementById(`gallery-${candidateId}`);
    currentGallery.style.display = 'block';

    // 显示第一张图片
    showModalImage(0);
}

function closeModal() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
    currentGallery = null;
    currentIndex = 0;
}

function showModalImage(index) {
    if (!currentGallery) return;

    const slides = currentGallery.querySelectorAll('.modal-slide');
    slides.forEach(slide => slide.classList.remove('active'));

    currentIndex = index;
    if (currentIndex >= slides.length) currentIndex = 0;
    if (currentIndex < 0) currentIndex = slides.length - 1;

    slides[currentIndex].classList.add('active');
}

function nextImage(candidateId) {
    showModalImage(currentIndex + 1);
}

function prevImage(candidateId) {
    showModalImage(currentIndex - 1);
}

// 点击关闭按钮关闭弹窗
closeBtn.onclick = closeModal;

// 点击弹窗外部关闭弹窗
window.onclick = function (event) {
    if (event.target === modal) {
        closeModal();
    }
}

// ESC键关闭弹窗
document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
        closeModal();
    }
    // 左右方向键切换图片
    if (currentGallery) {
        if (event.key === 'ArrowLeft') {
            prevImage();
        } else if (event.key === 'ArrowRight') {
            nextImage();
        }
    }
}); 