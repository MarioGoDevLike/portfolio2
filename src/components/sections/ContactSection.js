import React from "react";
import { motion } from "framer-motion";
import { BsArrowRight } from "react-icons/bs";
import { SITE } from "../../constants";
import AnimatedSection from "../ui/AnimatedSection";
import FormField from "../ui/FormField";
import SocialLinks from "../ui/SocialLinks";

const ContactSection = () => (
  <section className="section pb-28 md:pb-24 lg:pb-28" id="contact">
    <div className="container">
      <div className="divider mb-12 lg:mb-16" />

      <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
        <AnimatedSection direction="right" delay={0.2} className="flex-1">
          <span className="label">Get in touch</span>

          <h2 className="text-display-sm mb-7">
            Let's work
            <br />
            <span className="text-gradient">together.</span>
          </h2>

          <p className="text-body text-white/40 mb-10 max-w-[340px]">
            Have a project in mind? I'd love to hear about it. Send me a
            message and let's build something remarkable.
          </p>

          <a
            href={`mailto:${SITE.email}`}
            className="email-link link-hover flex items-center gap-2 mb-10"
          >
            {SITE.email}
            <BsArrowRight size={14} />
          </a>

          <SocialLinks />
        </AnimatedSection>

        <AnimatedSection
          as={motion.form}
          direction="left"
          delay={0.3}
          className="flex-1 flex flex-col gap-8"
          onSubmit={(event) => event.preventDefault()}
          noValidate
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            <FormField id="name" label="Name" placeholder="John Doe" />
            <FormField
              id="email"
              label="Email"
              type="email"
              placeholder="you@email.com"
            />
          </div>

          <FormField id="subject" label="Subject" placeholder="Project Inquiry" />

          <FormField
            id="message"
            label="Message"
            as="textarea"
            placeholder="Tell me about your project..."
          />

          <button type="submit" className="btn btn-primary self-start group">
            Send Message
            <BsArrowRight
              size={15}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </button>
        </AnimatedSection>
      </div>
    </div>
  </section>
);

export default ContactSection;
