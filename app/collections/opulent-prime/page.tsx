"use client";

import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import { useStore } from "../../context/StoreContext";

const PRODUCT_ID = "opulent-prime-ultra";
const PRODUCT_NAME = "Opulent Prime Ultra Luxurious Massage Chair";
const PRODUCT_PRICE = 362999;

export default function OpulentPrimePage() {
  const { addToCart } = useStore();
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
        <div className="space-y-5 md:sticky md:top-6 md:max-h-[88vh] md:overflow-y-auto md:pr-2 [scrollbar-width:thin] [scrollbar-color:#a3a3a3_transparent]">
          {/* 🔥 TITLE */}
          <h1 className="text-[36px] md:text-[54px] font-medium leading-[1.1] tracking-[-0.02em] text-[#222222]">
            Opulent Prime Ultra <br /> Luxurious Massage Chair
          </h1>

          {/* 🔥 DESCRIPTION */}
          <p className="text-[15px] text-[#5f6368] leading-[1.85] max-w-[640px]">
            Opulent Prime Zero Gravity Massage Chair offers a relaxing full-body
            massage experience with Bluetooth speakers, zero-gravity
            positioning, and airbag massage options. Designed for premium
            comfort at home.
          </p>

          {/* 🔥 EMI LINE */}
          <div className="flex items-center gap-2 text-[#3f454b] text-[16px]">
            <span>📦</span>
            <p className="text-[16px] leading-none">
              Easy EMI options at checkout
            </p>
          </div>

          {/* 🔥 PRICE */}
          <div className="flex items-center gap-3 flex-wrap">
            <span className="line-through text-[#7a7f85] text-[28px] font-light">
              ₹4,25,000
            </span>
            <span className="text-[36px] font-normal text-[#1f2429]">
              ₹3,62,999
            </span>

            {/* SALE — brand brown + white text (readable on any theme) */}
            <span className="rounded-full bg-[#7a4b2f] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-white shadow-md ring-2 ring-white/90">
              Sale
            </span>
          </div>

          <p className="text-[13px] text-[#8a8f95] -mt-2">Taxes included.</p>

          {/* 🔥 BUTTON */}
          <button
            type="button"
            onClick={() =>
              addToCart({
                id: PRODUCT_ID,
                name: PRODUCT_NAME,
                img: `/mainn/${selectedImage}`,
                price: PRODUCT_PRICE,
              })
            }
            className="w-full rounded-md bg-[#59c86b] py-3 text-[18px] font-medium text-white transition hover:bg-[#45b85b]"
          >
            Add to cart
          </button>

          {/* PRODUCT INFORMATION */}
          <div className="border-t border-gray-200 pt-5 space-y-3">
            {/* PRODUCT FEATURES */}
            <details
              className="group rounded-xl border border-gray-200 bg-gray-50/70 px-4 py-3"
              open
            >
              <summary className="flex justify-between items-center cursor-pointer font-medium text-[26px] text-[#222222]">
                Product Features
                <span className="text-xl text-gray-500 group-open:rotate-180 transition-transform duration-200">
                  ⌄
                </span>
              </summary>

              <div className="mt-3 text-[17px] text-[#4f555c] space-y-2 leading-[1.7]">
                <p>
                  • 24 auto massage programs with 6 premium massage techniques.
                </p>
                <p>• Kneading, rolling, tapping, and Shiatsu massage modes.</p>
                <p>
                  • Intuitive touch LCD remote with AI voice control support.
                </p>
                <p>• Adjustable roller speed and airbag pressure intensity.</p>
                <p>
                  • Customizable massage duration and personalization modes.
                </p>
                <p>
                  • Zero Gravity recline for balanced, weightless relaxation.
                </p>
                <p>• 3D roller mechanism with SL track and heating support.</p>
                <p>
                  • Auto foot extension with dedicated leg massage function.
                </p>
                <p>
                  • Built-in Bluetooth speakers and wireless phone charging.
                </p>
                <p>• Lower-back and calf heat therapy for better recovery.</p>
                <p>• Durable premium build, designed for users up to 110 kg.</p>
                <p>• One-year on-site warranty included with purchase.</p>
              </div>
            </details>

            {/* OFFERS & EMI */}
            <details className="group rounded-xl border border-gray-200 bg-white px-4 py-3">
              <summary className="flex justify-between items-center cursor-pointer font-medium text-[26px] text-[#222222]">
                Offers & EMI Options
                <span className="text-xl text-gray-500 group-open:rotate-180 transition-transform duration-200">
                  ⌄
                </span>
              </summary>

              <div className="mt-3 text-[17px] text-[#4f555c] space-y-2 leading-[1.7]">
                <p>• Complimentary one-year warranty coverage.</p>
                <p>
                  • Up to 12 months No Cost EMI (available at offline stores).
                </p>
                <p>• Free product demonstration and installation support.</p>
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
              <span className="mt-2 inline-block rounded-full bg-[#7a4b2f] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white shadow-sm ring-1 ring-white/80">
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
