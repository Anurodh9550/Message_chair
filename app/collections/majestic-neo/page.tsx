"use client";

import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";

export default function OpulentPrimePage() {
  const images = ["IMG_1356_1.png", "main2.png", "main3.png", "main4.png"];

  const products = [
    {
      name: "Magic Plus Massage Chair",
      img: "/products/p1.png",
      price: "₹98,999",
      oldPrice: "₹2,45,000",
      discount: "59%",
    },
    {
      name: "Magic Plus Advanced Chair",
      img: "/products/p2.png",
      price: "₹98,999",
      oldPrice: "₹2,45,000",
      discount: "59%",
    },
    {
      name: "Eden Foot Leg & Calf Massager",
      img: "/products/p3.png",
      price: "₹20,999",
      oldPrice: "₹28,999",
      discount: "27%",
    },
    {
      name: "Smart Pad Massage Cushion",
      img: "/products/p4.png",
      price: "₹5,999",
      oldPrice: "",
      discount: "",
    },
    {
      name: "Luxury Recliner Chair",
      img: "/products/p5.png",
      price: "₹1,25,999",
      oldPrice: "₹1,80,000",
      discount: "30%",
    },
    {
      name: "Luxury Recliner Chair",
      img: "/products/p5.png",
      price: "₹1,25,999",
      oldPrice: "₹1,80,000",
      discount: "30%",
    },
    {
      name: "Luxury Recliner Chair",
      img: "/products/p5.png",
      price: "₹1,25,999",
      oldPrice: "₹1,80,000",
      discount: "30%",
    },
    {
      name: "Luxury Recliner Chair",
      img: "/products/p5.png",
      price: "₹1,25,999",
      oldPrice: "₹1,80,000",
      discount: "30%",
    },
    {
      name: "Luxury Recliner Chair",
      img: "/products/p5.png",
      price: "₹1,25,999",
      oldPrice: "₹1,80,000",
      discount: "30%",
    },
    {
      name: "Luxury Recliner Chair",
      img: "/products/p5.png",
      price: "₹1,25,999",
      oldPrice: "₹1,80,000",
      discount: "30%",
    },
    {
      name: "Luxury Recliner Chair",
      img: "/products/p5.png",
      price: "₹1,25,999",
      oldPrice: "₹1,80,000",
      discount: "30%",
    },
  ];
  const imagess = [
    "/mainn/656555.webp",
    "/mainn/57577775677.webp",
    "/mainn/7766.webp",
    "/mainn/464366.webp",
    "/mainn/67686899.webp",
    "/mainn/rytytyuu.webp",
  ];

  const [selectedImage, setSelectedImage] = useState(images[0]);
  const [showPopup, setShowPopup] = useState(false);

  return (
    <div className="bg-white text-gray-800">
      {/* 🔥 HERO SECTION */}
      <div className="grid md:grid-cols-2 gap-10 p-10 max-w-7xl mx-auto">
        {/* LEFT IMAGE */}
        <div>
          <Image
            src={`/mainn/${selectedImage}`}
            alt="Opulent Prime"
            width={600}
            height={600}
            onClick={() => setShowPopup(true)}
            className="rounded-xl transition-all duration-300"
          />

          {/* THUMBNAILS */}
          <div className="flex gap-4 mt-4">
            {images.map((img, i) => (
              <Image
                key={i}
                src={`/mainn/${img}`}
                alt="thumb"
                width={100}
                height={100}
                onClick={() => setSelectedImage(img)}
                className={`rounded-lg border cursor-pointer 
                  ${selectedImage === img ? "border-green-500" : "border-gray-300"}
                `}
              />
            ))}
          </div>
        </div>

        {/* RIGHT CONTENT */}
        <div className="space-y-6">
          {/* 🔥 TITLE */}
          <h1 className="text-4xl md:text-5xl font-semibold leading-tight">
            Opulent Prime Ultra <br /> Luxurious Massage Chair
          </h1>

          {/* 🔥 DESCRIPTION */}
          <p className="text-gray-500 leading-relaxed">
            Opulent Prime Zero Gravity Massage Chair offers a relaxing full-body
            massage experience with Bluetooth speakers, zero-gravity
            positioning, and airbag massage options. Designed for premium
            comfort at home.
          </p>

          {/* 🔥 EMI LINE */}
          <div className="flex items-center gap-2 text-gray-600 text-sm">
            <span>📦</span>
            <p>Easy EMI options at checkout</p>
          </div>

          {/* 🔥 PRICE */}
          <div className="flex items-center gap-3">
            <span className="line-through text-gray-400 text-lg">
              ₹4,25,000
            </span>
            <span className="text-2xl font-semibold">₹3,62,999</span>

            {/* SALE TAG */}
            <span className="bg-gray-900 text-white text-xs px-3 py-1 rounded-full">
              Sale
            </span>
          </div>

          <p className="text-xs text-gray-400">Taxes included.</p>

          {/* 🔥 BUTTON */}
          <button className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg text-lg font-medium transition">
            Add to cart
          </button>

          {/* 🔥 ACCORDION STYLE */}
          <div className="border-t pt-4 space-y-4">
            {/* 🔥 PRODUCT FEATURES */}
            <details className="group " open>
              <summary className="flex justify-between items-center cursor-pointer font-medium text-lg">
                Product features
                <span className="group-open:rotate-180 transition">⌄</span>
              </summary>

              <div className=" text-sm text-gray-600 space-y-2 leading-relaxed   ">
                <p>
                  ✔ 24 Auto Programs with 6 massage techniques for complete
                  relaxation
                </p>
                <p>✔ Kneading, Rolling, Tapping & Shiatsu massage modes</p>
                <p>✔ User-friendly Touch LCD Remote Control</p>
                <p>✔ AI Voice Control for easy operation</p>
                <p>✔ Adjustable Roller Speed & Airbag Strength</p>
                <p>✔ Customizable massage intensity & programs</p>
                <p>✔ Adjustable Backrest for maximum comfort</p>
                <p>✔ Premium build supports up to 110 kg</p>
                <p>✔ Airbag system improves circulation & relaxation</p>
                <p>✔ Zero Gravity position for weightless comfort</p>
                <p>✔ 3D Roller with SL Track & Heating</p>
                <p>✔ One-button Zero Gravity & Smart Voice Control</p>
                <p>✔ Leg massage with Auto Foot Extension</p>
                <p>✔ Built-in Bluetooth Speaker</p>
                <p>✔ Wireless Phone Charging + Shortcut Keys</p>
                <p>✔ Adjustable Timer (5–30 mins)</p>
                <p>✔ Lower Back & Calf Heat Therapy</p>
                <p>✔ 1 Year On-site Warranty</p>
              </div>
            </details>

            {/* 🔥 OFFERS & EMI */}
            <details className="group border-t border-b">
              <summary className="flex justify-between items-center cursor-pointer font-medium text-lg">
                Offers and EMI Options
                <span className="group-open:rotate-180 transition">⌄</span>
              </summary>

              <div className="text-sm text-gray-600 space-y-2">
                <p>✔ 1 Year Warranty*</p>
                <p>✔ 12 Months No Cost EMI (Visit Offline Store)</p>
                <p>✔ Free Demo & Installation</p>
              </div>
            </details>
          </div>
        </div>

        {showPopup && (
          <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
            {/* ❌ CLOSE BUTTON */}
            <button
              onClick={() => setShowPopup(false)}
              className="absolute top-5 right-5 text-white text-3xl"
            >
              ✕
            </button>

            <div className="flex gap-6 items-center">
              {/* 🔥 LEFT SIDE - VERTICAL THUMBNAILS */}
              <div className="flex flex-col gap-4 max-h-[80vh] overflow-y-auto">
                {images.map((img, i) => (
                  <Image
                    key={i}
                    src={`/mainn/${img}`}
                    alt="thumb"
                    width={90}
                    height={90}
                    onClick={() => setSelectedImage(img)}
                    className={`rounded-lg border cursor-pointer 
              ${selectedImage === img ? "border-green-500" : "border-gray-400"}
            `}
                  />
                ))}
              </div>

              {/* 🔥 RIGHT SIDE - MAIN IMAGE */}
              <Image
                src={`/mainn/${selectedImage}`}
                alt="preview"
                width={800}
                height={800}
                className="rounded-xl"
              />
            </div>
          </div>
        )}
      </div>

      {/* 🔥 BANNER SECTION */}

      <div className="max-w-6xl mx-auto px-4">
        {imagess.map((img, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 80 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            viewport={{ once: true }}
            className="mb-12 h-[260px] overflow-auto rounded-2xl shadow-xl sm:h-[360px] lg:h-[450px]"
          >
            <div className="w-full">
              <Image
                src={img}
                alt="gallery image"
                width={1400}
                height={900}
                className="w-full h-auto"
              />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="p-10 bg-white">
        {/* TITLE */}
        <h2 className="text-3xl font-semibold mb-6">Related Products</h2>

        {/* 🔥 SCROLL CONTAINER */}
        <div className="flex gap-6 overflow-x-auto scrollbar-hide">
          {products.map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="w-[220px] min-w-[220px] rounded-2xl bg-white p-4 shadow-md relative cursor-pointer sm:min-w-[250px]"
            >
              {/* DISCOUNT BADGE */}
              {item.discount && (
                <span className="absolute top-3 right-3 bg-green-500 text-white text-xs px-2 py-1 rounded">
                  {item.discount}
                </span>
              )}

              {/* IMAGE */}
              <div className="flex justify-center overflow-hidden rounded-xl">
                <motion.div whileHover={{ scale: 1.1 }}>
                  <Image
                    src={item.img}
                    alt={item.name}
                    width={180}
                    height={180}
                    className="object-contain"
                  />
                </motion.div>
              </div>

              {/* NAME */}
              <h3 className="text-sm mt-3 font-medium">{item.name}</h3>

              {/* PRICE */}
              <div className="mt-2">
                {item.oldPrice && (
                  <span className="line-through text-gray-400 text-sm mr-2">
                    {item.oldPrice}
                  </span>
                )}
                <span className="font-semibold">{item.price}</span>
              </div>

              {/* SALE TAG */}
              <span className="inline-block mt-2 bg-gray-900 text-white text-xs px-3 py-1 rounded-full">
                Sale
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* 🔥 FOOTER SPACE */}
    </div>
  );
}
