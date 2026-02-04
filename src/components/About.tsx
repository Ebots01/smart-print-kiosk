import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Target, Lightbulb, Users } from "lucide-react";

const About = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const values = [
    {
      icon: Target,
      title: "Our Mission",
      description: "To make document printing accessible, affordable, and effortless for everyone, everywhere.",
    },
    {
      icon: Lightbulb,
      title: "Our Vision",
      description: "A world where printing a document is as simple as sending a text message.",
    },
    {
      icon: Users,
      title: "Our Promise",
      description: "We're committed to innovation, sustainability, and putting our users first in everything we do.",
    },
  ];

  return (
    <section id="about" className="py-24 lg:py-32 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-highlight/5 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <motion.div
            ref={ref}
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent text-sm font-medium mb-4">
              About Us
            </span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
              We're Reinventing
              <br />
              <span className="text-gradient">Document Printing</span>
            </h2>
            <div className="space-y-4 text-muted-foreground text-lg">
              <p>
                OneTap Print started with a simple frustration: why is printing a document still so complicated in 2025?
              </p>
              <p>
                We're a passionate team of tech enthusiasts and problem solvers on a mission to transform how people access printing services. Our smart kiosks combine cutting-edge technology with intuitive design to deliver an experience that's truly magical.
              </p>
              <p>
                As a new startup, we're driven by innovation and committed to building something that genuinely improves people's daily lives.
              </p>
            </div>
          </motion.div>

          {/* Values Cards */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                className="glass-card p-6 flex items-start gap-5"
              >
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <value.icon className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-foreground mb-2">
                    {value.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {value.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
