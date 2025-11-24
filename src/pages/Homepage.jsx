import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import {
  Calendar,
  Users,
  BookOpen,
  Trophy,
  ArrowRight,
  Sparkles,
  Target,
} from "lucide-react";

import heroPicture from "../assets/hero_bitsa.jpg";

function Homepage({ onNavigate }) {
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: false, // Animations repeat on scroll
      mirror: true, // Animate when scrolling up
      easing: "ease-out-cubic",
    });
    AOS.refresh();
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: "smooth" });
  };

  const features = [
    {
      icon: <Users className="w-10 h-10 sm:w-12 sm:h-12 text-amber-500" />,
      title: "Community",
      description:
        "Connect with fellow IT students and build lasting professional relationships.",
    },
    {
      icon: <Calendar className="w-10 h-10 sm:w-12 sm:h-12 text-blue-500" />,
      title: "Events",
      description:
        "Participate in workshops, hackathons, and networking events throughout the year.",
    },
    {
      icon: <BookOpen className="w-10 h-10 sm:w-12 sm:h-12 text-red-500" />,
      title: "Resources",
      description:
        "Access study materials, tutorials, and career guidance from industry experts.",
    },
    {
      icon: <Trophy className="w-10 h-10 sm:w-12 sm:h-12 text-purple-600" />,
      title: "Competitions",
      description:
        "Showcase your skills in coding competitions and hackathons with prizes.",
    },
  ];

  return (
    <div className="min-h-screen overflow-x-hidden">

      {/* HERO SECTION */}
      <div
        className="relative overflow-hidden bg-cover bg-center min-h-[60vh] sm:min-h-[80vh]"
        style={{ backgroundImage: `url(${heroPicture})` }}
      >
        <div
          className="absolute inset-0 bg-black/20"
          data-aos="fade-up"
          data-aos-delay="100"
        />
        {/* Decorative blobs */}
        <div
          className="absolute top-6 right-4 w-48 h-48 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse hidden sm:block"
          data-aos="fade-left"
          data-aos-delay="200"
        />
        <div
          className="absolute bottom-6 left-4 w-44 h-44 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse hidden sm:block"
          data-aos="fade-right"
          data-aos-delay="300"
        />

        <div className="relative w-full xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 md:py-32 text-center text-white">
          <div
            className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg mb-6 border border-blue-200"
            data-aos="fade-up"
            data-aos-delay="400"
          >
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span className="text-blue-700 font-medium text-xs sm:text-sm">
              Empowering Tech Leaders Since 2020
            </span>
          </div>

          <h1
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-4 sm:mb-6 font-extrabold drop-shadow-lg"
            data-aos="fade-up"
            data-aos-delay="500"
          >
            Welcome to <span className="text-blue-400">BITSA</span>
          </h1>

          <p
            className="text-sm sm:text-base md:text-lg lg:text-xl mb-6 sm:mb-10 max-w-2xl mx-auto text-blue-100 font-semibold"
            data-aos="fade-up"
            data-aos-delay="600"
          >
            Bachelor of Information Technology Students Association empowering
            the next generation of tech leaders through innovation,
            collaboration, and excellence.
          </p>

          <div
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center"
            data-aos="fade-up"
            data-aos-delay="700"
          >
            <button
              type="button"
              onClick={() => navigate("/register")}
              className="w-full sm:w-auto bg-blue-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold text-base sm:text-lg shadow-lg flex items-center justify-center gap-2 transition-transform transform hover:scale-105 hover:shadow-blue-500/40"
            >
              Join BITSA Today <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            <button
              type="button"
              onClick={() => scrollToSection("about-us")}
              className="w-full sm:w-auto bg-white/80 backdrop-blur-sm border-2 border-blue-300 text-blue-700 px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold text-base sm:text-lg transition-transform transform hover:scale-105 hover:shadow-lg hover:bg-blue-50"
            >
              Learn About Us
            </button>
          </div>
        </div>
      </div>

      {/* FEATURES */}
      <div className="max-w-full xl:max-w-7xl mx-6 px-4 sm:px-6 lg:px-8 bg-white rounded-4xl py-12 sm:py-16">
        <div className="text-center mb-8 sm:mb-12" data-aos="fade-up">
          <h2 className="text-2xl sm:text-3xl md:text-4xl mb-3 text-gray-800 font-extrabold">
            Why Join <span className="text-blue-500">BITSA?</span>
          </h2>
          <p className="text-base sm:text-lg font-bold text-blue-500 max-w-2xl mx-auto">
            Discover the benefits of being part of our vibrant IT student
            community.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              data-aos="zoom-in"
              data-aos-delay={index * 150}
              className="group relative overflow-hidden bg-blue-50 border border-blue-100 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 p-4 sm:p-6 max-w-md mx-auto sm:mx-0 transform hover:scale-[1.02] hover:bg-white"
            >
              <div className="relative">
                <div className="flex justify-center mb-4 sm:mb-6">
                  <div className="p-3 sm:p-4 bg-blue-200 rounded-2xl group-hover:bg-blue-100 transition-colors duration-300">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-center text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-center font-medium text-sm sm:text-base">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ABOUT SECTION */}
      <div
        className="py-12 bg-blue-300 sm:py-16"
        id="about-us"
        data-aos="fade-up"
      >
        <div className="max-w-full xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10" data-aos="fade-up" data-aos-delay="100">
            <h2 className="text-3xl sm:text-4xl md:text-5xl mb-3 text-blue-500 font-extrabold">
              Our Story, Mission, and Impact
            </h2>
            <p className="text-base font-bold sm:text-lg text-blue-300 max-w-3xl mx-auto">
              Driving excellence and community within the Bachelor of
              Information Technology program.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            <div
              className="bg-white p-6 rounded-xl shadow-lg border-t-8 border-blue-500"
              data-aos="fade-right"
              data-aos-delay="200"
            >
              <Target className="w-8 h-8 text-blue-500 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">Mission & Vision</h3>
              <p className="text-sm font-bold text-gray-700 mb-3">
                Our mission is to foster a vibrant community among IT students
                by providing cutting-edge resources and networking platforms.
              </p>
              <p className="text-sm font-bold text-gray-700">
                Our vision is to be the leading student organization driving
                innovation and career excellence for future tech leaders.
              </p>
            </div>

            <div
              className="bg-white p-6 rounded-xl shadow-lg border-t-8 border-red-500"
              data-aos="fade-up"
              data-aos-delay="300"
            >
              <BookOpen className="w-8 h-8 text-red-500 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">Our History</h3>
              <p className="text-sm font-bold text-gray-700 mb-3">
                BITSA was officially founded in 2020 by a small group of
                ambitious students who recognized the need for stronger
                professional and academic support.
              </p>
              <p className="text-sm font-bold text-gray-700">
                We are the official student body recognized and supported by the
                School of Information Technology at [UEAB].
              </p>
            </div>

            <div
              className="bg-white p-6 rounded-xl shadow-lg border-t-8 border-green-400"
              data-aos="fade-left"
              data-aos-delay="400"
            >
              <Users className="w-8 h-8 text-green-400 mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">Our Leadership</h3>
              <p className="text-sm font-bold text-gray-700 mb-3">
                The association is run by a dedicated Executive Committee of
                student volunteers, guided by our faculty advisor.
              </p>
              <p className="text-sm font-bold text-gray-700">
                Since inception, we've hosted over 50 events and connected 400+
                students with industry professionals.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CORE VALUE */}
      <div className="bg-gradient-to-br from-blue-100 via-blue-50 to-indigo-100 py-12 sm:py-16">
        <div className="max-w-full xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 items-center">
          <div data-aos="fade-right" data-aos-delay="100">
            <div className="inline-block bg-blue-600 text-white px-3 py-1 rounded-full text-sm mb-4">
              Our Core Value
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl mb-4 text-gray-900 font-bold">
              Building the Future of Technology
            </h2>
            <p className="text-sm sm:text-base text-gray-700 mb-3 font-semibold">
              BITSA is a dynamic organization dedicated to fostering
              collaboration, innovation, and professional development among IT
              students.
            </p>
            <p className="text-sm sm:text-base text-gray-700 mb-5 font-semibold">
              We organize hackathons, workshops, networking events, and provide
              a platform for students to connect, learn, and grow in the
              ever-evolving tech industry.
            </p>

            <ul className="space-y-2 mb-6 font-semibold">
              {[
                "Industry-led Workshops",
                "Networking Opportunities",
                "Career Guidance",
                "Tech Competitions",
              ].map((item, i) => (
                <li
                  key={i}
                  className="flex items-center gap-3 text-gray-700"
                  data-aos="fade-up"
                  data-aos-delay={150 * (i + 1)}
                >
                  <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center shrink-0 animate-pulse">
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
                  <span className="text-sm sm:text-base">{item}</span>
                </li>
              ))}
            </ul>

            <button
              type="button"
              onClick={() => navigate("/contact")}
              className="w-full sm:w-auto bg-blue-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full hover:bg-blue-700 transition-all shadow-md flex items-center gap-2 font-semibold transform hover:scale-105"
              data-aos="fade-up"
              data-aos-delay="500"
            >
              Get in Touch <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>

          <div className="relative" data-aos="fade-left" data-aos-delay="200">
            <img
              src="https://images.unsplash.com/photo-1638029202288-451a89e0d55f?auto=format&fit=crop&w=1080&q=80"
              alt="Coding Hackathon"
              className="rounded-3xl shadow-2xl object-cover w-full h-48 sm:h-64 md:h-80 lg:h-[420px] border-4 border-white transition-transform duration-700 hover:scale-105"
            />
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-t from-blue-900/10 to-transparent pointer-events-none" />
          </div>
        </div>
      </div>

      {/* CALL TO ACTION */}
      <div className="bg-blue-700 py-12 sm:py-16 text-center text-white">
        <div className="w-full xl:max-w-4xl mx-auto px-4" data-aos="fade-up" data-aos-delay="100">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-4 sm:mb-6">
            Ready to Be Part of Something Bigger?
          </h2>
          <p className="text-sm sm:text-base md:text-lg mb-6 font-semibold text-blue-100">
            Join BITSA today and take the first step toward becoming a leader in
            the tech community.
          </p>
          <button
            type="button"
            onClick={() => navigate("/register")}
            className="w-full sm:w-auto bg-white text-blue-700 px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold text-base sm:text-lg hover:bg-blue-100 transition-all shadow-md flex items-center gap-2 mx-auto transform hover:scale-105"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            Join Now <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Homepage;
