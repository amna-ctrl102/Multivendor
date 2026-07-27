import DashboardSideBar from '../../components/Shop/Layout/DashboardSideBar'
import DashboardHeader from '../../components/Shop/Layout/DashboardHeader'
import CreateEvents from "../../components/Shop/Layout/CreateEvents";

const ShopCreateEventsPage = () => {
  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <DashboardHeader />
      <div className="flex">
        <div className="w-[80px] 800px:w-[330px] shrink-0">
          <DashboardSideBar active={6} />
        </div>
        <div className="flex-1 flex justify-center py-6">
          <CreateEvents />
        </div>
      </div>
    </div>
  )
}

export default ShopCreateEventsPage
