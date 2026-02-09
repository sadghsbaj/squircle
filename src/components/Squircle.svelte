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

	// State für Dimensionen
	let w = $state(0);
	let h = $state(0);

	const clipId = `sq-${Math.random().toString(36).substring(2, 9)}`;

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

	let pathData = $derived(
		getSquirclePath({
			width: w,
			height: h,
			radius: radius === "max" ? "max" : parseFloat(radius.toString()),
			smoothness: parseFloat(smooth.toString()),
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
