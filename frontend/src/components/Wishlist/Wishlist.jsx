import { RxCross1 } from "react-icons/rx";
import styles from "../../styles/styles";
import { BsCartPlus } from "react-icons/bs";
import { AiOutlineHeart } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { removeFromWishlist } from "../../redux/actions/wishlist";
import { backend_url } from "../../server";
import { addToCart } from "../../redux/actions/cart";

const Wishlist = ({ setWishList }) => {
  const { wishlist } = useSelector((state) => state.wishlist);
  const dispatch = useDispatch();

  const removeFromWishlistHandler = (data) => {
    dispatch(removeFromWishlist(data));
  };

  const addToCartHandler=(data)=>{
    const newData={...data, qty: 1};
    dispatch(addToCart(newData));
    dispatch(removeFromWishlist(newData));
    setWishList(false);
  }

  return (
    <div className="fixed top-0 left-0 w-full bg-[#0000004b] h-screen z-10">
      <div className="fixed top-0 right-0 h-screen w-[25%] bg-white flex flex-col shadow-sm">
        {wishlist && wishlist.length === 0 ? (
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-4">
              {/* Item Length */}
              <div className={`${styles.normalFlex}`}>
                <AiOutlineHeart size={25} />
                <h5 className="pl-2 text-[20px] font-[500]">
                  {wishlist.length} items
                </h5>
              </div>

              <RxCross1
                size={25}
                className="cursor-pointer"
                onClick={() => setWishList(false)}
              />
            </div>
            <div className="flex-1 flex items-center justify-center">
              <h5 className="text-lg font-medium">wishlist is empty!</h5>
            </div>
          </div>
        ) : (
          <>
            <div className="flex flex-col flex-1 overflow-hidden">
              <div className="flex items-center justify-between p-4">
                {/* Item Length */}
                <div className={`${styles.normalFlex}`}>
                  <AiOutlineHeart size={25} />
                  <h5 className="pl-2 text-[20px] font-[500]">
                    {wishlist.length} items
                  </h5>
                </div>

                <RxCross1
                  size={25}
                  className="cursor-pointer"
                  onClick={() => setWishList(false)}
                />
              </div>
              {/* wishList Single items */}
              <br />
              <div className="flex-1 overflow-y-auto hide-scrollbar border-t">
                {wishlist &&
                  wishlist.map((i, index) => (
                    <CartSingle
                      key={index}
                      data={i}
                      removeFromWishlistHandler={removeFromWishlistHandler}
                      addToCartHandler={addToCartHandler}
                    />
                  ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const CartSingle = ({ data, removeFromWishlistHandler, addToCartHandler }) => {
  const totalPrice =
    data.discountPrice != null ? data.discountPrice : data.originalPrice;
  return (
    <div className="border-b p-4">
      <div className="w-full flex items-center">
        <RxCross1
          className="cursor-pointer"
          onClick={() => removeFromWishlistHandler(data)}
        />
        <img
          src={`${backend_url}${data?.images && data?.images[0]}`}
          alt="WishlistImage"
          className="w-[75px] h-[75px] ml-3"
        />
        <div className="ml-3">
          <h1 className="text-[15px]">{data.name}</h1>
          <h4 className="font-[600px] text-[15px] pt-[3px] text-[#d02222] font-Roboto">
            USD ${totalPrice}
          </h4>
        </div>
        <div className="ml-8">
          <h4>
            <BsCartPlus
              size={20}
              className="cursor-pointer"
              title="Add to cart"
              onClick={()=> addToCartHandler(data)}
            />
          </h4>
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
