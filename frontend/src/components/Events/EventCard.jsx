import React from "react";
import CountDown from "./CountDown";
import { backend_url } from "../../server";

const EventCard = ({ active, data }) => {
  if (!data) {
    return null;
  }

  const imageUrl = data.images?.[0]
    ? `${backend_url}${data.images[0]}`
    : "/default-event.png";

  return (
    <div
      className={`w-full bg-white rounded-lg overflow-hidden lg:flex p-4 gap-4 ${active ? "unset" : "mb-12"}`}
    >
      <div className="w-full lg:w-1/2 flex justify-center items-center">
        <img
          src={imageUrl}
          alt="EventImage"
          className="w-full max-w-[500px] h-[300px] lg:h-[400px] object-cover rounded-lg"
        />
      </div>
      <div className="w-full lg:w-[50%] flex flex-col justify-start p-4 sm:p-6 lg:p-8">
        <h2 className={`text-xl sm:text-2xl lg:text-3xl font-bold mb-3`}>
          {data.name}
        </h2>
        <p className="text-gray-600 text-sm sm:text-base mb-3">
          {data.description}
        </p>
        <div className="flex py-2 justify-between flex-wrap gap-3">
          <div className="flex items-center flex-wrap">
            <h5 className="font-[500] text-[15px] 800px:text-[18px] text-[#d55b45] pr-3 line-through">
              {data.originalPrice ?? 0} $
            </h5>
            <h5 className="font-bold text-[18px] 800px:text-[20px] text-[#333] font-Roboto">
              {data.discountPrice ?? 0} $
            </h5>
          </div>
          <span className="pr-3 font-[400] text-[18px] text-[#44a55e]">
            {data.sold_out ?? 0} sold
          </span>
        </div>
        <div className="mb-5 text-[15px] sm:text-xl">
          <CountDown data={data} />
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <button className="px-8 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition">
            See Details
          </button>

          <button className="px-8 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
