import { useEffect, useState } from "react";
import { RxCross1 } from "react-icons/rx";
import styles from "../../../styles/styles";
import {
  AiFillHeart,
  AiOutlineHeart,
  AiOutlineMessage,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { Link } from "react-router-dom";
import { backend_url } from "../../../server";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { addToCart } from "../../../redux/actions/cart";
import { addToWishlist, removeFromWishlist } from "../../../redux/actions/wishlist";

const ProductDetailsCard = ({ setOpen, data }) => {
  const { cart } = useSelector((state) => state.cart);
  const { wishlist } = useSelector((state) => state.wishlist);
  const [count, setCount] = useState(1);
  const [click, setClick] = useState();
  const dispatch = useDispatch();

  const handleMessageSubmit = () => {};

  const decrementCount = () => {
    if (count > 1) {
      setCount(count - 1);
    }
  };

  const IncrementCount = () => {
    setCount(count + 1);
  };

  const addToCartHandler = (id) => {
    const isItemExists = cart && cart.find((i) => i._id === id);
    if (isItemExists) {
      toast.error("Item is already in cart!");
    } else {
      if (data.stock < count) {
        toast.error("product stock limited!");
      } else {
        const cartData = { ...data, qty: count };
        dispatch(addToCart(cartData));
        toast.success("Item added to cart successfully!");
      }
    }
  };

  useEffect(() => {
    if (data && wishlist && wishlist.find((i) => i._id === data._id)) {
      setClick(true);
    } else {
      setClick(false);
    }
  }, [wishlist, data]);

  const removeFromWishlistHandler = (data) => {
    setClick(!click);
    dispatch(removeFromWishlist(data));
  };

  const addToWishlistHandler = (data) => {
    setClick(!click);
    dispatch(addToWishlist(data));
  };

  return (
    <div className="bg-[#fff]">
      {data ? (
        <div className="fixed w-full h-screen top-0 left-0 bg-[#00000030] z-40 flex items-center justify-center">
          <div className="w-[90%] 800px:w-[60%] h-[80vh] overflow-y-auto bg-white rounded-md shadow-sm relative p-4 800px:mt-10">
            <RxCross1
              size={22}
              className="absolute right-1 top-3 z-50 800px:right-3"
              onClick={() => setOpen(false)}
            />
            <div className="block w-full 800px:flex">
              <div className="w-full 800px:w-[50%]">
                <img
                  src={`${backend_url}${data.images && data.images[0]}`}
                  alt="ProductDetailsCardImage"
                  className="w-[95%] object-cover"
                />
                <div className="flex mt-3">
                  <Link
                    to={`/shop/preview/${data.shop._id}`}
                    className="flex mt-3"
                  >
                    <img
                      src={`${backend_url}${data?.shop?.avatar}`}
                      alt="shopImage"
                      className="w-[50px] h-[50px] rounded-full mr-2 mt-3"
                    />
                    <div>
                      <h3 className={`${styles.shop_name}`}>
                        {data?.shop?.name}
                      </h3>
                      <h5 className="pb-5 text-[15px]">(4/5) Ratings</h5>
                    </div>
                  </Link>
                </div>
                <div
                  className={`${styles.button} w-full 800px:w-auto mt-3 rounded-md h-11 px-5 flex items-center justify-center cursor-pointer`}
                  onClick={handleMessageSubmit}
                >
                  <span className="text-white flex items-center gap-2 text-sm 800px:text-base font-medium">
                    Send Message
                    <AiOutlineMessage />
                  </span>
                </div>
                <h5 className="text-[16px] text-[red]">
                  ({data.sold_out}) Sold out
                </h5>
              </div>
              <div className="w-full 800px:w-[50%] pt-5 pl-[5px] pr-[5px]">
                <h1 className={`${styles.productTitle} text-[20px]`}>
                  {data.name}
                </h1>
                <p>{data.description}</p>
                <div className="flex pt-3 mt-2">
                  <h4 className={`${styles.productDiscountPrice}`}>
                    {data.discountPrice}$
                  </h4>
                  <h3 className={`${styles.price}`}>
                    {data.originalPrice ? data.originalPrice + " $" : null}
                  </h3>
                </div>
                <div className="flex items-center mt-6 justify-between pr-3">
                  <div className="flex items-center mt-5">
                    <button
                      className="w-12 h-12 bg-gradient-to-r from-teal-400 to-teal-500 text-white font-bold rounded-l-md px-4 py-2 shadow-lg hover:opacity-75 transition duration-300 ease-in-out"
                      onClick={decrementCount}
                    >
                      -
                    </button>
                    <span className="w-12 h-12 flex items-center justify-center bg-gray-200 text-gray-800 font-medium text-lg">
                      {count}
                    </span>
                    <button
                      className="w-12 h-12 bg-gradient-to-r from-teal-400 to-teal-500 text-white font-bold rounded-r-md px-4 py-2 shadow-lg hover:opacity-75 transition duration-300 ease-in-out"
                      onClick={IncrementCount}
                    >
                      +
                    </button>
                  </div>
                  <div className="mt-5">
                    {click ? (
                      <AiFillHeart
                        size={30}
                        className="cursor-pointer"
                        onClick={() => removeFromWishlistHandler(data)}
                        color={click ? "red" : "#333"}
                        title="Remove from wishList"
                      />
                    ) : (
                      <AiOutlineHeart
                        size={30}
                        className="cursor-pointer"
                        onClick={() => addToWishlistHandler(data)}
                        color={click ? "red" : "#333"}
                        title="Add to wishList"
                      />
                    )}
                  </div>
                </div>
                <div
                  className={`${styles.button} w-full 800px:w-auto mt-6 rounded-md h-11 px-5 flex items-center justify-center cursor-pointer`}
                  onClick={() => addToCartHandler(data._id)}
                >
                  <span className="text-white flex items-center gap-2 text-sm 800px:text-base font-medium">
                    Add to cart <AiOutlineShoppingCart />
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default ProductDetailsCard;
