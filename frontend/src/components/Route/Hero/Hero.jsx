import React from "react";
import styles from "../../../styles/styles";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <div
      className={`relative min-h-[70vh] 800px:min-h-[80vh] w-full bg-no-repeat bg-cover bg-left ${styles.normalFlex}`}
      style={{ backgroundImage: "url(https://themes.rslahmed.dev/rafcart/assets/images/banner-2.jpg)" }}
    >
        <div className={`${styles.section} w-[90%] 800px:w-[60%]`}>
            <h1 className={`leading-[1.2] text-[36px] sm:text-[45px] md:text-[50px] lg:text-[60px] text-[#3d3a3a] font-[600] capitalize font-[Poppins]`}>
                Best Collection For <br/> Home Decoration
            </h1>
            <p className="pt-5 text-[14px] sm:text-[15px] md:text-[15px] lg:text-[16px] font-[Poppins] font-[400] text-[#000000ba]">
                Create a home you'll love with our carefully curated collection of furniture,
                lighting, and decorative accessories. Enjoy exceptional quality, modern
                designs, and affordable prices—all in one place.
            </p>
            <Link to="/products" className="inline-block">
                <div className={`${styles.button} mt-5`}>
                    <span className="text-[#fff] font-[Poppins] text-[16px] sm:text-[18px] lg:text-[20px]">
                        Shop Now
                    </span>
                </div>
            </Link>
        </div>
    </div>
  );
};

export default Hero;
