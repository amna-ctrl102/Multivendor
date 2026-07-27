import DashboardHeader from '../../components/Shop/Layout/DashboardHeader'
import DashboardSideBar from '../../components/Shop/Layout/DashboardSideBar'
import AllEvents from "../../components/Shop/Layout/AllEvents";

const ShopAllEventsPage = () => {
  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <DashboardHeader />
      <div className="flex">
        <div className="w-[80px] 800px:w-[330px] shrink-0">
          <DashboardSideBar active={5} />
        </div>
        <div className="flex-1 flex justify-center py-6">
          <AllEvents />
        </div>
      </div>
    </div>
  )
}

export default ShopAllEventsPage
