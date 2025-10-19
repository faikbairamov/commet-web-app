import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const PricingSection = () => {
  const plans = [
    {
      name: "Free Tier",
      price: "$0",
      period: "month",
      description: "For individual developers",
      features: [
        "Basic session summaries",
        "Limited onboarding generations",
        "Core doc updates",
        "Open-source core access",
        "Community support",
      ],
      cta: "Get Started Free",
      ctaLink: "https://app.commet.dev/signup",
      highlighted: false,
    },
    {
      name: "Pro Tier",
      price: "$19",
      period: "user/month",
      description: "For small teams (2-10)",
      features: [
        "Unlimited generations",
        "Advanced AI customizations (coming soon)",
        "Priority support",
        "Team collaboration tools",
        "All Free features included",
      ],
      cta: "Start Free Trial",
      ctaLink: "https://app.commet.dev/signup",
      highlighted: true,
    },
    {
      name: "Enterprise Tier",
      price: "Custom",
      period: "contact sales",
      description: "For large organizations",
      features: [
        "Team analytics dashboard",
        "Custom LLM integrations",
        "On-prem deployment",
        "Dedicated support",
        "SLA guarantees",
      ],
      cta: "Contact Sales",
      ctaLink: "https://commet.dev/demo",
      highlighted: false,
    },
  ];

  return (
    <section id="pricing" className="py-20 bg-muted/30 scroll-mt-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-white">
            Pricing
          </h2>
          <p className="text-xl text-gray-200 max-w-2xl mx-auto">
            Start with a 2-week free trial. No credit card required.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`bg-card rounded-xl p-8 flex flex-col ${
                plan.highlighted
                  ? "border-2 border-primary shadow-lg shadow-primary/20 scale-105"
                  : "border border-border"
              } animate-fade-in`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {plan.highlighted && (
                <div className="text-center mb-4">
                  <span className="inline-block bg-primary text-primary-foreground text-sm font-semibold px-4 py-1 rounded-full">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2 text-white">
                  {plan.name}
                </h3>
                <div className="mb-2">
                  <span className="text-5xl font-bold text-white">
                    {plan.price}
                  </span>
                  {plan.price !== "Custom" && (
                    <span className="text-gray-300">/{plan.period}</span>
                  )}
                </div>
                <p className="text-gray-200">{plan.description}</p>
              </div>

              <ul className="space-y-4 mb-8 flex-grow">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start">
                    <div className="flex items-center justify-center w-5 h-5 bg-primary/20 rounded-full mr-3 mt-0.5">
                      <Check className="w-3 h-3 text-primary" />
                    </div>
                    <span className="text-gray-200">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                className={plan.highlighted ? "glow-hover" : ""}
                variant={plan.highlighted ? "default" : "outline"}
                size="lg"
                asChild
              >
                <a
                  href={plan.ctaLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {plan.cta}
                </a>
              </Button>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-200 max-w-2xl mx-auto">
            All plans include open-source core, privacy guarantees, and
            community access. Commercial use supported on paid plans.
          </p>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
