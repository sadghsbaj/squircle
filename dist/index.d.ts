import { CSSResult } from 'lit';
import { LitElement } from 'lit';
import { TemplateResult } from 'lit';

/**
 * Calculates the SVG path data ('d' attribute) for a squircle shape
 * based on the provided dimensions and curvature parameters.
 *
 * Uses cubic Bezier curves to approximate the superellipse.
 */
export declare function getSquirclePath(params: SquircleParams): string;

/**
 * A container component that clips its content into a squircle shape.
 * Usage: <squircle-container radius="20" smooth="0.6">...</squircle-container>
 */
export declare class SquircleContainer extends LitElement {
    /** The corner radius in pixels or "max" for a pill/circle shape. */
    radius: string;
    /** Defines the curvature smoothness. 0 = Circle, 1 = Square-like. */
    smooth: number;
    private _width;
    private _height;
    private _clipId;
    private _resizeObserver;
    static styles: CSSResult;
    connectedCallback(): void;
    disconnectedCallback(): void;
    render(): TemplateResult<1>;
}

export declare type SquircleParams = {
    width: number;
    height: number;
    radius: number | "max";
    smoothness: number;
};

export { }


declare global {
    interface HTMLElementTagNameMap {
        "squircle-container": SquircleContainer;
    }
}

