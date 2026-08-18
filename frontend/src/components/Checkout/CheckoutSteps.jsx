import React from "react";
import styles from "../../styles/styles";

const CheckoutSteps = ({ active }) => {
  return (
    <div className="w-full flex justify-center">
      <div className="w-[90%] 800px:w-[60%] flex items-center justify-center">

        {/* Shipping */}
        <div className="flex items-center">
          <div className={styles.cart_button}>
            <span className={styles.cart_button_text}>
              1. Shipping
            </span>
          </div>

          <div
            className={`w-[30px] 800px:w-[70px] h-[4px] ${
              active > 1 ? "bg-[#f63b60]" : "bg-[#FDE1E6]"
            }`}
          ></div>
        </div>

        {/* Payment */}
        <div className="flex items-center">
          <div
            className={`${
              active > 1
                ? styles.cart_button
                : `${styles.cart_button} !bg-[#FDE1E6]`
            }`}
          >
            <span
              className={`${
                active > 1
                  ? styles.cart_button_text
                  : `${styles.cart_button_text} !text-[#f63b60]`
              }`}
            >
              2. Payment
            </span>
          </div>

          <div
            className={`w-[30px] 800px:w-[70px] h-[4px] ${
              active > 2 ? "bg-[#f63b60]" : "bg-[#FDE1E6]"
            }`}
          ></div>
        </div>

        {/* Success */}
        <div className="flex items-center">
          <div
            className={`${
              active > 2
                ? styles.cart_button
                : `${styles.cart_button} !bg-[#FDE1E6]`
            }`}
          >
            <span
              className={`${
                active > 2
                  ? styles.cart_button_text
                  : `${styles.cart_button_text} !text-[#f63b60]`
              }`}
            >
              3. Success
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CheckoutSteps;