import { Clock, TrendingUp, Zap, Shield } from "lucide-react";

const BenefitsSection = () => {
  const benefits = [
    {
      icon: Clock,
      benefit: "Time Savings",
      individual: "Save 15+ minutes daily on context recovery",
      teams: "Shared knowledge reduces questions",
      leads: "Faster reviews with auto-context",
    },
    {
      icon: TrendingUp,
      benefit: "Productivity Boost",
      individual: "Reduce mental load from multi-project switching",
      teams: "Onboard new hires in hours",
      leads: "Capture tribal knowledge automatically",
    },
    {
      icon: Zap,
      benefit: "Efficiency Gains",
      individual: "Zero-effort doc maintenance",
      teams: "Docs stay current without manual work",
      leads: "Scale teams without productivity dips",
    },
    {
      icon: Shield,
      benefit: "Reliability",
      individual: "Trustworthy summaries, no black boxes",
      teams: "Accessible project memory for all",
      leads: "Lower bus factor risk",
    },
  ];

  return (
    <section id="benefits" className="py-20 bg-muted/30 scroll-mt-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-white">
            Benefits for Your Workflow
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-card rounded-xl overflow-hidden">
            <thead>
              <tr className="bg-muted/50 border-b border-border">
                <th className="text-left p-4 font-bold text-lg text-white">
                  Benefit
                </th>
                <th className="text-left p-4 font-bold text-lg text-white">
                  For Individuals
                </th>
                <th className="text-left p-4 font-bold text-lg text-white">
                  For Teams
                </th>
                <th className="text-left p-4 font-bold text-lg text-white">
                  For Leads
                </th>
              </tr>
            </thead>
            <tbody>
              {benefits.map((benefit, index) => (
                <tr
                  key={index}
                  className="border-b border-border last:border-b-0 hover:bg-muted/20 transition-colors"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg">
                        <benefit.icon className="w-5 h-5 text-primary" />
                      </div>
                      <span className="font-semibold text-white">
                        {benefit.benefit}
                      </span>
                    </div>
                  </td>
                  <td className="p-4 text-gray-200">{benefit.individual}</td>
                  <td className="p-4 text-gray-200">{benefit.teams}</td>
                  <td className="p-4 text-gray-200">{benefit.leads}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
