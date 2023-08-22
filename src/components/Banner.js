import React from "react";

import myPicture from "../assets/avatar.png";
import { FaGithub, FaYoutube, FaLinkedin } from "react-icons/fa";
import { TypeAnimation } from "react-type-animation";
import { motion } from "framer-motion";
import { fadeIn } from "../variants";
import { Link } from "react-scroll";

const Banner = () => {
  return (
    <section
      className="min-h-[85vh] lg:min-h-[78vh] flex items-center"
      id="home"
    >
      <div className="mx-auto container">
        <div className="flex flex-col gap-y-8 lg:flex-row lg:items-center gap-x-12">
          <div className="flex-1 text-center font-secondary lg:text-left">
            <motion.h1
              variants={fadeIn("up", 0.3)}
              initial="hidden"
              whileInView={"show"}
              viewport={{ once: false, amount: 0.7 }}
              className="text-[55px] font-bold leading-[0.8] lg:text-[110px]"
            >
              Mario <span>Nassar</span>
            </motion.h1>
            <motion.div
              variants={fadeIn("up", 0.4)}
              initial="hidden"
              whileInView={"show"}
              viewport={{ once: false, amount: 0.7 }}
              className="mb-6 text-[36px] lg:text-[55px] font-secondary font-semibold uppercase leading-[1]"
            >
              <span className="mr-3 text-white">I am a</span>
              <TypeAnimation
                sequence={[
                  "Mobile Developer",
                  2000,
                  "Web Developer",
                  2000,
                  "IT Specialist",
                  2000,
                ]}
                speed={50}
                className="text-red-600"
                wrapper="span"
                repeat={Infinity}
              />
            </motion.div>
            <motion.p
              variants={fadeIn("up", 0.5)}
              initial="hidden"
              whileInView={"show"}
              viewport={{ once: false, amount: 0.7 }}
              className="mb-8 max-w-lg mx-auto lg:mx-0"
            >
              Passionate developer dedicated to crafting exceptional digital
              solutions with innovative and creative approaches.
            </motion.p>
            <motion.div
              variants={fadeIn("up", 0.6)}
              initial="hidden"
              whileInView={"show"}
              viewport={{ once: false, amount: 0.7 }}
              className="flex max-w-max gap-x-6 items-center mb-12 mx-auto lg:mx-0"
            >
              <Link to="contact">
                <button className="btn btn-lg">Contact me</button>
              </Link>
              <a download="../assets/My_Updated_Resume.docx" className="text-gradient btn-link">
                My portfolio
              </a>
            </motion.div>
            <motion.div
              variants={fadeIn("up", 0.7)}
              initial="hidden"
              whileInView={"show"}
              viewport={{ once: false, amount: 0.7 }}
              className="flex text-[20px] gap-x-6 max-w-max mx-auto lg:mx-0"
            >
              <a href="#">
                <FaYoutube />
              </a>
              <a href="#">
                <FaGithub />
              </a>
              <a href="#">
                <FaLinkedin />
              </a>
            </motion.div>
          </div>

          <motion.div
            variants={fadeIn("down", 0.5)}
            initial="hidden"
            whileInView={"show"}
            className="hidden lg:flex flex-1 max-w-[350px] lg:max-w-[482px]"
          >
            <img className="" src={myPicture} alt="" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Banner;
