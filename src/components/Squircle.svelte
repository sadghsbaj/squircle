<script lang="ts">
	import { getSquirclePath } from "../core/math";

	interface Props {
		// Wir erlauben number UND string, damit man radius={20} oder radius="20" schreiben kann
		radius?: number | string;
		smooth?: number;
		class?: string;
		style?: string;
		children?: import("svelte").Snippet;
	}

	let {
		radius = 20, // Standard als Zahl
		smooth = 0.6,
		class: className = "",
		style = "",
		children,
	}: Props = $props();

	// State für Dimensionen
	let w = $state(0);
	let h = $state(0);

	// Unique ID für SVG Isolation
	const clipId = `sq-${Math.random().toString(36).substring(2, 9)}`;

	// Der Resize Observer als Action
	function resizeObserver(node: HTMLElement) {
		const ro = new ResizeObserver((entries) => {
			for (const entry of entries) {
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

	// Pfad berechnen
	let pathData = $derived(
		getSquirclePath({
			width: w,
			height: h,
			radius: radius === "max" ? "max" : parseFloat(radius.toString()),
			smoothness: smooth,
		})
	);
</script>

<div
	use:resizeObserver
	class="inline-flex relative box-border w-fit h-fit min-w-0 min-h-0 {className}"
	style="clip-path: url(#{clipId}); will-change: clip-path; {style}"
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
