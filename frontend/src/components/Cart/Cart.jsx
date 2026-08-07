import { useState } from "react";
import { RxCross1 } from "react-icons/rx";
import styles from "../../styles/styles";
import { IoBagHandleOutline } from "react-icons/io5";
import { HiPlus, HiOutlineMinus } from "react-icons/hi";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { backend_url } from "../../server";
import { addToCart, removeFromCart } from "../../redux/actions/cart";
import { toast } from "react-toastify";

const Cart = ({ setOpenCart }) => {
  const { cart } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const removeFromCartHandler = (data) => {
    dispatch(removeFromCart(data));
  };

  const totalPrice = cart.reduce((acc, item) => {
    return item.discountPrice
      ? acc + item.qty * item.discountPrice
      : acc + item.qty * item.originalPrice;
  }, 0);

  const quantityChangeHandler = (data) => {
    dispatch(addToCart(data));
  };

  return (
    <div className="fixed top-0 left-0 w-full bg-[#0000004b] h-screen z-10">
      <div className="fixed top-0 right-0 h-screen w-[25%] bg-white flex flex-col shadow-sm">
        {cart && cart.length === 0 ? (
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-4">
              {/* Item Length */}
              <div className={`${styles.normalFlex}`}>
                <IoBagHandleOutline size={25} />
                <h5 className="pl-2 text-[20px] font-[500]">
                  {cart.length} items
                </h5>
              </div>

              <RxCross1
                size={25}
                className="cursor-pointer"
                onClick={() => setOpenCart(false)}
              />
            </div>
            <div className="flex-1 flex items-center justify-center">
              <h5 className="text-lg font-medium">Cart is empty!</h5>
            </div>
          </div>
        ) : (
          <>
            <div className="flex flex-col flex-1 overflow-hidden">
              <div className="flex items-center justify-between p-4">
                {/* Item Length */}
                <div className={`${styles.normalFlex}`}>
                  <IoBagHandleOutline size={25} />
                  <h5 className="pl-2 text-[20px] font-[500]">
                    {cart.length} items
                  </h5>
                </div>

                <RxCross1
                  size={25}
                  className="cursor-pointer"
                  onClick={() => setOpenCart(false)}
                />
              </div>
              {/* cart Single items */}
              <br />
              <div className="flex-1 overflow-y-auto hide-scrollbar border-t">
                {cart &&
                  cart.map((i, index) => (
                    <CartSingle
                      key={index}
                      data={i}
                      quantityChangeHandler={quantityChangeHandler}
                      removeFromCartHandler={removeFromCartHandler}
                    />
                  ))}
              </div>
            </div>
            {/* Checkout button */}
            <div className="px-5 mb-3 mt-3">
              <Link to="/checkout">
                <div
                  className={`h-[45px] flex items-center justify-center w-[100%] bg-[#e44343] rounded-[5px]`}
                >
                  <h1 className="text-[#fff] text-[18px] font-[600]">
                    Checkout Now (USD ${totalPrice})
                  </h1>
                </div>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const CartSingle = ({ data, quantityChangeHandler, removeFromCartHandler }) => {
  const [value, setValue] = useState(data.qty);

  const totalPrice = data.discountPrice
    ? data.discountPrice * value
    : data.originalPrice * value;

  const increment = (data) => {
    const nextValue = value + 1;

    if (data.stock < nextValue) {
      toast.error("product stock limited!");
    } else {
      setValue(nextValue);
      const updateCartData = { ...data, qty: nextValue };
      quantityChangeHandler(updateCartData);
    }
  };

  const decrement = (data) => {
    const nextValue = value === 1 ? 1 : value - 1;
    setValue(nextValue);
    const updateCartData = { ...data, qty: nextValue };
    quantityChangeHandler(updateCartData);
  };

  return (
    <div className="border-b p-2">
      <div className="w-full h-min flex items-center">
        <div className="flex flex-col items-center">
          <div
            className={`bg-[#e44343] border border-[#e4434373] rounded-full w-[23px] h-[23px] ${styles.normalFlex} justify-center cursor-pointer mb-1`}
            onClick={() => increment(data)}
          >
            <HiPlus size={18} color="#fff" />
          </div>
          <span className="w-8 text-center">{value}</span>
          <div
            className="bg-[#a7abb14f] rounded-full w-[23px] h-[23px] flex items-center justify-center cursor-pointer mt-1"
            onClick={() => decrement(data)}
          >
            <HiOutlineMinus size={18} color="#7d879c" />
          </div>
        </div>
        <img
          src={`${backend_url}${data?.images && data?.images[0]}`}
          alt="CartImage"
          className="w-[56px] h-[75px] m-5"
        />
        <div className="pl-[5px]">
          <h1 className="text-[15px]">{data.name}</h1>
          <h4 className="font-[400] text-[13px] text-[#00000082]">
            ${data.discountPrice ? data.discountPrice : data.originalPrice} x{" "}
            {value}
          </h4>
          <h4 className="font-[600px] text-[15px] pt-[3px] text-[#d02222] font-Roboto">
            USD ${totalPrice}
          </h4>
        </div>
        <RxCross1
          className="cursor-pointer ml-8"
          onClick={() => removeFromCartHandler(data)}
        />
      </div>
    </div>
  );
};

export default Cart;
