// Yannis · 游戏开发作品集 — 站点脚本
// 导航滚动态 / 入场渐入（错峰）/ 作品集筛选

(function () {
	'use strict';

	// 导航：滚动后加毛玻璃背景
	var nav = document.getElementById('nav');
	var onScroll = function () {
		if (nav) nav.classList.toggle('scrolled', window.scrollY > 24);
	};
	window.addEventListener('scroll', onScroll, { passive: true });
	onScroll();

	// 入场渐入：IntersectionObserver + transition-delay 错峰
	var revealEls = document.querySelectorAll('.reveal');
	if ('IntersectionObserver' in window && revealEls.length) {
		var io = new IntersectionObserver(function (entries) {
			entries.forEach(function (entry) {
				if (entry.isIntersecting) {
					entry.target.classList.add('visible');
					io.unobserve(entry.target);
				}
			});
		}, { threshold: 0.12, rootMargin: '0px 0px -36px 0px' });
		revealEls.forEach(function (el) { io.observe(el); });
	} else {
		revealEls.forEach(function (el) { el.classList.add('visible'); });
	}

	// 作品集筛选：data-f 属性匹配卡片 data-tags
	var chips = document.querySelectorAll('.filters button[data-f]');
	if (chips.length) {
		chips.forEach(function (chip) {
			chip.addEventListener('click', function () {
				var f = chip.getAttribute('data-f');
				chips.forEach(function (c) { c.classList.toggle('active', c === chip); });
				document.querySelectorAll('.post-card').forEach(function (card) {
					var tags = card.getAttribute('data-tags') || '';
					card.classList.toggle('hidden', f !== 'all' && tags.indexOf(f) === -1);
				});
			});
		});
	}
})();
