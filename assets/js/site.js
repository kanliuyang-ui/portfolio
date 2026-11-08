// Yannis · 游戏开发作品集 — 站点脚本
// 全站导航 / 入场渐入 / 项目筛选

(function () {
	'use strict';

	// 导航：滚动后加毛玻璃背景
	var nav = document.getElementById('nav');
	var onScroll = function () {
		if (nav) nav.classList.toggle('scrolled', window.scrollY > 24);
	};
	window.addEventListener('scroll', onScroll, { passive: true });
	onScroll();

	// Keep the return routes visible, with a disclosure menu on narrow screens.
	if (nav) {
		var menuButton = nav.querySelector('.nav-menu-toggle');
		var menuLinks = nav.querySelector('#site-nav-links');
		var compactNav = window.matchMedia('(max-width: 1050px)');
		if (menuButton && menuLinks) {
			nav.classList.add('nav-enhanced');
			var closeMenu = function (restoreFocus) {
				var wasOpen = nav.classList.contains('menu-open');
				nav.classList.remove('menu-open');
				menuButton.setAttribute('aria-expanded', 'false');
				if (restoreFocus && wasOpen) menuButton.focus();
			};
			menuButton.addEventListener('click', function () {
				var opening = !nav.classList.contains('menu-open');
				nav.classList.toggle('menu-open', opening);
				menuButton.setAttribute('aria-expanded', String(opening));
				if (opening) menuLinks.querySelector('a').focus();
			});
			nav.addEventListener('click', function (event) {
				if (event.target.closest('a')) closeMenu(false);
			});
			document.addEventListener('click', function (event) {
				if (!nav.contains(event.target)) closeMenu(false);
			});
			document.addEventListener('keydown', function (event) {
				if (event.key === 'Escape') closeMenu(true);
			});
			var onNavResize = function () { closeMenu(false); };
			if (compactNav.addEventListener) compactNav.addEventListener('change', onNavResize);
			else compactNav.addListener(onNavResize);
		}
		var updateCurrentRoute = function () {
			var file = window.location.pathname.split('/').pop() || 'index.html';
			var isHome = file === 'index.html';
			var section = window.location.hash.slice(1);
			nav.querySelectorAll('a[data-nav]').forEach(function (link) {
				var route = link.getAttribute('data-nav');
				var selected = route === 'home' ? isHome && (!section || section === 'main') :
					route === 'projects' ? !isHome || section === 'portfolio' : isHome && section === route;
				link.classList.toggle('active', selected);
				if (selected) {
					link.setAttribute('aria-current', route === 'home' || file === 'projects.html' ? 'page' : 'location');
				} else link.removeAttribute('aria-current');
			});
		};
		window.addEventListener('hashchange', updateCurrentRoute);
		updateCurrentRoute();
	}

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
				chips.forEach(function (c) {
					c.classList.toggle('active', c === chip);
					c.setAttribute('aria-pressed', String(c === chip));
				});
				document.querySelectorAll('.post-card').forEach(function (card) {
					var tags = (card.getAttribute('data-tags') || '').split(/\s+/);
					card.classList.toggle('hidden', f !== 'all' && tags.indexOf(f) === -1);
				});
			});
		});
	}
})();
