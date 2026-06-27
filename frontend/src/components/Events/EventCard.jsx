import React from "react";
import styles from "../../styles/styles";
import CountDown from "./CountDown";

const EventCard = ({active}) => {
  return (
    <div className={`w-full block bg-white rounded-lg ${active? "unset":"mb-12"} lg:flex p-2`}>
      <div className="w-full lg:w-[50%] m-auto">
        <img
          src="https://m.media-amazon.com/images/I/31Vle5fVdaL.jpg"
          alt="EventImage"
        />
      </div>
      <div className="w-full lg:w-[50%] flex flex-col justify-center">
        <h2 className={`${styles.productTitle}`}>Iphone 41pro max 8/256gb</h2>
        <p>
          Experience the perfect blend of performance, style, and innovation
          with the iPhone. Featuring a stunning display, powerful processor,
          advanced camera system, and long-lasting battery life, it delivers a
          smooth and reliable experience for everyday use. Capture high-quality
          photos and videos, enjoy seamless multitasking, and stay connected
          with the latest iOS features. Designed with premium materials and
          built for durability, the iPhone is an excellent choice for work,
          entertainment, and everything in between.
        </p>
        <div className="flex py-2 justify-between">
          <div className="flex">
            <h5 className="font-[500] text-[18px] text-[#d55b45] pr-3 line-through">
              1099$
            </h5>
            <h5 className="font-bold text-[20px] text-[#333] font-Roboto">
                999$
            </h5>
          </div>
          <span className="pr-3 font-[400] text-[17px] text-[#44a55e]">
            120 Sold
          </span>
        </div>
        <CountDown/>
      </div>
    </div>
  );
};

export default EventCard;
