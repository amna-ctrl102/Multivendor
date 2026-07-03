import { useSelector } from "react-redux";
import { backend_url } from "../../server";
import {
  AiOutlineArrowRight,
  AiOutlineCamera,
  AiOutlineDelete,
} from "react-icons/ai";
import styles from "../../styles/styles";
import { useState } from "react";
import { Link } from "react-router-dom";
import { MdOutlineTrackChanges } from "react-icons/md";
import { Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

const ProfileContent = ({ active }) => {
  const { user } = useSelector((state) => state.user);
  const [name, setName] = useState(user && user.name);
  const [email, setEmail] = useState(user && user.email);
  const [phoneNumber, setPhoneNumber] = useState();
  const [zipCode, setZipCode] = useState();
  const [address1, setAddress1] = useState();
  const [address2, setAddress2] = useState();

  const handleSubmit = (e) => {
    e.preventDefault();
  };
  return (
    <div className="w-full bg-white shadow-md rounded-[10px] p-4 pt-8">
      {active === 1 && (
        <>
          <div className="flex justify-center w-full">
            <div className="relative">
              <img
                src={`${backend_url}${user?.avatar}`}
                alt="profileImage"
                className="w-28 h-28 md:w-36 md:h-36 rounded-full object-cover border-[3px] border-[#3ad132]"
              />
              <div className="w-[40px] h-[40px] bg-[#3ad132] rounded-full flex items-center justify-center cursor-pointer absolute bottom-[5px] right-[5px]">
                <AiOutlineCamera size={25} color="white" />
              </div>
            </div>
          </div>
          <br />
          <br />
          <div className="w-full px-2 md:px-5">
            <form onSubmit={handleSubmit}>
              <div className="w-full flex flex-col md:flex-row gap-5 md:gap-10">
                <div className="w-full md:w-1/2">
                  <label className="block pb-2">Full Name</label>
                  <input
                    type="text"
                    className={`${styles.input} p-3 focus:outline-none focus:ring-2 focus:ring-[#3ad132] focus:border-[#3ad132]`}
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="w-full md:w-1/2">
                  <label className="block pb-2">Email Address</label>
                  <input
                    type="email"
                    className={`${styles.input} p-3 focus:outline-none focus:ring-2 focus:ring-[#3ad132] focus:border-[#3ad132]`}
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
              <div className="w-full flex flex-col md:flex-row gap-5 md:gap-10 md:mt-5">
                <div className="w-full md:w-1/2">
                  <label className="block pb-2">Phone Number</label>
                  <input
                    type="text"
                    className={`${styles.input} p-3 focus:outline-none focus:ring-2 focus:ring-[#3ad132] focus:border-[#3ad132]`}
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </div>
                <div className="w-full md:w-1/2">
                  <label className="block pb-2">Zip Code</label>
                  <input
                    type="number"
                    className={`${styles.input} p-3 focus:outline-none focus:ring-2 focus:ring-[#3ad132] focus:border-[#3ad132]`}
                    required
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                  />
                </div>
              </div>
              <div className="w-full flex flex-col md:flex-row gap-5 md:gap-10 md:mt-5">
                <div className="w-full md:w-1/2">
                  <label className="block pb-2">Address1</label>
                  <input
                    type="address"
                    className={`${styles.input} p-3 focus:outline-none focus:ring-2 focus:ring-[#3ad132] focus:border-[#3ad132]`}
                    required
                    value={address1}
                    onChange={(e) => setAddress1(e.target.value)}
                  />
                </div>
                <div className="w-full md:w-1/2">
                  <label className="block pb-2">Address2</label>
                  <input
                    type="address"
                    className={`${styles.input} p-3 focus:outline-none focus:ring-2 focus:ring-[#3ad132] focus:border-[#3ad132]`}
                    required
                    value={address2}
                    onChange={(e) => setAddress2(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex justify-center mt-8 mb-7">
                <button
                  className="w-full sm:w-[320px] h-12 flex items-center justify-center bg-[#3ad132] text-white rounded-lg uppercase font-semibold hover:opacity-95 hover:shadow-md transition disabled:opacity-80"
                  type="submit"
                >
                  Update Profile
                </button>
              </div>
            </form>
          </div>
        </>
      )}
      {/* order section */}
      {active === 2 && (
        <div>
          <AllOrders />
        </div>
      )}
      {active === 3 && (
        <div>
          <AllRefundOrders />
        </div>
      )}
      {active === 5 && (
        <div>
          <TrackOrders />
        </div>
      )}
      {active === 6 && (
        <div>
          <PaymentMethod />
        </div>
      )}
      {active === 7 && (
        <div>
          <Address />
        </div>
      )}
    </div>
  );
};

const AllOrders = () => {
  const orders = [
    {
      _id: "7463hvbfbhfbrtr28820221",
      orderItems: [
        {
          name: "Iphone 14 pro max",
        },
      ],
      totalPrice: 120,
      orderStatus: "Processing",
    },
  ];

  const columns = [
    { field: "id", headerName: "Order ID", minWidth: 150, flex: 0.7 },

    {
      field: "status",
      headerName: "Status",
      minWidth: 130,
      flex: 0.7,
      cellClassName: (params) =>
        params.row.status === "Delivered" ? "greenColor" : "redColor",
    },
    {
      field: "itemsQty",
      headerName: "Items Qty",
      type: "number",
      minWidth: 130,
      flex: 0.7,
    },

    {
      field: "total",
      headerName: "Total",
      type: "number",
      minWidth: 130,
      flex: 0.8,
    },

    {
      field: " ",
      flex: 1,
      minWidth: 150,
      headerName: "",
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Link to={`/order/${params.id}`}>
              <Button>
                <AiOutlineArrowRight size={20} />
              </Button>
            </Link>
          </>
        );
      },
    },
  ];

  const row = [];
  orders &&
    orders.forEach((item) => {
      row.push({
        id: item._id,
        itemsQty: item.orderItems.length,
        total: "US$ " + orders.totalPrice,
        status: item.orderStatus,
      });
    });

  return (
    <div className="pl-8 pt-1">
      <h1 className="text-[25px] font-[600] text-[#000000ba] pb-2">
        My Orders
      </h1>
      <div className="w-full overflow-x-auto">
        <div style={{ minWidth: "850px" }}>
          <DataGrid rows={row} columns={columns} pageSize={10} autoHeight />
        </div>
      </div>
    </div>
  );
};

const AllRefundOrders = () => {
  const orders = [
    {
      _id: "7463hvbfbhfbrtr28820221",
      orderItems: [
        {
          name: "Iphone 14 pro max",
        },
      ],
      totalPrice: 120,
      orderStatus: "Processing",
    },
  ];

  const columns = [
    { field: "id", headerName: "Order ID", minWidth: 150, flex: 0.7 },

    {
      field: "status",
      headerName: "Status",
      minWidth: 130,
      flex: 0.7,
      cellClassName: (params) =>
        params.row.status === "Delivered" ? "greenColor" : "redColor",
    },
    {
      field: "itemsQty",
      headerName: "Items Qty",
      type: "number",
      minWidth: 130,
      flex: 0.7,
    },

    {
      field: "total",
      headerName: "Total",
      type: "number",
      minWidth: 130,
      flex: 0.8,
    },

    {
      field: " ",
      flex: 1,
      minWidth: 150,
      headerName: "",
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Link to={`/order/${params.id}`}>
              <button>
                <AiOutlineArrowRight size={20} />
              </button>
            </Link>
          </>
        );
      },
    },
  ];

  const row = [];
  orders &&
    orders.forEach((item) => {
      row.push({
        id: item._id,
        itemsQty: item.orderItems.length,
        total: "US$ " + orders.totalPrice,
        status: item.orderStatus,
      });
    });

  return (
    <div className="pl-8 pt-1">
      <h1 className="text-[25px] font-[600] text-[#000000ba] pb-2">
        Refund Requests
      </h1>
      <div className="w-full overflow-x-auto">
        <div style={{ minWidth: "850px" }}>
          <DataGrid rows={row} columns={columns} pageSize={10} autoHeight />
        </div>
      </div>
    </div>
  );
};

