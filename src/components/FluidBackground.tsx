// Site backdrop: flat void with a faint film grain. Deliberately no colour —
// the accent is reserved for content and the StepWitness rule.
// (Previously a 120%-viewport purple/orange mesh with a 60px blur animated
// forever, which was off-system and expensive to composite.)
export default function FluidBackground() {
  return (
    <div className="fixed inset-0 -z-10 bg-gradus-primary" aria-hidden="true">
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.6' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}
