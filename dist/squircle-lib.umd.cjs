(function(s,o){typeof exports=="object"&&typeof module<"u"?o(exports,require("lit"),require("lit/decorators.js")):typeof define=="function"&&define.amd?define(["exports","lit","lit/decorators.js"],o):(s=typeof globalThis<"u"?globalThis:s||self,o(s.SquircleLib={},s.Lit,s.decorators_js))})(this,function(s,o,c){"use strict";function u(d){const{width:e,height:i,radius:n,smoothness:h}=d;if(e===0||i===0)return"";const l=Math.min(e,i)/2;let t=0;n==="max"?t=l:t=Math.min(Number(n)||0,l),t<0&&(t=0);const p=.5522847498,g=p+h*(1-p),r=t*g;return`
    M ${t}, 0
    L ${e-t}, 0
    C ${e-t+r}, 0, ${e}, ${t-r}, ${e}, ${t}
    L ${e}, ${i-t}
    C ${e}, ${i-t+r}, ${e-t+r}, ${i}, ${e-t}, ${i}
    L ${t}, ${i}
    C ${t-r}, ${i}, 0, ${i-t+r}, 0, ${i-t}
    L 0, ${t}
    C 0, ${t-r}, ${t-r}, 0, ${t}, 0
    Z
  `}var f=Object.defineProperty,m=Object.getOwnPropertyDescriptor,a=(d,e,i,n)=>{for(var h=n>1?void 0:n?m(e,i):e,l=d.length-1,t;l>=0;l--)(t=d[l])&&(h=(n?t(e,i,h):t(h))||h);return n&&h&&f(e,i,h),h};s.SquircleContainer=class extends o.LitElement{constructor(){super(...arguments),this.radius="20",this.smooth=.6,this._width=0,this._height=0,this._clipId=`sq-${Math.random().toString(36).substring(2,9)}`,this._resizeObserver=null}connectedCallback(){super.connectedCallback(),this._width=this.offsetWidth,this._height=this.offsetHeight,this._resizeObserver=new ResizeObserver(e=>{for(const i of e){const n=i.contentRect;(n.width!==this._width||n.height!==this._height)&&(this._width=n.width,this._height=n.height)}}),this._resizeObserver.observe(this)}disconnectedCallback(){var e;super.disconnectedCallback(),(e=this._resizeObserver)==null||e.disconnect()}render(){const e=this._width===0||this._height===0?"":u({width:this._width,height:this._height,radius:this.radius==="max"?"max":parseFloat(this.radius),smoothness:this.smooth}),i=e?`clip-path: url(#${this._clipId});`:"";return o.html`
			<div class="clipper" style="${i}">
				<slot></slot>
			</div>

			<svg aria-hidden="true">
				<defs>
					<clipPath id="${this._clipId}">
						<path d="${e}"></path>
					</clipPath>
				</defs>
			</svg>
		`}},s.SquircleContainer.styles=o.css`
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
	`,a([c.property({type:String})],s.SquircleContainer.prototype,"radius",2),a([c.property({type:Number})],s.SquircleContainer.prototype,"smooth",2),a([c.state()],s.SquircleContainer.prototype,"_width",2),a([c.state()],s.SquircleContainer.prototype,"_height",2),s.SquircleContainer=a([c.customElement("squircle-container")],s.SquircleContainer),s.getSquirclePath=u,Object.defineProperty(s,Symbol.toStringTag,{value:"Module"})});
