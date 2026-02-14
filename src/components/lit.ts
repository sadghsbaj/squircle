// src/components/squircle.ts
import { LitElement, html, css } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { getSquirclePath } from "../core/math";

/**
 * A container component that clips its content into a squircle shape.
 * Usage: <squircle-container radius="20" smooth="0.6">...</squircle-container>
 */
@customElement("squircle-container")
export class SquircleContainer extends LitElement {
	// --- Public Properties ---

	/** The corner radius in pixels or "max" for a pill/circle shape. */
	@property({ type: String })
	radius: string = "20";

	/** Defines the curvature smoothness. 0 = Circle, 1 = Square-like. */
	@property({ type: Number })
	smooth: number = 0.6;

	// --- Internal State ---

	@state() private _width = 0;
	@state() private _height = 0;

	// Generates a unique ID for the SVG clipPath to ensure isolation within the DOM
	private _clipId = `sq-${Math.random().toString(36).substring(2, 9)}`;
	private _resizeObserver: ResizeObserver | null = null;

	// --- Styles ---

	static styles = css`
		:host {
			/* inline-flex allows the host to wrap tightly around content */
			display: inline-flex;
			vertical-align: middle;
			position: relative;
			box-sizing: border-box;

			/* * UPDATE: Removed 'width: fit-content' and 'height: fit-content'.
             * This prevents conflicts with external CSS frameworks (like UnoCSS/Tailwind)
             * and ensures classes like 'w-full' or 'w-1/2' work immediately.
             */
			min-width: 0;
			min-height: 0;
		}

		.clipper {
			/* Forces the clipper to fill the host container */
			flex: 1;
			display: flex;
			flex-direction: column;
			width: 100%; /* Ensure it fills the host */
			height: 100%; /* Ensure it fills the host */

			/* Performance optimization for frequent geometry changes */
			will-change: clip-path;

			/* Resets ensuring content alignment */
			min-width: 0;
			min-height: 0;
		}

		/* The SVG definition must exist in DOM but should not take up layout space */
		svg {
			position: absolute;
			width: 0;
			height: 0;
			pointer-events: none;
		}
	`;

	// --- Lifecycle Methods ---

	connectedCallback() {
		super.connectedCallback();

		// 1. MEASURE IMMEDIATELY
		// Just like in Svelte, we grab the size right away to avoid the empty render flash.
		this._width = this.offsetWidth;
		this._height = this.offsetHeight;

		// 2. Start Observer (removed requestAnimationFrame for faster reaction)
		this._resizeObserver = new ResizeObserver((entries) => {
			for (const entry of entries) {
				const rect = entry.contentRect;
				// Only update state if dimensions actually changed
				if (rect.width !== this._width || rect.height !== this._height) {
					this._width = rect.width;
					this._height = rect.height;
				}
			}
		});

		this._resizeObserver.observe(this);
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		this._resizeObserver?.disconnect();
	}

	// --- Rendering ---

	render() {
		// Fallback: render content without clip if size is 0 (prevents invisibility)
		// OR render clip immediately if we have the size from connectedCallback

		// Calculate path
		const pathData =
			this._width === 0 || this._height === 0
				? ""
				: getSquirclePath({
						width: this._width,
						height: this._height,
						radius: this.radius === "max" ? "max" : parseFloat(this.radius),
						smoothness: this.smooth,
				  });

		// If pathData is empty, we just render the content in the div,
		// but 'clip-path' with empty url might hide it depending on browser.
		// Better to check:
		const clipStyle = pathData ? `clip-path: url(#${this._clipId});` : "";

		return html`
			<div class="clipper" style="${clipStyle}">
				<slot></slot>
			</div>

			<svg aria-hidden="true">
				<defs>
					<clipPath id="${this._clipId}">
						<path d="${pathData}"></path>
					</clipPath>
				</defs>
			</svg>
		`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		"squircle-container": SquircleContainer;
	}
}
