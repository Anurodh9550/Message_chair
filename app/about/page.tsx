"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const data = [
  {
    title: "Premium Massage Chair Design",
    img: "/why1.png",
    icon: "🪑",
  },
  {
    title: "Trusted Wellness Technology",
    img: "/why2.png",
    icon: "❤️",
  },
  {
    title: "Complete Leg and Foot Relief",
    img: "/why3.png",
    icon: "🦶",
  },
];

const dataa = [
  {
    title: "Made for Indians",
    desc: "When it comes to personalized items, there is no single answer. As a result, understanding the individual needs of the audience might be difficult in a nation like India. We overcome these difficulties by creating and developing massage chair solutions specifically for Indians.",
  },
  {
    title: "Products That Are Based On Result",
    desc: "Our goods offer attainable results. The immediate effect will be an alleviation of pain and discomfort. Long-term advantages include improved general health, reduced stress, better sleep quality, increased energy levels, and improved blood circulation.",
  },
  {
    title: "Pan-India Service Network",
    desc: "With a Pan-India service network, we ensure that your experience with Robocura products is the best it can be. We provide out-of-warranty service in addition to a one-year warranty on all products.",
  },
  {
    title: "Personalised Guidance",
    desc: "People who purchase our product may feel overwhelmed by the large number of options available. That is why we have a professional staff that answers all your queries and directs you to the finest product based on your requirements.",
  },
];

export default function AboutPage() {
  const images = [
    "/items/aii.png",
    "/items/aiii.png",
    "/items/aii.png",
    "/items/4dd.png",
  ];

  const [index, setIndex] = useState(0);

  // 🔥 Auto change every 2.5 sec
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      {/* 🔥 HERO SECTION */}
      <section className="relative flex min-h-[380px] items-center overflow-auto text-white [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden md:min-h-[300px]">
        {/* Background Video */}
        <div className="absolute inset-0 overflow-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <video
            src="/videos/video2.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="absolute left-0 top-0 h-[200%] w-[115%] min-h-full min-w-full object-cover"
          />
        </div>

        {/* Content */}
        <div className="relative z-10 mx-auto grid w-[95%] max-w-[1280px] items-center gap-8 py-8 md:grid-cols-2 md:gap-10">
          {/* LEFT TEXT */}
          <div>
            <h1 className="text-3xl font-semibold leading-tight text-white drop-shadow-[0_2px_12px_rgba(255,255,255,0.25)] md:text-4xl">
              Robotic Care, Designed for Life
            </h1>

            <div className="w-20 h-[2px] bg-white my-4"></div>

            <p className="text-base text-white/95 drop-shadow-[0_1px_8px_rgba(255,255,255,0.18)] md:text-lg">
              Since 2016, redefining wellness through intelligent massage
              technology.
            </p>
          </div>

          {/* 🔥 RIGHT SIDE IMAGE SLIDER */}
          <div className="flex justify-center md:justify-end">
            <div className="relative h-[210px] w-[210px] md:h-[250px] md:w-[250px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0, rotate: -180 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 0, rotate: 180 }}
                  transition={{ duration: 0.7 }}
                  className="absolute right-0 h-[210px] w-[210px] overflow-hidden rounded-full md:right-[-40px] md:h-[250px] md:w-[250px]"
                >
                  <img
                    src={images[index]}
                    alt="Massage Chair"
                    className="w-full h-full object-cover brightness-150 contrast-125 saturate-110"
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* 🔥 OUR STORY SECTION */}
      <section className="bg-gray-100 py-16">
        <div className="mx-auto w-[95%] max-w-[900px] text-center">
          <h2 className="mb-6 text-3xl font-semibold text-[#4f3a35] md:text-4xl">
            OUR STORY
          </h2>

          <p className="mb-4 leading-relaxed text-[#5b4740]">
            At Kila, we believe wellness is not a luxury—it is a necessity,
            thoughtfully enhanced through modern technology and intelligent
            design.
          </p>

          <p className="mb-4 leading-relaxed text-[#5b4740]">
            Our name reflects strength, comfort, and reliability. At Kila, we
            are committed to delivering advanced massage solutions that combine
            innovation with everyday convenience, bringing relaxation directly
            into your home.
          </p>

          <p className="mb-4 leading-relaxed text-[#5b4740]">
            Founded with a vision to redefine comfort, Kila focuses on creating
            premium massage chairs that offer precision, durability, and
            long-lasting performance. Each product is carefully designed to meet
            the needs of modern lifestyles while ensuring maximum comfort and
            therapeutic benefits.
          </p>

          <p className="mb-4 leading-relaxed text-[#5b4740]">
            Over time, we have expanded our range from compact massage solutions
            to full-body advanced massage chairs, ensuring every user
            experiences the perfect balance of technology and relaxation.
          </p>

          <p className="leading-relaxed text-[#5b4740]">
            What truly defines Kila is the trust of our customers. Their
            satisfaction and positive experiences inspire us to continuously
            improve and innovate. For us, wellness is not a one-time purchase—it
            is a long-term commitment we proudly stand by.
          </p>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto w-[95%] max-w-[1280px]">
          {/* TOP RIGHT SHAPE */}
          <div className="ml-auto mb-6 h-[40px] w-[160px] rounded-l-full bg-[#63c66d] sm:h-[50px] sm:w-[250px]"></div>

          {/* HEADING */}
          <h2 className="text-3xl font-bold sm:text-4xl md:text-6xl">
            Why <span className="text-[#63c66d]">Kila?</span>
          </h2>

          {/* SUBTEXT */}
          <p className="mt-4 max-w-[900px] text-base italic text-[#5b4740] sm:text-lg">
            Under only 10+ years in the massage chair industry, Kila has gained
            the trust of both the old and the young.
          </p>

          {/* CARDS */}
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {data.map((item, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.05 }}
                className="relative overflow-hidden rounded-2xl shadow-md transition hover:shadow-xl"
              >
                {/* Image */}
                <img
                  src={item.img}
                  alt={item.title}
                  className="h-[260px] w-full object-cover"
                />

                {/* Icon */}
                <div className="absolute bottom-4 left-4 flex h-12 w-12 items-center justify-center rounded-full bg-white text-xl shadow-md">
                  {item.icon}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto w-[95%] max-w-[1280px]">
          {/* Top Green Shape */}
          <div className="mb-10 h-[42px] w-[180px] rounded-r-full bg-[#63c66d] sm:h-[60px] sm:w-[300px]"></div>

          {/* Grid */}
          <div className="grid gap-6 md:grid-cols-2">
            {dataa.map((item, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.02 }}
                className="rounded-xl bg-[#63c66d] p-6 text-white shadow-md transition hover:bg-[#57b861] hover:shadow-xl"
              >
                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>

                <p className="text-sm leading-relaxed text-white">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
