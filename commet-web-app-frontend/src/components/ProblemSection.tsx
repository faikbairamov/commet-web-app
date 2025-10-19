import { Clock, Brain, Rocket } from "lucide-react";
const ProblemSection = () => {
  const problems = [
    {
      icon: Clock,
      title: "Time Waste",
      description:
        "Developers waste hours daily on context-switching, outdated docs, and slow onboarding.",
      stat: "10-15 min",
      statLabel: "lost per switch",
    },
    {
      icon: Brain,
      title: "Tribal Knowledge",
      description:
        "Critical information stays in heads, not shared. Documentation falls behind as code evolves.",
      stat: "87%",
      statLabel: "docs outdated in 6mo",
    },
    {
      icon: Rocket,
      title: "Slow Onboarding",
      description:
        "New team members struggle to understand codebase context and project architecture.",
      stat: "13x",
      statLabel: "context switches/day",
    },
  ];
  return (
    <section id="solutions" className="py-20 bg-background scroll-mt-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-white">
            The Problem We Solve
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {problems.map((problem, index) => (
            <div
              key={index}
              className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-all duration-300 animate-fade-in"
              style={{
                animationDelay: `${index * 0.1}s`,
              }}
            >
              <div className="flex items-center justify-center w-12 h-12 bg-destructive/20 rounded-lg mb-4">
                <problem.icon className="w-6 h-6 text-destructive" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">
                {problem.title}
              </h3>
              <p className="text-gray-200 mb-4">{problem.description}</p>
              <div className="mt-4 pt-4 border-t border-border">
                <div className="text-3xl font-bold text-destructive">
                  {problem.stat}
                </div>
                <div className="text-sm text-gray-300">{problem.statLabel}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
export default ProblemSection;
