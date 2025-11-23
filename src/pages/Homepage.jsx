import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AOS from "aos";
import { Link } from "react-router-dom";
import "aos/dist/aos.css";
import {
  Calendar,
  Users,
  BookOpen,
  Trophy,
  ArrowRight,
  Sparkles,
} from "lucide-react";

import heroPicture from "../assets/hero_bitsa.jpg";

function Homepage({ onNavigate }) {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false,
      mirror: true,
    });
  }, []);
  const navigate = useNavigate();

  const features = [
    {
      icon: <Users className="w-10 h-10 sm:w-12 sm:h-12 text-amber-500" />,
      title: "Community",
      description:
        "Connect with fellow IT students and build lasting professional relationships.",
      gradient: "from-blue-500 to-blue-600",
    },
    {
      icon: <Calendar className="w-10 h-10 sm:w-12 sm:h-12 text-blue-500" />,
      title: "Events",
      description:
        "Participate in workshops, hackathons, and networking events throughout the year.",
      gradient: "from-blue-600 to-blue-700",
    },
    {
      icon: <BookOpen className="w-10 h-10 sm:w-12 sm:h-12 text-red-500" />,
      title: "Resources",
      description:
        "Access study materials, tutorials, and career guidance from industry experts.",
      gradient: "from-blue-700 to-blue-800",
    },
    {
      icon: <Trophy className="w-10 h-10 sm:w-12 sm:h-12 text-purple-600" />,
      title: "Competitions",
      description:
        "Showcase your skills in coding competitions and hackathons with prizes.",
      gradient: "from-blue-800 to-blue-900",
    },
  ];

  return (
    // FIX 1: Added overflow-x-hidden to prevent horizontal scroll caused by minor overflow
    <div className="min-h-screen overflow-x-hidden"> 
      {/* HERO SECTION */}
      <div
        className="relative overflow-hidden bg-cover bg-center min-h-[70vh] md:min-h-[85vh] lg:min-h-screen" 
        style={{ backgroundImage: `url(${heroPicture})` }}
      >
        <div className="absolute inset-0 bg-black/40" /> 
        {/* Decorative elements are fine, but ensure they don't block content */}
        <div className="absolute top-6 right-4 w-48 h-48 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse hidden sm:block" />
        <div className="absolute bottom-6 left-4 w-44 h-44 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse hidden sm:block" />

        <div
          // FIX 2: Explicitly ensure the inner content container uses responsive padding
          className="relative w-full xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 lg:py-40 text-center text-white" 
          data-aos="fade-up"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg mb-6 border border-blue-200">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span className="text-blue-700 font-medium text-xs sm:text-sm">
              Empowering Tech Leaders Since 2020
            </span>
          </div>

          {/* Heading: Ensure smooth font scaling */}
          <h1
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl mb-4 sm:mb-6 font-extrabold drop-shadow-2xl"
            data-aos="zoom-in"
          >
            Welcome to <span className="text-blue-400">BITSA</span>
          </h1>

          {/* Subtext: Use smaller size on mobile and scale up */}
          <p
            className="text-base sm:text-lg md:text-xl lg:text-2xl mb-8 sm:mb-12 max-w-3xl mx-auto text-blue-100 font-semibold drop-shadow-xl"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            Bachelor of Information Technology Students Association empowering
            the next generation of tech leaders through innovation,
            collaboration, and excellence.
          </p>

          {/* CTA Buttons: Full width on mobile (w-full), side-by-side on larger screens (sm:flex-row) */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center max-w-sm sm:max-w-none mx-auto">
            <button
              type="button"
              onClick={() => navigate("/register")}
              aria-label="Join BITSA"
              className="w-full sm:w-auto bg-blue-600 text-white px-8 py-3.5 rounded-full font-bold text-base md:text-lg shadow-xl flex items-center justify-center gap-2 transition-transform transform hover:scale-105 hover:shadow-blue-500/60"
            >
              Join BITSA Today <ArrowRight className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={() => navigate("/events")}
              aria-label="Explore events"
              className="w-full sm:w-auto bg-white/90 backdrop-blur-sm border-2 border-blue-300 text-blue-700 px-8 py-3.5 rounded-full font-bold text-base md:text-lg transition-transform transform hover:scale-105 hover:shadow-lg hover:bg-white"
            >
              Explore Events
            </button>
          </div>
        </div>
      </div>

      {/* FEATURES SECTION */}
      <div className="max-w-full xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 bg-white">
        <div className="text-center mb-10 md:mb-16" data-aos="fade-up">
          <h2 className="text-3xl sm:text-4xl md:text-5xl mb-3 text-gray-900 font-extrabold">
            Why Join <span className="text-blue-600">BITSA?</span>
          </h2>
          <p className="text-base sm:text-lg font-bold text-blue-600 max-w-3xl mx-auto">
            Discover the benefits of being part of our vibrant IT student
            community.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
          {features.map((feature, index) => (
            <div
              key={index}
              data-aos="zoom-in"
              data-aos-delay={index * 150}
              className="group relative overflow-hidden bg-white border border-blue-200 rounded-3xl shadow-lg hover:shadow-2xl hover:scale-[1.03] transition-all duration-500 p-6 md:p-8"
            >
              <div className="relative">
                <div className="flex justify-center mb-4 md:mb-6">
                  <div className="p-4 md:p-5 bg-blue-100 rounded-2xl group-hover:bg-blue-600 transition-colors duration-300">
                    <span className="text-blue-700 group-hover:text-white transition-colors duration-300">
                      {feature.icon}
                    </span>
                  </div>
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-center text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-center text-sm md:text-base">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ABOUT SECTION */}
      <div className="bg-gradient-to-br from-blue-100 via-blue-50 to-indigo-100 py-16 md:py-24">
        <div className="max-w-full xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div data-aos="fade-right">
            <div className="inline-block bg-blue-600 text-white px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
              About Us
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl mb-4 text-gray-900 font-bold">
              Building the Future of Technology
            </h2>
            <p className="text-base sm:text-lg text-gray-700 mb-4 font-semibold">
              BITSA is a dynamic organization dedicated to fostering
              collaboration, innovation, and professional development among IT
              students.
            </p>
            <p className="text-sm sm:text-base text-gray-700 mb-6 font-semibold">
              We organize hackathons, workshops, networking events, and provide
              a platform for students to connect, learn, and grow in the
              ever-evolving tech industry.
            </p>
            <ul className="space-y-3 mb-8 font-semibold">
              {[
                "Industry-led Workshops",
                "Networking Opportunities",
                "Career Guidance",
                "Tech Competitions",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-gray-700">
                  <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center shrink-0 animate-pulse mt-0.5">
                    <svg
                      className="w-3 h-3 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <span className="text-base sm:text-lg">{item}</span>
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() => navigate("/contact")}
              className="w-full md:w-auto bg-blue-600 text-white px-8 py-3.5 rounded-full hover:bg-blue-700 transition-all shadow-md flex items-center justify-center gap-2 font-semibold text-base md:text-lg transform hover:scale-105"
            >
              Get in Touch <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          <div className="relative order-first md:order-last" data-aos="fade-left">
            <img
              src="https://images.unsplash.com/photo-1638029202288-451a89e0d55f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2RpbmclMjBoYWNrYXRob258ZW58MXx8fHwxNzYyMjUxOTA4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Coding Hackathon"
              className="rounded-3xl shadow-2xl object-cover w-full h-64 sm:h-80 lg:h-[420px] border-4 border-white transition-transform duration-700 hover:scale-[1.02]"
            />
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-t from-blue-900/10 to-transparent pointer-events-none"></div>
          </div>
        </div>
      </div>

      {/* CALL TO ACTION SECTION */}
      <div className="bg-blue-700 py-16 md:py-24 text-center text-white">
        <div className="w-full xl:max-w-5xl mx-auto px-4 sm:px-6 lg:px-8" data-aos="fade-up">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 md:mb-6">
            Ready to Be Part of Something Bigger?
          </h2>
          <p className="text-base sm:text-lg md:text-xl mb-8 font-semibold text-blue-100 max-w-3xl mx-auto">
            Join BITSA today and take the first step toward becoming a leader in
            the tech community.
          </p>
          <button
            type="button"
            onClick={() => navigate("/register")}
            className="w-full sm:w-auto bg-white text-blue-700 px-10 py-4 rounded-full font-bold text-lg md:text-xl hover:bg-blue-100 transition-all shadow-xl flex items-center justify-center gap-3 mx-auto transform hover:scale-105"
          >
            Join Now <ArrowRight className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Homepage;