const TrackOrders = () => {
  const orders = [
    {
      _id: "7463hvbfbhfbrtr28820221",
      orderItems: [
        {
          name: "Iphone 14 pro max",
        },
      ],
      totalPrice: 120,
      orderStatus: "Processing",
    },
  ];

  const columns = [
    { field: "id", headerName: "Order ID", minWidth: 150, flex: 0.7 },

    {
      field: "status",
      headerName: "Status",
      minWidth: 130,
      flex: 0.7,
      cellClassName: (params) =>
        params.row.status === "Delivered" ? "greenColor" : "redColor",
    },
    {
      field: "itemsQty",
      headerName: "Items Qty",
      type: "number",
      minWidth: 130,
      flex: 0.7,
    },

    {
      field: "total",
      headerName: "Total",
      type: "number",
      minWidth: 130,
      flex: 0.8,
    },

    {
      field: " ",
      flex: 1,
      minWidth: 150,
      headerName: "",
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <>
            <Link to={`/order/${params.id}`}>
              <button>
                <MdOutlineTrackChanges size={20} />
              </button>
            </Link>
          </>
        );
      },
    },
  ];

  const row = [];
  orders &&
    orders.forEach((item) => {
      row.push({
        id: item._id,
        itemsQty: item.orderItems.length,
        total: "US$ " + orders.totalPrice,
        status: item.orderStatus,
      });
    });

  return (
    <div className="pl-8 pt-1">
      <h1 className="text-[25px] font-[600] text-[#000000ba] pb-2">
        Track Your Orders
      </h1>
      <div className="w-full overflow-x-auto">
        <div style={{ minWidth: "850px" }}>
          <DataGrid rows={row} columns={columns} pageSize={10} autoHeight />
        </div>
      </div>
    </div>
  );
};

