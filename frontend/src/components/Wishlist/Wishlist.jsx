import { RxCross1 } from "react-icons/rx";
import styles from "../../styles/styles";
import { BsCartPlus } from "react-icons/bs";
import { AiOutlineHeart } from "react-icons/ai";

const Wishlist = ({ setWishList }) => {
  const cartData = [
    {
      name: "Iphone 14 pro max",
      description: "test",
      price: 999,
    },
    {
      name: "Iphone 14 pro max",
      description: "test",
      price: 245,
    },
    {
      name: "Iphone 14 pro max",
      description: "test",
      price: 645,
    },
  ];
  return (
    <div className="fixed top-0 left-0 w-full bg-[#0000004b] h-screen z-10">
      <div className="fixed top-0 right-0 min-h-full w-[25%] bg-white flex flex-col justify-between shadow-sm">
        <div>
          <div className="flex w-full justify-end pt-5 pr-5">
            <RxCross1
              size={25}
              className="cursor-pointer"
              onClick={() => setWishList(false)}
            />
          </div>
          {/* Item Length */}
          <div className={`${styles.normalFlex} p-4`}>
            <AiOutlineHeart size={25} />
            <h5 className="pl-2 text-[20px] font-[500]">3 items</h5>
          </div>
          {/* wishList Single items */}
          <br />
          <div className="w-full border-t">
            {cartData &&
              cartData.map((i, index) => <CartSingle key={index} data={i} />)}
          </div>
        </div>
      </div>
    </div>
  );
};

const CartSingle = ({ data }) => {
  return (
    <div className="border-b p-4">
      <div className="w-full flex items-center">
        <RxCross1 className="cursor-pointer" />
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSeZaOdPZiAUmlU-zuaFhu8Llam8KYlmW_gVfHEOirweQ&s=10"
          alt="WishlistImage"
          className="w-[56px] h-[56px] ml-5"
        />
        <div className="pl-[5px]">
          <h1 className="text-[15px]">{data.name}</h1>
          <h4 className="font-[600px] text-[15px] pt-[3px] text-[#d02222] font-Roboto">
            USD $
          </h4>
        </div>
        <div className="ml-8">
          <h4>
            <BsCartPlus
              size={20}
              className="cursor-pointer"
              title="Add to cart"
            />
          </h4>
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
