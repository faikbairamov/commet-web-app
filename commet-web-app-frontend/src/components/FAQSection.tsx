import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
const FAQSection = () => {
  const faqs = [
    {
      question: "Do I need to pay for Commet?",
      answer:
        "Yes, after a 2-week free trial. Plans fit every need, from free for basics to enterprise. The Free tier is perfect for individual developers getting started, while Pro and Enterprise tiers unlock advanced features for teams.",
    },
    {
      question: "Does Commet send my code?",
      answer:
        "No—only minimal metadata. Your code stays local. We only send commit messages, file names, and comments to your chosen LLM. No proprietary code logic is ever shared, ensuring your intellectual property remains secure.",
    },
    {
      question: "How do I set up?",
      answer:
        "Install from VS Code Marketplace, add your OpenAI key. Done in 2 minutes. Simply search for 'Commet' in the VS Code extensions marketplace, install it, and follow the quick setup wizard to configure your AI provider.",
    },
    {
      question: "Can I use it offline?",
      answer:
        "Not yet, but local LLM support is on the roadmap. We're actively working on enabling offline functionality with local language models to support developers in air-gapped environments or those who prefer complete data sovereignty.",
    },
  ];
  return (
    <section id="faq" className="py-20 bg-muted/30 scroll-mt-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold mb-4 text-white">
            FAQ
          </h2>
          <p className="text-xl text-gray-200 max-w-2xl mx-auto">
            Common questions about Commet
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-card border border-border rounded-xl px-6 overflow-hidden"
              >
                <AccordionTrigger className="text-left hover:no-underline py-6">
                  <span className="font-semibold text-lg text-white">
                    {faq.question}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-gray-200 pb-6">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="text-center mt-8"></div>
        </div>
      </div>
    </section>
  );
};
export default FAQSection;
