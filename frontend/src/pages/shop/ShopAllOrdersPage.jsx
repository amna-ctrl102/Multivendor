import DashboardHeader from "../../components/Shop/Layout/DashboardHeader";
import DashboardSideBar from "../../components/Shop/Layout/DashboardSideBar";
import AllOrders from "../../components/Shop/Layout/AllOrders";

const ShopAllOrdersPage = () => {
  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <DashboardHeader />
      <div className="flex">
        <div className="w-[80px] 800px:w-[330px] shrink-0">
          <DashboardSideBar active={2} />
        </div>
        <div className="flex-1 flex justify-center py-6">
          <AllOrders />
        </div>
      </div>
    </div>
  );
};

export default ShopAllOrdersPage;
