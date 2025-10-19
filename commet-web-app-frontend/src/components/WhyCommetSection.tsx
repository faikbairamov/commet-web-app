import { Cpu, Settings, Lock, Users } from "lucide-react";

const WhyCommetSection = () => {
  const features = [
    {
      icon: Cpu,
      title: "Powered by AI, Built for Developers",
      description:
        "Uses advanced AI models like GPT-4o-mini for intelligent summarization, understanding code structure and git workflows.",
    },
    {
      icon: Settings,
      title: "Zero Maintenance",
      description: "Set it once, forget it exists, get value every day.",
    },
    {
      icon: Lock,
      title: "Privacy-Focused",
      description:
        "Only sends minimal context (commit messages, file names, comments) to your chosen LLM. No proprietary code logic shared.",
    },
    {
      icon: Users,
      title: "Open Source & Community-Driven",
      description: "Built by developers for developers. Contribute on GitHub.",
    },
  ];

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-white">
            Why Commet is Unique
          </h2>
          <p className="text-xl text-gray-200 max-w-3xl mx-auto">
            Commet is the only VS Code extension that combines git history
            analysis, AI-powered synthesis, and automatic documentation
            generation into a comprehensive developer memory system.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 group animate-scale-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center justify-center w-14 h-14 bg-primary/10 rounded-lg mb-4 group-hover:bg-primary/20 transition-colors">
                <feature.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-lg font-bold mb-2 text-white">
                {feature.title}
              </h3>
              <p className="text-gray-200 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-lg text-gray-200 max-w-2xl mx-auto">
            Unlike generic AI tools,{" "}
            <span className="text-primary font-semibold">
              Commet integrates deeply with your git workflow
            </span>
            — no new processes required.
          </p>
        </div>
      </div>
    </section>
  );
};

export default WhyCommetSection;