const PaymentMethod = () => {
  return (
    <div className="w-full px-5">
      <div className="w-full flex items-center justify-between">
        <h1 className="text-[25px] font-[600] text-[#000000ba] pb-2">
          Payment Methods
        </h1>
        <div className={`${styles.button} rounded-md`}>
          <span className="text-[#fff]">Add New</span>
        </div>
      </div>
      <br />
      <div className="w-full bg-white rounded-md p-4 shadow flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSIm-CDW8sxq_bPRtnasu58FbGuuAP-daD2QWaeWDvTtQ&s=10"
            alt=""
            className="w-[50px] h-[50px]"
          />
          <h5 className="pl-5 font-[600]">Amna Atiq</h5>
        </div>
        <div className="pl-8 flex items-center">
          <h6>1234 **** **** ****</h6>
          <h5 className="pl-6">03/2026</h5>
        </div>
        <div className="min-w-[10%] flex items-center justify-between pl-8">
          <AiOutlineDelete size={25} className="cursor-pointer" />
        </div>
      </div>
    </div>
  );
};

const Address = () => {
  return (
    <div className="w-full px-5">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-[25px] font-[600] text-[#000000ba] pb-2">
          My Addresses
        </h1>
        <div className={`${styles.button} rounded-md`}>
          <span className="text-[#fff]">Add New</span>
        </div>
      </div>
      <br />
      <div className="w-full bg-white h-[70px] rounded-[4px] flex items-center px-3 shadow justify-between pr-10">
        <div className="flex items-center">
          <h5 className="pl-5 font-[600]">Default</h5>
        </div>
        <div className="pl-8 flex items-center">
          <h6 className="pl-6">House# 852 block# 49 Samanabad</h6>
        </div>
        <div className="pl-8 flex items-center">
          <h6 className="pl-6">+92 322498368</h6>
        </div>
        <div className="min-w-[10%] flex items-center justify-between pl-8">
          <AiOutlineDelete size={25} className="cursor-pointer" />
        </div>
      </div>
    </div>
  );
};

export default ProfileContent;
