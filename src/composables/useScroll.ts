import { nextTick, onMounted, onUnmounted, watch, type Ref } from 'vue';

export function useScroll({
	node,
	target,
	onIntersect,
	treshhold = '100px',
}: {
	node: Ref<HTMLElement | null>;
	target: Ref<HTMLElement | null>;
	onIntersect: () => boolean | void | Promise<boolean | void>;
	treshhold?: string;
}) {
	let observer: IntersectionObserver | null = null;
	let fillPromise: Promise<void> | null = null;

	const disconnect = () => {
		observer?.disconnect();
		observer = null;
	};

	const isVisible = () => {
		if (!node.value || !target.value) {
			return false;
		}

		const root = node.value.getBoundingClientRect();
		const edge = target.value.getBoundingClientRect();
		const margin = Number.parseFloat(treshhold) || 0;

		return edge.top <= root.bottom + margin && edge.bottom >= root.top - margin;
	};

	const fill = () => {
		if (fillPromise) {
			return fillPromise;
		}

		fillPromise = (async () => {
			try {
				do {
					const canContinue = await onIntersect();
					if (!canContinue) {
						break;
					}
					await nextTick();
				} while (isVisible());
			} finally {
				fillPromise = null;
			}
		})();

		return fillPromise;
	};

	const connect = () => {
		disconnect();

		if (!node.value || !target.value) {
			return;
		}

		observer = new IntersectionObserver(
			([entry]) => {
				if (!entry?.isIntersecting) {
					return;
				}
				fill();
			},
			{ root: node.value, rootMargin: treshhold },
		);

		observer.observe(target.value);

		if (isVisible()) {
			fill();
		}
	};

	onMounted(() => {
		connect();
	});

	onUnmounted(() => {
		disconnect();
	});

	watch([node, target], () => {
		connect();
	});

	return { fill };
}
