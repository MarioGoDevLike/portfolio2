import React from "react";
import { motion } from "framer-motion";
import { fadeIn } from "../variants";
import Img1 from "../assets/ello1.png";
import Img2 from "../assets/weatherProjectPic.png";
import { Player } from "video-react";
import "video-react/dist/video-react.css";
import { Link } from "react-router-dom";

const Work = () => {
  return (
    <section className="section" id="work">
      <div className="container mx-auto">
        <div className="flex flex-col lg:flex-row gap-x-10">
          <motion.div
            variants={fadeIn("right", 0.3)}
            initial="hidden"
            whileInView={"show"}
            viewport={{ once: false, amount: 0.3 }}
            className="flex-1 flex flex-col gap-y-7 lg:mb-0"
          >
            <div>
              <h2 className="h2 leading-tight text-red-500">
                My Latest <br />
                Work.
              </h2>
              <p className="max-w-xl mb-5">
                From crafting visually stunning websites to developing
                cutting-edge mobile applications, my latest work exemplifies my
                commitment to excellence. Through meticulous attention to detail
                and a flair for aesthetics, I've woven together a collection
                that not only resonates with modern design trends but also
                provides seamless functionality.
              </p>

              <Link to="/projects">
                <button className="btn btn-sm">View all projects</button>
              </Link>
            </div>
            <a
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
            </a>
            {/* <div className="group relative overflow-hidden lg:h-[330px] border-2 border-white/50 rounded-xl">
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
            </div> */}
          </motion.div>
          <motion.div
            variants={fadeIn("left", 0.2)}
            initial="hidden"
            whileInView={"show"}
            viewport={{ once: false, amount: 0.3 }}
            className="flex-1 flex flex-col gap-y-7 lg:gap-y-10"
          >
            <a
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
            </a>
            <div className="group relative overflow-hidden lg:h-[330px] border-[4px] border-black/50 rounded-xl">
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
            </div>
            {/* <div className="group relative overflow-hidden lg:h-[330px] border-2 border-white/50 rounded-xl">
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
            </div> */}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Work;
