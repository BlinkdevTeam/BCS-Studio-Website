import Image from "next/image";

const SERVICES = [
  {
    title: "Portraits",
    image: "/assets/services/portrait.webp",
  },
  {
    title: "Studio Rental",
    image: "/assets/services/studio.webp",
  },
  {
    title: "Event Coverage",
    image: "/assets/services/event.webp",
  },
];

export default function ServicesSection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Our Services</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {SERVICES.map((service) => (
            <div
              key={service.title}
              className="bg-white shadow-lg rounded-lg overflow-hidden hover:scale-105 transition-transform"
            >
              <Image
                src={service.image}
                alt={service.title}
                width={400}
                height={300}
                className="w-full h-64 object-cover"
              />
              <div className="p-6 text-center">
                <h3 className="text-xl font-semibold">{service.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
