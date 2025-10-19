import { PlayCircle, BookOpen, FileText, Plug } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const CoreFunctionalitiesSection = () => {
  const functionalities = [
    {
      id: "resume",
      icon: PlayCircle,
      title: "Resume Work Instantly",
      description:
        "Never lose context. AI analyzes uncommitted changes and recent commits to reconstruct your mental state. One command (Ctrl+Shift+D) and you're back in flow.",
      features: [
        "Analyzes git history and uncommitted changes",
        "Reconstructs your mental state in seconds",
        "One-command workflow restoration",
      ],
    },
    {
      id: "onboarding",
      icon: BookOpen,
      title: "10x Faster Onboarding",
      description:
        "Transform weeks into hours. Auto-generate comprehensive project guides from your actual codebase, including architecture, key files, and setup steps.",
      features: [
        "Comprehensive project guides from codebase",
        "Architecture overview and key files",
        "Step-by-step setup instructions",
      ],
    },
    {
      id: "documentation",
      icon: FileText,
      title: "Living Documentation",
      description:
        "Keep README and docs current automatically. Commet scans your codebase and regenerates as it evolves—always accurate, always useful.",
      features: [
        "Automatic documentation updates",
        "Scans codebase for changes",
        "Always accurate and current",
      ],
    },
    {
      id: "integration",
      icon: Plug,
      title: "Seamless Integration",
      description:
        "Works with your existing VS Code setup. Supports OpenAI GPT-4o-mini (with Claude and local models coming soon). Free for individuals; scales to teams.",
      features: [
        "VS Code native integration",
        "OpenAI GPT-4o-mini support (more models coming)",
        "Scales from individual to team",
      ],
    },
  ];

  return (
    <section id="features" className="py-20 bg-background scroll-mt-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-white">
            Core Functionalities
          </h2>
          <p className="text-xl text-gray-200 max-w-3xl mx-auto">
            Everything you need to maintain context and accelerate your
            development workflow.
          </p>
        </div>

        <Tabs defaultValue="resume" className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 mb-12">
            {functionalities.map((func) => (
              <TabsTrigger
                key={func.id}
                value={func.id}
                className="flex items-center gap-2"
              >
                <func.icon className="w-4 h-4" />
                <span className="hidden sm:inline">
                  {func.title.split(" ")[0]}
                </span>
              </TabsTrigger>
            ))}
          </TabsList>

          {functionalities.map((func) => (
            <TabsContent
              key={func.id}
              value={func.id}
              className="animate-fade-in"
            >
              <div className="bg-card border border-border rounded-xl p-8 lg:p-12">
                <div className="grid lg:grid-cols-2 gap-8 items-center">
                  <div>
                    <div className="flex items-center justify-center w-16 h-16 bg-primary/10 rounded-xl mb-6">
                      <func.icon className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-3xl font-bold mb-4 text-white">
                      {func.title}
                    </h3>
                    <p className="text-lg text-gray-200 mb-6">
                      {func.description}
                    </p>
                    <ul className="space-y-3">
                      {func.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full mr-3 mt-2"></div>
                          <span className="text-gray-200">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-muted/30 rounded-xl p-6 lg:p-8 border border-border">
                    <div className="aspect-video bg-background/50 rounded-lg flex items-center justify-center">
                      <func.icon className="w-24 h-24 text-primary/30" />
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  );
};

export default CoreFunctionalitiesSection;
