import SiteWrapper from "@/components/siteWrapper";
import Link from "next/link";
import { getSession, useSession, signIn, signOut } from "next-auth/react";
import API from "@/lib/api";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";

import { useRef } from "react";

import UserDetailSlideover from "@/components/users/UserDetailSlideover";
import OrdersTable from "@/components/dashboard/ordersTable";
import OrderModel from "@/lib/models/order-model";
function Example({ role, siteData }) {
  const router = useRouter();
  const { data: session } = useSession();

  const [orders, setOrders] = useState([]);
  const [paginationData, setPaginationData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const isManager = role === "Manager";
  const pageNumberRef = useRef(1);
  const [creditTotal, setCreditTotal] = useState(0);
  const [isUserDetailSlideoverOpen, setIsUserDetailSlideoverOpen] =
    useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    if (session) {
      pageNumberRef.current = 1;
      setOrders([]);
      fetchOrders();
      fetchCreditTotal();
    }
  }, [session]);

  const fetchCreditTotal = async () => {
    const result = await API.credits.calcTotal({ session });
    console.log({ creditTotal: result.data });
    setCreditTotal(result.data);
  };

  const fetchOrders = async () => {
    setIsLoading(true);

    const response = await API.orders
      .find({
        pageNumber: pageNumberRef.current,
        session,
      })
      .then(function (result) {
        setOrders(result.data.data);
        let orderModels = result.data.data.map((order) => {
          return new OrderModel(order);
        });
        setOrders(orderModels);
        setPaginationData(result.data.meta.pagination);
        setIsLoading(false);
      });
  };

  const nextPage = () => {
    pageNumberRef.current += 1;
    fetchOrders();
  };

  const prevPage = () => {
    pageNumberRef.current -= 1;
    fetchOrders();
  };

  return (
    <SiteWrapper siteData={siteData}>
      {/*
        This example requires updating your template:

        ```
        <html class="h-full bg-gray-50">
        <body class="h-full">
        ```
      */}
      <UserDetailSlideover
        open={isUserDetailSlideoverOpen}
        setOpen={setIsUserDetailSlideoverOpen}
        name={selectedUser?.attributes.name}
        email={selectedUser?.attributes.email}
        company_type={selectedUser?.attributes.company_type}
      />
      <div className="min-h-full py-12 px-4 sm:px-6 lg:px-8 h-full max-w-7xl mx-auto">
        <div className="flex flex-col gap-16 mt-6 ">
          <div className="space-y-4 col-span-2 w-full">
            <h2 className="text-4xl text-gray-900">Billing</h2>
            <p>
              <span className="font-bold text-indigo-600">
                ${creditTotal.toFixed(2)}
              </span>{" "}
              credits available{" "}
            </p>
            <div className="w-full flex flex-col gap-2">
              {orders?.length > 0 ? (
                <OrdersTable orders={orders} />
              ) : (
                <div className="flex flex-col items-center justify-center">
                  <p className="text-2xl text-gray-400">No purchases yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </SiteWrapper>
  );
}

export const getServerSideProps = async (context) => {
  const session = await getSession(context);
  const { params } = context;
  const { site } = params;
  // console.log("site params", site)
  let siteData;
  if (site.includes(".")) {
    siteData = await API.sites.get({ customDomain: site });
  } else {
    siteData = await API.sites.get({ subdomain: site });
  }
  if (!session) {
    return {
      redirect: {
        permanent: false,
        destination: "/login",
      },
    };
  }

  return {
    props: {
      // orders: orders,
      siteData: siteData,
      role: session.role,
    },
  };
};

export default Example;
