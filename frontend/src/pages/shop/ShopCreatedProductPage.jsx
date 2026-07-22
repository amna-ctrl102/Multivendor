import React from 'react'
import DashboardHeader from '../../components/Shop/Layout/DashboardHeader'
import DashboardSideBar from '../../components/Shop/Layout/DashboardSideBar'
import CreateProduct from '../../components/Shop/Layout/CreateProduct';

const ShopCreatedProductPage = () => {
  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <DashboardHeader />
      <div className="flex">
        <div className="w-[80px] 800px:w-[330px] shrink-0">
          <DashboardSideBar active={4} />
        </div>
        <div className="flex-1 flex justify-center py-6">
          <CreateProduct />
        </div>
      </div>
    </div>
  )
}

export default ShopCreatedProductPage
