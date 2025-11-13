export default function Features() {
  const features = [
    {
      title: "Transparens som standard",
      description: "Komplett spårbarhet från mottagning till godkännande. Varje steg loggas automatiskt för intern kontroll och revision."
    },
    {
      title: "Förklarande AI",
      description: "Varje konteringsförslag visas med förklaring och alternativa val. Besluten blir begripliga och granskningsbara."
    },
    {
      title: "Människa i loopen",
      description: "Användaren har alltid sista ordet. Alla justeringar registreras och förbättrar systemet över tid."
    },
    {
      title: "Hybrid intelligens",
      description: "Kombinerar maskininlärning med redovisnings- och avtalsregler för tillförlitliga resultat."
    }
  ];

  return (
    <div className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="p-6 border border-gray-200 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
