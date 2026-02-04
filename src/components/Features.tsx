import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { 
  Smartphone, 
  Zap, 
  Shield, 
  Cloud, 
  CreditCard, 
  MapPin 
} from "lucide-react";

const features = [
  {
    icon: Smartphone,
    title: "One Tap Printing",
    description: "Simply tap your phone on our kiosk and your document prints instantly. No apps, no complications.",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "High-speed printing technology delivers your documents in seconds, not minutes.",
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description: "Your documents are encrypted and automatically deleted after printing. Your privacy matters.",
  },
  {
    icon: Cloud,
    title: "Cloud Connected",
    description: "Print directly from Google Drive, Dropbox, or any cloud storage with seamless integration.",
  },
  {
    icon: CreditCard,
    title: "Easy Payment",
    description: "Pay per page with cards, UPI, or digital wallets. No cash, no change, no hassle.",
  },
  {
    icon: MapPin,
    title: "Everywhere You Need",
    description: "Find kiosks at malls, colleges, offices, and transit hubs. Printing is always nearby.",
  },
];

const FeatureCard = ({ feature, index }: { feature: typeof features[0]; index: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group"
    >
      <div className="glass-card p-6 lg:p-8 h-full transition-all duration-300 hover:border-accent/50 hover:shadow-lg">
        {/* Icon */}
        <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center mb-6 group-hover:bg-accent/20 transition-colors">
          <feature.icon className="w-7 h-7 text-accent" />
        </div>

        {/* Content */}
        <h3 className="font-display text-xl font-bold text-foreground mb-3">
          {feature.title}
        </h3>
        <p className="text-muted-foreground leading-relaxed">
          {feature.description}
        </p>
      </div>
    </motion.div>
  );
};

const Features = () => {
  const headerRef = useRef(null);
  const isHeaderInView = useInView(headerRef, { once: true, margin: "-100px" });

  return (
    <section id="features" className="py-24 lg:py-32 relative">
      {/* Background */}
      <div className="absolute inset-0 bg-secondary/50" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 30 }}
          animate={isHeaderInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16 lg:mb-20"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
            Why OneTap Print?
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Smart Printing, <span className="text-gradient">Simplified</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            We're building the future of document printing with innovative technology that puts convenience first.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={feature.title} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
