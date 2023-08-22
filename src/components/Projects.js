import React from "react";
import { motion } from "framer-motion";
import { fadeIn } from "../variants";
import Img1 from "../assets/ello1.png";
import Img2 from "../assets/weatherProjectPic.png";
import Img3 from "../assets/travelmateProject.png";
import { Player } from "video-react";
import "video-react/dist/video-react.css";
import { Link } from "react-router-dom";
import { BsArrowLeft } from "react-icons/bs";

const Projects = () => {
  return (
    <section
      className="bg-site bg-no-repeat bg-cover overflow-scroll h-[170vh]"
      id="work"
    >
      <div className="container mx-auto">
        <div className="flex flex-col lg:flex-row gap-x-10">
          <div className="flex-1 flex flex-col gap-y-7 lg:mb-0">
            <div className="flex h-[13vh] items-center justify-start space-x-2">
              <a href="https://marionassar.vercel.app">
                <BsArrowLeft className="flex items-center" size={"40px"} />
              </a>
              <h2 className="flex justify-center mb-0 h2 leading-tight text-red-500">
                My Projects
              </h2>
            </div>
            <motion.a
              variants={fadeIn("left", 0.3)}
              initial="hidden"
              whileInView={"show"}
              viewport={{ once: false, amount: 0.3 }}
              href="https://ello.cafe"
              className="cursor-pointer group relative overflow-hidden border-[4px] border-black/50 rounded-xl"
            >
              <div className="group-hover:bg-black/70 w-full h-full absolute z-40 transition-all duration-300"></div>
              <img
                className="group-hover:scale-125 transition-all duration-500"
                src={Img1}
                alt=""
              />
              <div className="absolute -bottom-full left-12 group-hover:bottom-24 transition-all duration-500 z-50">
                <span className="font-semibold text-red-500">
                  Wordpress Website
                </span>
              </div>
              <div className="absolute -bottom-full left-12 group-hover:bottom-14 transition-all duration-700 z-50">
                <span className="font-semibold text-3xl text-white">
                  Ello Café
                </span>
              </div>
            </motion.a>
            <motion.a
              variants={fadeIn("left", 0.4)}
              initial="hidden"
              whileInView={"show"}
              viewport={{ once: false, amount: 0.3 }}
              href="https://csci390project.vercel.app/"
              className="group relative overflow-hidden lg:h-[295px] border-[4px] border-black/50 rounded-xl"
            >
              <div className="group-hover:bg-black/70 w-full h-full absolute z-40 transition-all duration-300"></div>
              <img
                className="group-hover:scale-125 transition-all duration-500"
                src={Img3}
                alt=""
              />
              <div className="absolute -bottom-full  left-12 group-hover:bottom-24 transition-all duration-500 z-50">
                <span className="font-semibold text-red-500">
                  University Project created by me
                </span>
              </div>
              <div className="absolute -bottom-full left-12 group-hover:bottom-14 transition-all duration-700 z-50">
                <span className="font-semibold text-3xl text-white">
                  TravelMate
                </span>
              </div>
            </motion.a>
          </div>
          <div className="flex-1 flex flex-col gap-y-7 lg:gap-y-10">
            <motion.a
              variants={fadeIn("right", 0.5)}
              initial="hidden"
              whileInView={"show"}
              viewport={{ once: false, amount: 0.3 }}
              href="https://weather-or-not-tan.vercel.app/"
              className="cursor-pointer mt-6 group relative overflow-hidden border-[4px] border-black/50 rounded-xl"
            >
              <div className="group-hover:bg-black/70 w-full h-full absolute z-40 transition-all duration-300"></div>
              <img
                className="group-hover:scale-125 transition-all duration-500"
                src={Img2}
                alt=""
              />
              <div className="absolute -bottom-full left-12 group-hover:bottom-24 transition-all duration-500 z-50">
                <span className="font-semibold text-red-500">
                  ReactJS Website
                </span>
              </div>
              <div className="absolute -bottom-full left-12 group-hover:bottom-14 transition-all duration-700 z-50">
                <span className="font-semibold text-3xl text-white">
                  Weather App
                </span>
              </div>
            </motion.a>
            <motion.div
              variants={fadeIn("right", 0.6)}
              initial="hidden"
              whileInView={"show"}
              viewport={{ once: false, amount: 0.3 }}
              className="group relative overflow-hidden lg:h-[300px] border-[4px] border-black/50 rounded-xl"
            >
              <div className="group-hover:bg-black/70 w-full h-full absolute z-40 transition-all duration-300"></div>
              <Player
                autoPlay
                muted
                playsInline
                src="https://dms-exp3.licdn.com/playlist/vid/D4E05AQFoZEAfsxt4Jg/mp4-720p-30fp-crf28/0/1687810398472?e=1693299600&v=beta&t=C2O6wiAfD5IOf9azlj9X9ULlHwK5QZuZb3Sk7WRduWc"
              />
              <div className="absolute -bottom-full  left-12 group-hover:bottom-24 transition-all duration-500 z-50">
                <span className="font-semibold text-red-500">
                  Flutter Mobile Application
                </span>
              </div>
              <div className="absolute -bottom-full left-12 group-hover:bottom-14 transition-all duration-700 z-50">
                <span className="font-semibold text-3xl text-white">
                  Music App
                </span>
              </div>
            </motion.div>
            <motion.div
              variants={fadeIn("right", 0.7)}
              initial="hidden"
              whileInView={"show"}
              viewport={{ once: false, amount: 0.3 }}
              className="group relative overflow-hidden lg:h-[300px] border-[4px] border-black/50 rounded-xl"
            >
              <div className="group-hover:bg-black/70 w-full h-full absolute z-40 transition-all duration-300"></div>
              <Player
                autoPlay
                muted
                playsInline
                src="https://dms-exp3.licdn.com/playlist/vid/D4E05AQFlGD76Y4nEZw/mp4-720p-30fp-crf28/0/1690888407608?e=1693299600&v=beta&t=tRKHgibABRQPW9eeuCDTyl__skUklYgoAQr5kMHiSFI"
              />
              <div className="absolute -bottom-full  left-12 group-hover:bottom-24 transition-all duration-500 z-50">
                <span className="font-semibold text-red-500">
                  Android Mobile Application
                </span>
              </div>
              <div className="absolute -bottom-full left-12 group-hover:bottom-14 transition-all duration-700 z-50">
                <span className="font-semibold text-3xl text-white">
                  Weather App
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Projects;
