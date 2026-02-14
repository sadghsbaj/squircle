<script lang="ts">
	import { getSquirclePath } from "../core/math";

	interface Props {
		radius?: number | string;
		smooth?: number | string;
		class?: string;
		style?: string;
		children?: import("svelte").Snippet;
	}

	let { radius = 20, smooth = 0.6, class: className = "", style = "", children }: Props = $props();

	let w = $state(0);
	let h = $state(0);

	// Eindeutige ID generieren
	const clipId = `sq-${Math.random().toString(36).substring(2, 9)}`;

	function resizeObserver(node: HTMLElement) {
		// 1. SOFORT MESSEN (Wichtig für Initial-Render in Prod)
		// Wir nehmen offsetWidth/Height für den Startwert, falls der Observer zu langsam ist.
		w = node.offsetWidth;
		h = node.offsetHeight;

		const ro = new ResizeObserver((entries) => {
			for (const entry of entries) {
				// Nutzung von contentRect ist präziser für SVG-Inhalte
				const rect = entry.contentRect;
				if (rect.width !== w || rect.height !== h) {
					w = rect.width;
					h = rect.height;
				}
			}
		});

		ro.observe(node);

		return {
			destroy() {
				ro.disconnect();
			},
		};
	}

	let pathData = $derived(
		getSquirclePath({
			width: w,
			height: h,
			radius: radius === "max" ? "max" : parseFloat(radius.toString()),
			smoothness: parseFloat(smooth.toString()),
		})
	);
</script>

<div use:resizeObserver class="relative box-border min-w-0 min-h-0 {className}" {style}>
	<div
		style="clip-path: url(#{clipId}); will-change: clip-path; width: 100%; height: 100%; display: flex; flex-direction: column;"
	>
		{@render children?.()}
	</div>

	<svg aria-hidden="true" style="position: absolute; width: 0; height: 0; pointer-events: none;">
		<defs>
			<clipPath id={clipId}>
				<path d={pathData}></path>
			</clipPath>
		</defs>
	</svg>
</div>
