import React from "react";
import { BsArrowUpRight } from "react-icons/bs";
import { motion } from "framer-motion";
import { fadeIn } from "../variants";

const service = [
  {
    name: "Mobile App Developper",
    description:
      "I'm a versatile Mobile App Developer skilled in Flutter for cross-platform excellence, along with a solid grasp of React Native. I also bring a native touch through Android Studio for platform-specific finesse.",
  },
  {
    name: "Web Developer",
    description:
      "As a ReactJS web developer, I thrive on transforming intricate concepts into elegant, interactive web interfaces. Additionally, with experience as a WordPress web developer, I'm adept at creating versatile and user-friendly websites, utilizing WordPress's robust CMS capabilities.",
  },
  // {
  //   name: "",
  //   description: "",
  // },
];

const Services = () => {
  return (
    <section className="section" id="services">
      <div className="container mx-auto">
        <div className="flex flex-col lg:flex-row">
          {/* lg:bg-services */}
          <motion.div
            variants={fadeIn("right", 0.3)}
            initial="hidden"
            whileInView={"show"}
            viewport={{ once: false, amount: 0.3 }}
            className="flex-1 lg:bg-bottom bg-no-repeat mix-blend-lighten mb-12 mr-10  lg:mb-0"
          >
            <h2 className="h2 text-red-500">What I Do.</h2>
            <h3 className="h3 max-w-[455px] mb-16">
              I create cross-platform mobile apps and user-friendly websites
              with versatility.
            </h3>
            <button className="btn btn-sm">See my work</button>
          </motion.div>
          <motion.div
            variants={fadeIn("left", 0.5)}
            initial="hidden"
            whileInView={"show"}
            viewport={{ once: false, amount: 0.3 }}
            className="flex-1"
          >
            <div>
              {service.map((service, index) => {
                const { name, description, link } = service;
                return (
                  <div className=" h-[200px] " key={index}>
                    <div className="max-w-[406px]">
                      <h4 className="text-[20px] tracking-wider font-primary font-semibold mb-6">
                        {name}
                      </h4>
                      <p className="border-b border-white/20 flex font-secondary leading-tight pb-5">
                        {description}
                      </p>
                    </div>
                    <div>{link}</div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Services;
