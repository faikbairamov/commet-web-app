import { Button } from "@/components/ui/button";
import { Download, Calendar } from "lucide-react";

const CTASection = () => {
  return (
    <section
      id="demo"
      className="py-20 bg-background relative overflow-hidden scroll-mt-24"
    >
      <div className="absolute inset-0 gradient-cosmic opacity-40"></div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-white">
            Ready to Automate Your Memory?
          </h2>
          <p className="text-xl text-gray-200 mb-8">
            Download Commet and transform your development workflow today.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="glow-hover text-lg px-8" asChild>
              <a
                href="https://marketplace.visualstudio.com/items?itemName=commet.commet-vscode"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Download className="mr-2 h-5 w-5" />
                Download for Free
              </a>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 border-white/80 hover:border-white text-white hover:text-white bg-transparent hover:bg-white/10"
              asChild
            >
              <a href="https://commet.dev/demo">
                <Calendar className="mr-2 h-5 w-5" />
                Request Demo
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
