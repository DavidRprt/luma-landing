/** Three soft glowing blobs (real-sized radial-gradient circles, blurred with filter: blur)
 * that drift along independent diamond-shaped paths and shimmer via hue-rotate, kept within
 * the brand's blue/teal/violet range. Shared between the homepage hero and any other page
 * that wants the same "aurora sky" treatment (e.g. the subscription page). */
const AuroraGlow = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <div
      className="absolute rounded-full"
      style={{
        width: "100vmax",
        height: "100vmax",
        transform: "translate(-50%, -50%)",
        background: "radial-gradient(circle, #3b82f6 0%, transparent 70%)",
        opacity: 0.55,
        mixBlendMode: "screen",
        animation: "luma-aurora-hue-1 20s linear infinite, luma-aurora-path-1 30s ease-in-out infinite",
        willChange: "top, left, filter",
      }}
    />
    <div
      className="absolute rounded-full"
      style={{
        width: "90vmax",
        height: "90vmax",
        transform: "translate(-50%, -50%)",
        background: "radial-gradient(circle, #2dd4bf 0%, transparent 70%)",
        opacity: 0.45,
        mixBlendMode: "screen",
        animation: "luma-aurora-hue-2 26s linear infinite, luma-aurora-path-2 38s ease-in-out infinite",
        willChange: "top, left, filter",
      }}
    />
    <div
      className="absolute rounded-full"
      style={{
        width: "85vmax",
        height: "85vmax",
        transform: "translate(-50%, -50%)",
        background: "radial-gradient(circle, #8b5cf6 0%, transparent 70%)",
        opacity: 0.38,
        mixBlendMode: "screen",
        animation: "luma-aurora-hue-3 32s linear infinite, luma-aurora-path-3 24s ease-in-out infinite",
        willChange: "top, left, filter",
      }}
    />
  </div>
);

export default AuroraGlow;
