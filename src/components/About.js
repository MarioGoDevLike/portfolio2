import React from "react";
import image from "../assets/computer.jpeg";
import { motion } from "framer-motion";
import { fadeIn } from "../variants";
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";
import { Link } from "react-scroll";


const About = () => {
  const [ref, inView] = useInView({ threshold: 0.5 });
  return (
    <section className="section" id="about" ref={ref}>
      <div className="container mx-auto">
        <div className="flex flex-col gap-y-10 lg:flex-row lg:items-center lg:gap-x-20 lg:gap-y-0 h-screen">
          <motion.div
            variants={fadeIn("left", 0.4)}
            initial="hidden"
            whileInView={"show"}
            viewport={{ once: false, amount: 0.3 }}
            className="hidden lg:flex flex-1  items-center"
          >
            <img className="h-[500px]" src={image} alt="" />
          </motion.div>
          <motion.div
            variants={fadeIn("right", 0.3)}
            initial="hidden"
            whileInView={"show"}
            viewport={{ once: false, amount: 0.3 }}
            className="flex-1"
          >
            <h2 className="h2 text-red-500">About me</h2>
            <h3 className="h3 mb-4">
              I'm a Freelance Front-end Developer with over 2 years of
              experience
            </h3>
            <p className="mb-6">
              I'm a passionate creator dedicated to crafting digital experiences
              that blend aesthetics with functionality. With a keen eye for
              design and a love for coding, I specialize in transforming ideas
              into captivating websites and applications. Let's collaborate and
              bring your vision to life!
            </p>
            <div className="flex gap-x-6 lg:gap-x-10 mb-12">
              <div>
                <div className="text-[40px] font-tertiary text-gradient mb-2">
                  {inView ? (
                    <CountUp start={0} end={1.5} decimals={true} duration={3} />
                  ) : null}
                </div>
                <div className="font-primary text-sm tracking-[2px]">
                  Years of <br />
                  Experience
                </div>
              </div>
              <div>
                <div className="text-[40px] font-tertiary text-gradient mb-2">
                  {inView ? <CountUp start={0} end={5} duration={3} /> : null}+
                </div>
                <div className="font-primary text-sm tracking-[2px]">
                  Projects <br />
                  Completed
                </div>
              </div>
              <div>
                <div className="text-[40px] font-tertiary text-gradient mb-2">
                  {inView ? <CountUp start={0} end={4} duration={3} /> : null}+
                </div>
                <div className="font-primary text-sm tracking-[2px]">
                  Satisfied <br />
                  Clients
                </div>
              </div>
            </div>
            <div className="flex gap-x-8 items-center">
              <Link to="services">
                <button className="btn btn-lg">What I do</button>
              </Link>
              <a download="../assets/My_Updated_Resume.docx" className="text-gradient btn-link">My Portfolio</a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
