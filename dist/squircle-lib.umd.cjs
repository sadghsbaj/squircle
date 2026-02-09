(function(i,o){typeof exports=="object"&&typeof module<"u"?o(exports,require("lit"),require("lit/decorators.js")):typeof define=="function"&&define.amd?define(["exports","lit","lit/decorators.js"],o):(i=typeof globalThis<"u"?globalThis:i||self,o(i.SquircleLib={},i.Lit,i.LitDecorators))})(this,(function(i,o,c){"use strict";function d(u){const{width:e,height:n,radius:s,smoothness:r}=u;if(e===0||n===0)return"";const l=Math.min(e,n)/2;let t=0;s==="max"?t=l:t=Math.min(Number(s)||0,l),t<0&&(t=0);const p=.5522847498,g=p+r*(1-p),h=t*g;return`
    M ${t}, 0
    L ${e-t}, 0
    C ${e-t+h}, 0, ${e}, ${t-h}, ${e}, ${t}
    L ${e}, ${n-t}
    C ${e}, ${n-t+h}, ${e-t+h}, ${n}, ${e-t}, ${n}
    L ${t}, ${n}
    C ${t-h}, ${n}, 0, ${n-t+h}, 0, ${n-t}
    L 0, ${t}
    C 0, ${t-h}, ${t-h}, 0, ${t}, 0
    Z
  `}var f=Object.defineProperty,m=Object.getOwnPropertyDescriptor,a=(u,e,n,s)=>{for(var r=s>1?void 0:s?m(e,n):e,l=u.length-1,t;l>=0;l--)(t=u[l])&&(r=(s?t(e,n,r):t(r))||r);return s&&r&&f(e,n,r),r};i.SquircleContainer=class extends o.LitElement{constructor(){super(...arguments),this.radius="20",this.smooth=.6,this._width=0,this._height=0,this._clipId=`sq-${Math.random().toString(36).substring(2,9)}`,this._resizeObserver=null}connectedCallback(){super.connectedCallback(),requestAnimationFrame(()=>{this._resizeObserver=new ResizeObserver(e=>{for(const n of e){const s=n.contentRect;(s.width!==this._width||s.height!==this._height)&&(this._width=s.width,this._height=s.height)}}),this._resizeObserver.observe(this)})}disconnectedCallback(){super.disconnectedCallback(),this._resizeObserver?.disconnect()}render(){if(this._width===0||this._height===0)return o.html`<div class="clipper"><slot></slot></div>`;const e=d({width:this._width,height:this._height,radius:this.radius==="max"?"max":parseFloat(this.radius),smoothness:this.smooth});return o.html`
			<div class="clipper" style="clip-path: url(#${this._clipId});">
				<slot></slot>
			</div>

			<svg aria-hidden="true">
				<defs>
					<clipPath id="${this._clipId}">
						<path d="${e}"></path>
					</clipPath>
				</defs>
			</svg>
		`}},i.SquircleContainer.styles=o.css`
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
	`,a([c.property({type:String})],i.SquircleContainer.prototype,"radius",2),a([c.property({type:Number})],i.SquircleContainer.prototype,"smooth",2),a([c.state()],i.SquircleContainer.prototype,"_width",2),a([c.state()],i.SquircleContainer.prototype,"_height",2),i.SquircleContainer=a([c.customElement("squircle-container")],i.SquircleContainer),i.getSquirclePath=d,Object.defineProperty(i,Symbol.toStringTag,{value:"Module"})}));
