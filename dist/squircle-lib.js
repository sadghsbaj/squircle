import { css as f, LitElement as m, html as g } from "lit";
import { property as d, state as p, customElement as $ } from "lit/decorators.js";
function w(s) {
  const { width: e, height: i, radius: r, smoothness: h } = s;
  if (e === 0 || i === 0) return "";
  const l = Math.min(e, i) / 2;
  let t = 0;
  r === "max" ? t = l : t = Math.min(Number(r) || 0, l), t < 0 && (t = 0);
  const c = 0.5522847498, u = c + h * (1 - c), n = t * u;
  return `
    M ${t}, 0
    L ${e - t}, 0
    C ${e - t + n}, 0, ${e}, ${t - n}, ${e}, ${t}
    L ${e}, ${i - t}
    C ${e}, ${i - t + n}, ${e - t + n}, ${i}, ${e - t}, ${i}
    L ${t}, ${i}
    C ${t - n}, ${i}, 0, ${i - t + n}, 0, ${i - t}
    L 0, ${t}
    C 0, ${t - n}, ${t - n}, 0, ${t}, 0
    Z
  `;
}
var _ = Object.defineProperty, v = Object.getOwnPropertyDescriptor, a = (s, e, i, r) => {
  for (var h = r > 1 ? void 0 : r ? v(e, i) : e, l = s.length - 1, t; l >= 0; l--)
    (t = s[l]) && (h = (r ? t(e, i, h) : t(h)) || h);
  return r && h && _(e, i, h), h;
};
let o = class extends m {
  constructor() {
    super(...arguments), this.radius = "20", this.smooth = 0.6, this._width = 0, this._height = 0, this._clipId = `sq-${Math.random().toString(36).substring(2, 9)}`, this._resizeObserver = null;
  }
  // --- Lifecycle Methods ---
  connectedCallback() {
    super.connectedCallback(), this._width = this.offsetWidth, this._height = this.offsetHeight, this._resizeObserver = new ResizeObserver((s) => {
      for (const e of s) {
        const i = e.contentRect;
        (i.width !== this._width || i.height !== this._height) && (this._width = i.width, this._height = i.height);
      }
    }), this._resizeObserver.observe(this);
  }
  disconnectedCallback() {
    var s;
    super.disconnectedCallback(), (s = this._resizeObserver) == null || s.disconnect();
  }
  // --- Rendering ---
  render() {
    const s = this._width === 0 || this._height === 0 ? "" : w({
      width: this._width,
      height: this._height,
      radius: this.radius === "max" ? "max" : parseFloat(this.radius),
      smoothness: this.smooth
    }), e = s ? `clip-path: url(#${this._clipId});` : "";
    return g`
			<div class="clipper" style="${e}">
				<slot></slot>
			</div>

			<svg aria-hidden="true">
				<defs>
					<clipPath id="${this._clipId}">
						<path d="${s}"></path>
					</clipPath>
				</defs>
			</svg>
		`;
  }
};
o.styles = f`
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
a([
  d({ type: String })
], o.prototype, "radius", 2);
a([
  d({ type: Number })
], o.prototype, "smooth", 2);
a([
  p()
], o.prototype, "_width", 2);
a([
  p()
], o.prototype, "_height", 2);
o = a([
  $("squircle-container")
], o);
export {
  o as SquircleContainer,
  w as getSquirclePath
};
