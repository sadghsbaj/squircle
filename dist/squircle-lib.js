import { css as f, LitElement as g, html as p } from "lit";
import { property as d, state as u, customElement as $ } from "lit/decorators.js";
function _(r) {
  const { width: i, height: e, radius: o, smoothness: s } = r;
  if (i === 0 || e === 0) return "";
  const l = Math.min(i, e) / 2;
  let t = 0;
  o === "max" ? t = l : t = Math.min(Number(o) || 0, l), t < 0 && (t = 0);
  const c = 0.5522847498, m = c + s * (1 - c), n = t * m;
  return `
    M ${t}, 0
    L ${i - t}, 0
    C ${i - t + n}, 0, ${i}, ${t - n}, ${i}, ${t}
    L ${i}, ${e - t}
    C ${i}, ${e - t + n}, ${i - t + n}, ${e}, ${i - t}, ${e}
    L ${t}, ${e}
    C ${t - n}, ${e}, 0, ${e - t + n}, 0, ${e - t}
    L 0, ${t}
    C 0, ${t - n}, ${t - n}, 0, ${t}, 0
    Z
  `;
}
var v = Object.defineProperty, b = Object.getOwnPropertyDescriptor, a = (r, i, e, o) => {
  for (var s = o > 1 ? void 0 : o ? b(i, e) : i, l = r.length - 1, t; l >= 0; l--)
    (t = r[l]) && (s = (o ? t(i, e, s) : t(s)) || s);
  return o && s && v(i, e, s), s;
};
let h = class extends g {
  constructor() {
    super(...arguments), this.radius = "20", this.smooth = 0.6, this._width = 0, this._height = 0, this._clipId = `sq-${Math.random().toString(36).substring(2, 9)}`, this._resizeObserver = null;
  }
  // --- Lifecycle Methods ---
  connectedCallback() {
    super.connectedCallback(), requestAnimationFrame(() => {
      this._resizeObserver = new ResizeObserver((r) => {
        for (const i of r) {
          const e = i.contentRect;
          (e.width !== this._width || e.height !== this._height) && (this._width = e.width, this._height = e.height);
        }
      }), this._resizeObserver.observe(this);
    });
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._resizeObserver?.disconnect();
  }
  // --- Rendering ---
  render() {
    if (this._width === 0 || this._height === 0)
      return p`<div class="clipper"><slot></slot></div>`;
    const r = _({
      width: this._width,
      height: this._height,
      radius: this.radius === "max" ? "max" : parseFloat(this.radius),
      smoothness: this.smooth
    });
    return p`
			<div class="clipper" style="clip-path: url(#${this._clipId});">
				<slot></slot>
			</div>

			<svg aria-hidden="true">
				<defs>
					<clipPath id="${this._clipId}">
						<path d="${r}"></path>
					</clipPath>
				</defs>
			</svg>
		`;
  }
};
h.styles = f`
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
a([
  d({ type: String })
], h.prototype, "radius", 2);
a([
  d({ type: Number })
], h.prototype, "smooth", 2);
a([
  u()
], h.prototype, "_width", 2);
a([
  u()
], h.prototype, "_height", 2);
h = a([
  $("squircle-container")
], h);
export {
  h as SquircleContainer,
  _ as getSquirclePath
};
