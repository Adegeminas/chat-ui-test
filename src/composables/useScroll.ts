import { onMounted, onUnmounted, type Ref, watch } from "vue";

export function useScroll({
    node,
    target,
    onIntersect,
    treshhold = '50px',
}: {
    node: Ref<HTMLElement | null>,
    target: Ref<HTMLElement | null>,
    onIntersect: () => void,
    treshhold?: string,
}) {
    let observer: IntersectionObserver | null = null;

    const disconnect = () => {
        observer?.disconnect();
        observer = null;
    }

    const connect = () => {
        disconnect();

        if (!node.value || !target.value) {
            return;
        }

        observer = new IntersectionObserver(([entry]) => {
            if (!entry.isIntersecting) {
                return;
            }
            onIntersect();
        }, { root: node.value, rootMargin: treshhold});

        observer.observe(target.value);
    }

    onMounted(() => {
        connect();
    });

    onUnmounted(() => {
        disconnect();
    });

    watch([node, target], () => {
        connect();
    });
};