// src/core/math.ts

export type SquircleParams = {
	width: number;
	height: number;
	radius: number | "max";
	smoothness: number; // 0 (Circle) to 1 (Square-ish)
};

/**
 * Calculates the SVG path data ('d' attribute) for a squircle shape
 * based on the provided dimensions and curvature parameters.
 *
 * Uses cubic Bezier curves to approximate the superellipse.
 */
export function getSquirclePath(params: SquircleParams): string {
	const { width, height, radius, smoothness } = params;

	// Return empty path if dimensions are invalid to prevent rendering errors
	if (width === 0 || height === 0) return "";

	// 1. Calculate and clamp the radius
	const maxRadius = Math.min(width, height) / 2;
	let r = 0;

	if (radius === "max") {
		r = maxRadius;
	} else {
		// Clamp radius to ensure it doesn't exceed half the shortest side
		r = Math.min(Number(radius) || 0, maxRadius);
	}

	// Ensure radius is non-negative
	if (r < 0) r = 0;

	// 2. Calculate Bezier handle length
	// The constant 0.55228... is the standard Kappa value for approximating a circle arc
	const k_circle = 0.5522847498;

	// Interpolate between a perfect circle and a tighter squircle curve
	// smoothness 0 -> factor ~0.55 (Circle)
	// smoothness 1 -> factor 1.0 (Hard squircle)
	const factor = k_circle + smoothness * (1 - k_circle);
	const handleLen = r * factor;

	// 3. Construct the Path (Clockwise: Top-Left start -> Right -> Bottom -> Left)
	return `
    M ${r}, 0
    L ${width - r}, 0
    C ${width - r + handleLen}, 0, ${width}, ${r - handleLen}, ${width}, ${r}
    L ${width}, ${height - r}
    C ${width}, ${height - r + handleLen}, ${width - r + handleLen}, ${height}, ${width - r}, ${height}
    L ${r}, ${height}
    C ${r - handleLen}, ${height}, 0, ${height - r + handleLen}, 0, ${height - r}
    L 0, ${r}
    C 0, ${r - handleLen}, ${r - handleLen}, 0, ${r}, 0
    Z
  `;
}
