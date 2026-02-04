import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Mail, Instagram, Send, ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const Contact = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubmitted(true);
      toast.success("You're on the list! We'll be in touch soon.");
      setEmail("");
      setTimeout(() => setIsSubmitted(false), 3000);
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      label: "Email Us",
      value: "onetapprint@gmail.com",
      href: "mailto:onetapprint@gmail.com",
    },
    {
      icon: Instagram,
      label: "Follow Us",
      value: "@onetapprint",
      href: "https://instagram.com/onetapprint",
    },
  ];

  return (
    <section id="contact" className="py-24 lg:py-32 relative">
      {/* Background */}
      <div className="absolute inset-0 hero-gradient opacity-[0.03]" />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
              Get in Touch
            </span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
              Be the First to Know
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join our waitlist to get early access and exclusive updates about our launch. We're excited to have you on this journey!
            </p>
          </div>

          {/* Waitlist Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="glass-card p-8 lg:p-12 mb-12"
          >
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
              <div className="flex-1 relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-12 h-14 text-lg rounded-xl border-border bg-background"
                  required
                />
              </div>
              <Button
                type="submit"
                size="lg"
                disabled={isSubmitted}
                className="h-14 px-8 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold text-lg rounded-xl"
              >
                {isSubmitted ? (
                  <>
                    <Check className="w-5 h-5 mr-2" />
                    Joined!
                  </>
                ) : (
                  <>
                    Join Waitlist
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </Button>
            </form>
            <p className="text-sm text-muted-foreground text-center mt-4">
              No spam, ever. We respect your inbox.
            </p>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="grid sm:grid-cols-2 gap-6"
          >
            {contactInfo.map((item) => (
              <a
                key={item.label}
                href={item.href}
                target={item.href.startsWith("http") ? "_blank" : undefined}
                rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="glass-card p-6 flex items-center gap-4 group hover:border-accent/50 transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                  <item.icon className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{item.label}</p>
                  <p className="font-display text-lg font-semibold text-foreground">
                    {item.value}
                  </p>
                </div>
                <Send className="w-5 h-5 text-muted-foreground ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;
