(function () {
	'use strict';

	function initCarousel(root) {
		var track = root.querySelector('.image-carousel-track');
		var slides = Array.prototype.slice.call(root.querySelectorAll('.image-carousel-slide'));
		var prevBtn = root.querySelector('.image-carousel-prev');
		var nextBtn = root.querySelector('.image-carousel-next');
		var dotsWrap = root.parentNode.querySelector('.image-carousel-dots');
		var current = 0;
		var autoplayDelay = parseInt(root.getAttribute('data-autoplay'), 10) || 0;
		var timer = null;

		if (!slides.length) { return; }

		slides.forEach(function (slide, i) {
			var dot = document.createElement('button');
			dot.type = 'button';
			dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
			if (i === 0) { dot.className = 'active'; }
			dot.addEventListener('click', function () { goTo(i); });
			dotsWrap.appendChild(dot);
		});

		function update() {
			track.style.transform = 'translateX(-' + (current * 100) + '%)';
			var dots = dotsWrap.querySelectorAll('button');
			dots.forEach(function (dot, i) {
				dot.className = i === current ? 'active' : '';
			});
		}

		function goTo(index) {
			current = (index + slides.length) % slides.length;
			update();
		}

		function next() { goTo(current + 1); }
		function prev() { goTo(current - 1); }

		function startAutoplay() {
			if (autoplayDelay > 0) {
				timer = setInterval(next, autoplayDelay);
			}
		}

		function stopAutoplay() {
			if (timer) {
				clearInterval(timer);
				timer = null;
			}
		}

		nextBtn.addEventListener('click', function () { next(); stopAutoplay(); startAutoplay(); });
		prevBtn.addEventListener('click', function () { prev(); stopAutoplay(); startAutoplay(); });

		root.addEventListener('keydown', function (e) {
			if (e.key === 'ArrowRight') { next(); }
			if (e.key === 'ArrowLeft') { prev(); }
		});

		root.addEventListener('mouseenter', stopAutoplay);
		root.addEventListener('mouseleave', startAutoplay);

		var touchStartX = null;
		root.addEventListener('touchstart', function (e) {
			touchStartX = e.changedTouches[0].screenX;
		}, { passive: true });
		root.addEventListener('touchend', function (e) {
			if (touchStartX === null) { return; }
			var delta = e.changedTouches[0].screenX - touchStartX;
			if (Math.abs(delta) > 40) {
				delta < 0 ? next() : prev();
			}
			touchStartX = null;
		}, { passive: true });

		update();
		startAutoplay();
	}

	document.addEventListener('DOMContentLoaded', function () {
		var carousels = document.querySelectorAll('.image-carousel');
		carousels.forEach(initCarousel);
	});
})();
