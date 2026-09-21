import React, { useEffect, useRef, useState } from "react";
import maleVideo from "../assets/Videos/male-ai.mp4";
import femaleVideo from "../assets/Videos/female-ai.mp4";
import Timer from "./Timer";
import { motion } from "motion/react";
import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";
import { ServerUrl } from "../App";
import { BsArrowRight } from "react-icons/bs";
import axios from "axios";

const Step2Interview = ({ interviewData, onFinish }) => {
  const { interviewId, questions, userName } = interviewData;

  const [isIntroPhase, setIsIntroPhase] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isAIPlaying, setIsAIPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [timeleft, setTimeleft] = useState(
    questions[0]?.timeLimit || 60
  );
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [voiceGender, setVoiceGender] = useState("female");
  const [subtitle, setSubtitle] = useState("");

  const recognitionRef = useRef(null);
  const videoRef = useRef(null);
  const isRecognizingRef = useRef(false);
  const isMicOnRef = useRef(true);
  const isMountedRef = useRef(true);

  const currentQuestion = questions[currentIndex];

  const videoSource =
    voiceGender === "male" ? maleVideo : femaleVideo;

  /* -------------------- LOAD VOICES -------------------- */

  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();

      if (!voices.length) return;

      const femaleVoice = voices.find(
        (voice) =>
          voice.name.toLowerCase().includes("zira") ||
          voice.name.toLowerCase().includes("samantha") ||
          voice.name.toLowerCase().includes("female")
      );

      if (femaleVoice) {
        setSelectedVoice(femaleVoice);
        setVoiceGender("female");
        return;
      }

      const maleVoice = voices.find(
        (voice) =>
          voice.name.toLowerCase().includes("david") ||
          voice.name.toLowerCase().includes("mark") ||
          voice.name.toLowerCase().includes("male")
      );

      if (maleVoice) {
        setSelectedVoice(maleVoice);
        setVoiceGender("male");
        return;
      }

      setSelectedVoice(voices[0]);
      setVoiceGender("female");
    };

    loadVoices();

    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  /* -------------------- SPEECH RECOGNITION SETUP -------------------- */

  useEffect(() => {
    isMountedRef.current = true;

    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn(
        "Speech recognition is not supported in this browser."
      );
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "en-US";
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      isRecognizingRef.current = true;
    };

    recognition.onresult = (event) => {
      if (!isMountedRef.current) return;

      let transcript = "";

      for (
        let i = event.resultIndex;
        i < event.results.length;
        i++
      ) {
        if (event.results[i].isFinal) {
          transcript += event.results[i][0].transcript;
        }
      }

      if (transcript.trim()) {
        setAnswer((prev) =>
          `${prev} ${transcript}`.trim()
        );
      }
    };

    recognition.onerror = (event) => {
      console.log(
        "Speech recognition error:",
        event.error
      );

      isRecognizingRef.current = false;

      if (
        event.error === "not-allowed" ||
        event.error === "service-not-allowed"
      ) {
        setIsMicOn(false);
        isMicOnRef.current = false;
      }
    };

    recognition.onend = () => {
      isRecognizingRef.current = false;
    };

    recognitionRef.current = recognition;

    return () => {
      isMountedRef.current = false;

      isRecognizingRef.current = false;

      try {
        recognition.stop();
        recognition.abort();
      } catch {
        // Already stopped
      }

      recognitionRef.current = null;
    };
  }, []);

  /* -------------------- START MIC -------------------- */

  const startMic = () => {
    if (
      !recognitionRef.current ||
      isAIPlaying ||
      !isMicOnRef.current ||
      isRecognizingRef.current
    ) {
      return;
    }

    try {
      recognitionRef.current.start();
    } catch (error) {
      console.log("Mic start error:", error);
    }
  };

  /* -------------------- STOP MIC -------------------- */

  const stopMic = () => {
    if (!recognitionRef.current) return;

    try {
      recognitionRef.current.stop();
    } catch {
      // Already stopped
    }

    isRecognizingRef.current = false;
  };

  /* -------------------- TEXT TO SPEECH -------------------- */

  const speakText = (text) => {
    return new Promise((resolve) => {
      if (!window.speechSynthesis || !selectedVoice) {
        resolve();
        return;
      }

      window.speechSynthesis.cancel();

      const humanText = text
        .replace(/,/g, ", ... ")
        .replace(/\./g, ". ... ");

      const utterance =
        new SpeechSynthesisUtterance(humanText);

      utterance.voice = selectedVoice;
      utterance.rate = 0.92;
      utterance.pitch = 1.05;
      utterance.volume = 1;

      let resolved = false;

      const finishSpeech = () => {
        if (resolved) return;

        resolved = true;

        videoRef.current?.pause();

        if (videoRef.current) {
          videoRef.current.currentTime = 0;
        }

        setIsAIPlaying(false);
        setSubtitle("");

        if (isMicOnRef.current) {
          setTimeout(() => {
            startMic();
          }, 200);
        }

        resolve();
      };

      utterance.onstart = () => {
        setIsAIPlaying(true);

        stopMic();

        videoRef.current?.play().catch(() => {});
      };

      utterance.onend = () => {
        finishSpeech();
      };

      utterance.onerror = () => {
        finishSpeech();
      };

      setSubtitle(text);

      window.speechSynthesis.speak(utterance);
    });
  };

  /* -------------------- INTRO / QUESTIONS -------------------- */

  useEffect(() => {
    if (!selectedVoice) return;

    let cancelled = false;

    const runInterviewSpeech = async () => {
      if (cancelled) return;

      if (isIntroPhase) {
        await speakText(
          `Hi ${userName}, it's great to meet you today. I hope you're feeling confident and ready.`
        );

        if (cancelled) return;

        await speakText(
          `I'll ask you a few questions. Just answer naturally, and take your time. Let's begin.`
        );

        if (cancelled) return;

        setIsIntroPhase(false);
      } else if (currentQuestion) {
        await new Promise((resolve) =>
          setTimeout(resolve, 800)
        );

        if (cancelled) return;

        if (currentIndex === questions.length - 1) {
          await speakText(
            "Alright, this one might be a bit more challenging."
          );

          if (cancelled) return;
        }

        await speakText(currentQuestion.question);
      }
    };

    runInterviewSpeech();

    return () => {
      cancelled = true;
    };
  }, [
    selectedVoice,
    isIntroPhase,
    currentIndex,
  ]);

  /* -------------------- TIMER -------------------- */

  useEffect(() => {
    if (isIntroPhase || !currentQuestion) return;

    const timer = setInterval(() => {
      setTimeleft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isIntroPhase, currentIndex]);

  useEffect(() => {
    if (!isIntroPhase && currentQuestion) {
      setTimeleft(currentQuestion.timeLimit || 60);
    }
  }, [
    currentIndex,
    isIntroPhase,
    currentQuestion,
  ]);

  /* -------------------- TOGGLE MIC -------------------- */

  const toggleMic = () => {
    if (isMicOn) {
      stopMic();

      isMicOnRef.current = false;
      setIsMicOn(false);
    } else {
      isMicOnRef.current = true;
      setIsMicOn(true);

      if (!isAIPlaying) {
        startMic();
      }
    }
  };

  /* -------------------- SUBMIT ANSWER -------------------- */

  const submitAnswer = async () => {
    if (isSubmitting || !currentQuestion) return;

    stopMic();

    setIsSubmitting(true);

    try {
      const result = await axios.post(
        ServerUrl + "/api/interview/submit-answer",
        {
          interviewId,
          questionIndex: currentIndex,
          answer,
          timeTaken:
            currentQuestion.timeLimit - timeleft,
        },
        {
          withCredentials: true,
        }
      );

      setFeedback(result.data.feedback);

      await speakText(result.data.feedback);

      if (isMountedRef.current) {
        setIsSubmitting(false);
      }
    } catch (error) {
      console.log(
        "Submit Answer Error:",
        error.response?.data || error.message
      );

      setIsSubmitting(false);
    }
  };

  /* -------------------- NEXT QUESTION -------------------- */

  const handleNext = async () => {
    if (isSubmitting) return;

    stopMic();

    setAnswer("");
    setFeedback("");

    if (currentIndex + 1 >= questions.length) {
      await finishInterview();
      return;
    }

    await speakText(
      "Alright, let's move to the next question."
    );

    setCurrentIndex((prev) => prev + 1);
  };

  /* -------------------- FINISH INTERVIEW -------------------- */

  const finishInterview = async () => {
    stopMic();

    isMicOnRef.current = false;
    setIsMicOn(false);

    try {
      const result = await axios.post(
        ServerUrl + "/api/interview/finish",
        {
          interviewId,
        },
        {
          withCredentials: true,
        }
      );

      console.log(result.data);

      onFinish(result.data);
    } catch (error) {
      console.log(
        "Finish Interview Error:",
        error.response?.data || error.message
      );
    }
  };

  /* -------------------- AUTO SUBMIT WHEN TIMER ENDS -------------------- */

  useEffect(() => {
    if (
      isIntroPhase ||
      !currentQuestion ||
      isSubmitting ||
      feedback
    ) {
      return;
    }

    if (timeleft === 0) {
      submitAnswer();
    }
  }, [
    timeleft,
    isIntroPhase,
    currentQuestion,
    isSubmitting,
    feedback,
  ]);

  /* -------------------- CLEANUP -------------------- */

  useEffect(() => {
    return () => {
      isMountedRef.current = false;

      isRecognizingRef.current = false;

      try {
        recognitionRef.current?.stop();
        recognitionRef.current?.abort();
      } catch {
        // Already stopped
      }

      window.speechSynthesis.cancel();
    };
  }, []);

  /* -------------------- UI -------------------- */

  return (
    <div className="min-h-screen bg-linear-to-br from-emerald-50 via-white to-teal-100 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-350 min-h-[80vh] bg-white rounded-3xl shadow-2xl border border-gray-200 flex flex-col lg:flex-row overflow-hidden">

        <div className="w-full lg:w-[35%] bg-white flex flex-col items-center p-6 space-y-6 border-r border-gray-200">

          <div className="w-full max-w-md rounded-2xl overflow-hidden shadow-xl">
            <video
              src={videoSource}
              key={videoSource}
              ref={videoRef}
              muted
              playsInline
              preload="auto"
              className="w-full h-auto object-cover"
            />
          </div>

          {subtitle && (
            <div className="w-full max-w-md bg-gray-50 border border-gray-200 rounded-xl p-4 shadow-sm">
              <p className="text-gray-700 text-sm sm:text-base font-medium text-center leading-relaxed">
                {subtitle}
              </p>
            </div>
          )}

          <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl shadow-md p-6 space-y-5">

            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">
                Interview Status
              </span>

              {isAIPlaying && (
                <span className="text-sm font-semibold text-emerald-600">
                  AI Speaking
                </span>
              )}
            </div>

            <div className="h-px bg-gray-200"></div>

            <div className="flex justify-center">
              <Timer
                timeLeft={timeleft}
                totalTime={
                  currentQuestion?.timeLimit || 60
                }
              />
            </div>

            <div className="h-px bg-gray-200"></div>

            <div className="grid grid-cols-2 gap-6 text-center">

              <div>
                <span className="text-2xl font-bold text-emerald-600 block">
                  {currentIndex + 1}
                </span>

                <span className="text-xs text-gray-400">
                  Current Question
                </span>
              </div>

              <div>
                <span className="text-2xl font-bold text-emerald-600 block">
                  {questions.length}
                </span>

                <span className="text-xs text-gray-400">
                  Total Questions
                </span>
              </div>

            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col p-4 sm:p-6 md:p-8 relative">

          <h2 className="text-xl sm:text-2xl font-bold text-emerald-600 mb-6">
            AI Smart Interview
          </h2>

          {isIntroPhase && (
            <div className="relative mb-6 bg-gray-50 p-4 sm:p-6 rounded-2xl border border-gray-200 shadow-sm">

              <p className="text-xs sm:text-sm text-gray-400 mb-2">
                Question {currentIndex + 1} of{" "}
                {questions.length}
              </p>

              <div className="text-base sm:text-lg font-semibold text-gray-800 leading-relaxed">
                {currentQuestion?.question}
              </div>

            </div>
          )}

          <textarea
            placeholder="Type your answer here..."
            onChange={(e) =>
              setAnswer(e.target.value)
            }
            value={answer}
            className="flex-1 bg-gray-100 p-4 sm:p-6 rounded-2xl resize-none outline-none border border-gray-200 focus:ring-2 focus:ring-emerald-500 transition text-gray-800"
          />

          {!feedback ? (
            <div className="flex items-center gap-4 mt-6">

              <motion.button
                onClick={toggleMic}
                whileTap={{ scale: 0.9 }}
                className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-full bg-black text-white shadow-lg"
              >
                {isMicOn ? (
                  <FaMicrophone size={20} />
                ) : (
                  <FaMicrophoneSlash size={20} />
                )}
              </motion.button>

              <motion.button
                onClick={submitAnswer}
                disabled={isSubmitting}
                whileTap={{ scale: 0.95 }}
                className="flex-1 bg-linear-to-r from-emerald-600 to-teal-500 text-white py-3 sm:py-4 rounded-2xl shadow-lg hover:opacity-90 transition font-semibold disabled:bg-gray-500"
              >
                {isSubmitting
                  ? "Submitting..."
                  : "Submit Answer"}
              </motion.button>

            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-6 bg-emerald-50 border border-emerald-200 p-5 rounded-2xl shadow-sm"
            >

              <p className="text-emerald-700 font-medium mb-4">
                {feedback}
              </p>

              <button
                onClick={handleNext}
                className="w-full bg-linear-to-r from-emerald-600 to-teal-500 text-white py-3 rounded-xl shadow-md hover:opacity-90 transition flex items-center justify-center gap-1"
              >
                Next Question
                <BsArrowRight size={18} />
              </button>

            </motion.div>
          )}

        </div>
      </div>
    </div>
  );
};

export default Step2Interview;