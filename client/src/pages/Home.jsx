import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { useSelector } from "react-redux";
import { motion } from "motion/react";
import AuthModel from "../components/AuthModel";

import {
  BsRobot,
  BsMic,
  BsClock,
  BsBarChart,
  BsFileEarmarkText,
} from "react-icons/bs";
import { HiSparkles } from "react-icons/hi";
import { useNavigate } from "react-router-dom";

// Images
import hrImg from "../assets/HR.png";
import techImg from "../assets/tech.png";
import confidenceImg from "../assets/confi.png";
import creditImg from "../assets/credit.png";
import evalImg from "../assets/ai-ans.png";
import resumeImg from "../assets/resume.png";
import pdfImg from "../assets/pdf.png";
import analyticsImg from "../assets/history.png";
import Footer from "../components/Footer";

const Home = () => {
  const { userData } = useSelector((state) => state.user);
  const [showAuth, setShowAuth] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f3f3f3] flex flex-col">
      <Navbar />

      <div className="flex-1 px-4 sm:px-6 py-16 md:py-20">
        <div className="max-w-6xl mx-auto">

          {/* Hero */}
          <div className="flex justify-center mb-6">
            <div className="bg-white border border-gray-200 text-gray-600 text-xs sm:text-sm px-4 py-2 rounded-full flex items-center gap-2 shadow-sm">
              <HiSparkles
                size={16}
                className="text-green-600"
              />
              AI Powered Smart Interview Platform
            </div>
          </div>

          <div className="text-center mb-24 md:mb-32">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl sm:text-5xl md:text-6xl font-semibold leading-tight max-w-4xl mx-auto tracking-tight"
            >
              Practice Interviews with{" "}
              <span className="inline-block bg-green-100 text-green-600 px-4 sm:px-5 py-1 rounded-full mt-2">
                AI Intelligence
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              className="text-gray-500 mt-6 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed"
            >
              Role-based mock interviews with smart follow-ups, adaptive
              difficulty and real-time performance evaluation.
            </motion.p>

            <div className="flex flex-wrap justify-center gap-4 mt-10">
              <motion.button
                onClick={() => {
                  if (!userData) {
                    setShowAuth(true);
                    return;
                  }
                  navigate("/interview");
                }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="bg-black text-white px-8 sm:px-10 py-3 rounded-full hover:opacity-90 transition shadow-md"
              >
                Start Interview
              </motion.button>

              <motion.button
                onClick={() => {
                  if (!userData) {
                    setShowAuth(true);
                    return;
                  }
                  navigate("/history");
                }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="border border-gray-300 bg-white px-8 sm:px-10 py-3 rounded-full hover:bg-gray-100 transition shadow-sm"
              >
                View History
              </motion.button>
            </div>
          </div>

          {/* Interview Steps */}
          <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-6 mb-32">
            {[
              {
                icon: <BsRobot size={24} />,
                step: "STEP 1",
                title: "Role & Experience Selection",
                desc: "AI adjusts difficulty based on selected job role.",
              },
              {
                icon: <BsMic size={24} />,
                step: "STEP 2",
                title: "Smart Voice Interview",
                desc: "Dynamic follow-up questions based on your answers.",
              },
              {
                icon: <BsClock size={24} />,
                step: "STEP 3",
                title: "Timer Based Simulation",
                desc: "Real interview pressure with time tracking.",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                whileHover={{
                  rotate: 0,
                  scale: 1.04,
                  y: -5,
                }}
                className={`relative bg-white rounded-3xl border-2 border-green-100 hover:border-green-400 p-8 md:p-9 w-full sm:w-80 shadow-md hover:shadow-xl transition-all duration-300
                  ${index === 0 ? "md:-rotate-3" : ""}
                  ${index === 1 ? "md:rotate-2 md:-mt-6" : ""}
                  ${index === 2 ? "md:-rotate-2" : ""}
                `}
              >
                <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-white border-2 border-green-500 text-green-600 w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg">
                  {item.icon}
                </div>

                <div className="pt-6 text-center">
                  <div className="text-xs text-green-600 font-semibold mb-2 tracking-wider">
                    {item.step}
                  </div>

                  <h3 className="font-semibold mb-3 text-lg">
                    {item.title}
                  </h3>

                  <p className="text-sm text-gray-500 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Advanced AI Capabilities */}
          <div className="mb-32">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-3xl sm:text-4xl font-semibold text-center mb-12 md:mb-16"
            >
              Advanced AI{" "}
              <span className="text-green-600">Capabilities</span>
            </motion.h2>

            <div className="grid md:grid-cols-2 gap-6 md:gap-8">
              {[
                {
                  image: evalImg,
                  icon: <BsBarChart size={20} />,
                  title: "AI Answer Evaluation",
                  desc: "Scores communication, technical accuracy and confidence.",
                },
                {
                  image: resumeImg,
                  icon: <BsFileEarmarkText size={20} />,
                  title: "Resume Based Interview",
                  desc: "Project-specific questions based on uploaded resume.",
                },
                {
                  image: pdfImg,
                  icon: <BsFileEarmarkText size={20} />,
                  title: "Downloadable PDF Report",
                  desc: "Detailed strengths, weaknesses and improvement insights.",
                },
                {
                  image: analyticsImg,
                  icon: <BsBarChart size={20} />,
                  title: "History & Analytics",
                  desc: "Track progress with performance graphs and topic analysis.",
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.1,
                  }}
                  whileHover={{ scale: 1.015, y: -4 }}
                  className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8">

                    <div className="w-full sm:w-1/2 flex justify-center">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full max-w-60 h-48 object-contain"
                      />
                    </div>

                    <div className="w-full sm:w-1/2 text-center sm:text-left">
                      <div className="bg-green-50 text-green-600 w-12 h-12 rounded-xl flex items-center justify-center mb-5 mx-auto sm:mx-0">
                        {item.icon}
                      </div>

                      <h3 className="font-semibold mb-3 text-lg sm:text-xl">
                        {item.title}
                      </h3>

                      <p className="text-gray-500 text-sm leading-relaxed">
                        {item.desc}
                      </p>
                    </div>

                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Interview Modes */}
          <div className="mb-20">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-3xl sm:text-4xl font-semibold text-center mb-12 md:mb-16"
            >
              Multiple Interview{" "}
              <span className="text-green-600">Modes</span>
            </motion.h2>

            <div className="grid md:grid-cols-2 gap-6 md:gap-8">
              {[
                {
                  image: hrImg,
                  title: "HR Interview Mode",
                  desc: "Behavioral and communication based evaluation.",
                },
                {
                  image: techImg,
                  title: "Technical Mode",
                  desc: "Deep technical questioning based on selected role.",
                },
                {
                  image: confidenceImg,
                  title: "Confidence Detection",
                  desc: "Basic tone and voice analysis insights.",
                },
                {
                  image: creditImg,
                  title: "Credits System",
                  desc: "Unlock premium interview sessions easily.",
                },
              ].map((mode, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.1,
                  }}
                  whileHover={{ scale: 1.015, y: -5 }}
                  className="bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex flex-col sm:flex-row items-center gap-6">

                    <div className="w-full sm:w-1/2 text-center sm:text-left">
                      <h3 className="font-semibold text-lg sm:text-xl mb-3">
                        {mode.title}
                      </h3>

                      <p className="text-gray-500 text-sm leading-relaxed">
                        {mode.desc}
                      </p>
                    </div>

                    <div className="w-full sm:w-1/2 flex justify-center sm:justify-end">
                      <img
                        src={mode.image}
                        alt={mode.title}
                        className="w-32 h-32 object-contain"
                      />
                    </div>

                  </div>
                </motion.div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {showAuth && (
        <AuthModel onClose={() => setShowAuth(false)} />
      )}
      <Footer/>
    </div>
  );
};

export default Home;