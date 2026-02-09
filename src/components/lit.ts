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

			/* Default behavior: adapt to content size */
			width: fit-content;
			height: fit-content;
		}

		.clipper {
			/* Forces the clipper to fill the host container */
			flex: 1;
			display: flex;
			flex-direction: column;

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

		// Defer observation to the next animation frame to prevent layout thrashing
		// during initial rendering.
		requestAnimationFrame(() => {
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
		});
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		this._resizeObserver?.disconnect();
	}

	// --- Rendering ---

	render() {
		// Prevent rendering the clip-path if dimensions are not yet determined.
		// This avoids visual artifacts or console errors during initialization.
		if (this._width === 0 || this._height === 0) {
			return html`<div class="clipper"><slot></slot></div>`;
		}

		const pathData = getSquirclePath({
			width: this._width,
			height: this._height,
			radius: this.radius === "max" ? "max" : parseFloat(this.radius),
			smoothness: this.smooth,
		});

		// We apply the clip-path via inline styles to reference the unique ID reliably.
		return html`
			<div class="clipper" style="clip-path: url(#${this._clipId});">
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
