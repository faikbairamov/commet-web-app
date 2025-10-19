import { TrendingUp, Users, FileText } from "lucide-react";

const MarketSection = () => {
  const stats = [
    {
      icon: TrendingUp,
      number: "$50B+",
      label: "Developer Tooling Market",
      description: "AI is transforming productivity",
    },
    {
      icon: FileText,
      number: "87%",
      label: "Docs Outdated in 6 Months",
      description: "Manual documentation fails",
    },
    {
      icon: Users,
      number: "100M+",
      label: "Developers Worldwide",
      description: "Empowering with cutting-edge AI",
    },
  ];

  return (
    <section className="py-20 bg-background relative overflow-hidden">
      <div className="absolute inset-0 gradient-radial opacity-30"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-white">
            Market Opportunity
          </h2>
          <p className="text-xl text-gray-200 max-w-3xl mx-auto">
            We're at the forefront of AI-powered developer productivity,
            addressing critical pain points that cost developers hours every
            day.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-card border border-primary/30 rounded-xl p-8 text-center hover:border-primary/50 transition-all duration-300 animate-scale-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4 mx-auto">
                <stat.icon className="w-8 h-8 text-primary" />
              </div>
              <div className="text-5xl font-bold text-gradient mb-2">
                {stat.number}
              </div>
              <div className="text-lg font-semibold mb-2 text-white">
                {stat.label}
              </div>
              <p className="text-gray-200">{stat.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-lg text-gray-200 max-w-2xl mx-auto">
            Developers switch contexts{" "}
            <span className="text-primary font-bold">13x per day</span>, losing{" "}
            <span className="text-primary font-bold">10-15 minutes</span> each
            time. Commet eliminates this productivity tax.
          </p>
        </div>
      </div>
    </section>
  );
};

export default MarketSection;
