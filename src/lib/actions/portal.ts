/**
 * Moves the element this is applied to into a different part of the DOM
 * (defaults to <body>) once it mounts, and removes it on destroy.
 *
 * Use this on any modal/panel backdrop that needs to visually cover the
 * entire screen — sidebar included — when it's rendered inside a page
 * that sits within a layout wrapper using `overflow-hidden` (or any other
 * ancestor that clips fixed-position children to its own bounds).
 *
 * Usage:
 *   <div use:portal class="fixed inset-0 z-[999] ...">...</div>
 */
export function portal(node: HTMLElement, target: string | HTMLElement = 'body') {
	const targetEl = typeof target === 'string' ? document.querySelector(target) : target;

	if (targetEl) {
		targetEl.appendChild(node);
	}

	return {
		destroy() {
			node.remove();
		}
	};
}
