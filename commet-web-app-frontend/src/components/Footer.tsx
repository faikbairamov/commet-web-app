import { Github, Twitter, MessageSquare, Heart } from "lucide-react";

const Footer = () => {
  const links = [
    { label: "Privacy Policy", href: "https://commet.dev/privacy" },
    { label: "Terms of Service", href: "https://commet.dev/terms" },
    { label: "Contact", href: "mailto:support@commet.dev" },
  ];

  const socialLinks = [
    { icon: Github, href: "https://github.com/commet", label: "GitHub" },
    { icon: Twitter, href: "https://twitter.com/commetcode", label: "Twitter" },
    {
      icon: MessageSquare,
      href: "https://discord.commet.dev",
      label: "Discord",
    },
  ];

  return (
    <footer className="bg-muted/30 border-t border-border/40 py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Github className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold text-gradient">Commet</span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              The ultimate GitHub repository analysis platform. Explore commits,
              analyze code, and get AI-powered insights.
            </p>
          </div>

          {/* Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Resources</h3>
            <div className="space-y-2">
              {links.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="block text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Social */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Connect</h3>
            <div className="flex items-center space-x-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center bg-card border border-border/30 rounded-lg hover:border-primary/50 hover:bg-primary/10 transition-all duration-200 hover-lift"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5 text-muted-foreground hover:text-primary transition-colors duration-200" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-border/40">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <span>© 2025 Commet. Made with</span>
              <Heart className="h-4 w-4 text-red-500" />
              <span>for developers.</span>
            </div>
            <div className="text-sm text-muted-foreground">
              Built with React, TypeScript, and Tailwind CSS
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
