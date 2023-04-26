import { getSession, useSession, signIn, signOut } from "next-auth/react";
import React, { useState, useRef, useEffect } from "react";
import Cart from "@/components/cart";
import PressList from "@/components/publications/pressList";
import API from "@/lib/api";
import UnlockPricingModal from "@/components/publications/unlockPricingModal";
import { ShoppingCartIcon } from "@heroicons/react/outline";
import PublicationDetailModal from "@/components/publications/publication-detail-modal";
import SiteWrapper from "@/components/siteWrapper";
import Tooltip from "@/components/tooltip";
import PublicationInquiryModal from "@/components/publications/publicationInquiryModal";
import * as klaviyo from "@/lib/tracking/klaviyo";
import { useRouter } from "next/router";
import ProfileModel from "@/lib/models/profile-model";
import Navbar from "@/components/navbar";
import CartContext from "@/components/CartContext";

const IndexPage = ({ site, publication_categories, profile }) => {
  const [siteData, setSiteData] = useState(site);
  const [openCart, setOpenCart] = useState(false);

  const [publications, setPublications] = useState([]);
  const [featuredPublications, setFeaturedPublications] = useState([]);

  const [paginationData, setPaginationData] = useState();

  const pageNumberRef = useRef(1);
  const [isDetailOpen, setDetailOpen] = useState(false);
  const [highlightedPublication, setHighlightedPublication] = useState(null);
  const [isInquiryOpen, setInquiryOpen] = useState(false);
  const [canViewPricing, setCanViewPricing] = useState(false);
  const router = useRouter();

  const [list, updateList] = useState([]);
  const [filters, setFilters] = useState({
    publicationFilters: {},
    searchQuery: null,
    category: null,
    sort: ["publication.popularity_rank:desc"],
  });
  const [isLoadingPublications, setIsLoadingPublications] = useState(false);
  const { data: session } = useSession();
  const filtersRef = useRef();

  const [openAccessPricingModal, setOpenAccessPricingModal] = useState(false);

  useEffect(() => {
    if (session) {
      setCanViewPricing(true);
      return;
    }
    if (localStorage.getItem("allow_pricing_access") === "true") {
      setCanViewPricing(true);
      return;
    }

    //check if query has allow access to pricing and if so, set state to allow access
    const queryString = require("query-string");
    const parsed = queryString.parse(location.search);
    const allow_pricing_access = parsed.allow_pricing_access;
    //if no query param, check if local storage has access

    if (allow_pricing_access) {
      setCanViewPricing(true);

      localStorage.setItem("allow_pricing_access", true);

      router.replace("/publications");
    }
  }, [session]);

  const handleAddItem = (item) => {
    if (!canViewPricing || !session) {
      setOpenAccessPricingModal(true);
      return;
    }
    const idx = list.findIndex((listItem) => listItem.id === item.id);

    if (idx === -1) {
      updateList((list) => [...list, { ...item, quantity: 1 }]);
    } else {
      let newList = [...list];
      newList[idx] = { ...newList[idx], quantity: newList[idx].quantity + 1 };

      updateList((list) => [...newList]);
    }

    setDetailOpen(false);
    setOpenCart(true);
  };

  const handleRemoveItem = (selectedItem) => {
    updateList(list.filter((item) => item.id !== selectedItem.id));
  };

  const nextPage = () => {
    pageNumberRef.current += 1;
    fetchPublications();
  };

  const prevPage = () => {
    pageNumberRef.current -= 1;
    fetchPublications();
  };

  const handleSort = (e) => {
    e.preventDefault();
    let query = e.target.getAttribute("data-sort");
    // alert(query)
    pageNumberRef.current = 1;
    setFilters({
      publicationFilters: filters.publicationFilters,
      searchQuery: filters.query,
      category: filters.category,
      sort: query,
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    let query = e.target.value;

    pageNumberRef.current = 1;
    setFilters({
      publicationFilters: filters.publicationFilters,
      searchQuery: query,
      category: filters.category,
      sort: filters.sort,
    });
  };

  const handleCategory = (category) => {
    pageNumberRef.current = 1;
    setFilters({
      publicationFilters: filters.publicationFilters,
      searchQuery: filters.searchQuery,
      category: category,
      sort: filters.sort,
    });
  };

  const handlePublicationDetailsOpen = (publication) => {
    if (!session) {
      setOpenAccessPricingModal(true);
      return;
    }
    setDetailOpen(true);
    setHighlightedPublication(publication);
  };

  const handlePublicationInquiryOpen = (publication) => {
    if (!session) {
      setOpenAccessPricingModal(true);
      return;
    }
    setDetailOpen(false);
    setInquiryOpen(true);
    setHighlightedPublication(publication);
  };

  useEffect(() => {
    if (filtersRef.current == filters || !siteData?.id) {
      return;
    }
    fetchFeaturedPublications();
  }, [filters, siteData]);

  useEffect(() => {
    if (filtersRef.current == filters || !siteData?.id) {
      return;
    }
    setPublications([]);
    fetchPublications();
    filtersRef.current = filters;
  }, [filters, siteData]);

  const fetchPublications = async () => {
    console.log("fetching publications");

    let { searchQuery, category, sort, publicationFilters } = filters;
    setIsLoadingPublications(true);

    const response = await API.site_publications
      .find({
        pageNumber: pageNumberRef.current,
        searchQuery,
        category,
        sort,
        publicationFilters,
        site_id: siteData.id,
        pageSize: 100,
        session,
        showBasePrices: siteData.attributes.use_base_publication_pricing,
        showHidden: siteData.attributes.is_internal || false, //if site is internal show master publications
      })
      .then(function (result) {
        if (pageNumberRef.current > 1) {
          const publicationData = [...publications, ...result.data];
          const publicationDataWithoutInquiries = publicationData.map(
            (publication) => {
              publication.requiresInquiry = false;
              return publication;
            }
          );
          setPublications(publicationDataWithoutInquiries);
        } else {
          const publicationData = [...result.data];
          const publicationDataWithoutInquiries = publicationData.map(
            (publication) => {
              publication.requiresInquiry = false;
              return publication;
            }
          );
          setPublications(publicationDataWithoutInquiries);
        }
        setPaginationData(result.pagination);
        setIsLoadingPublications(false);
      });
  };

  const fetchFeaturedPublications = async () => {
    const response = await API.site_publications
      .find({
        pageNumber: 1,
        searchQuery: null,
        category: null,
        sort: ["publication.popularity_rank:desc"],
        is_featured: true,
        site_id: siteData?.id,
        showBasePrices: siteData?.attributes?.use_base_publication_pricing,
      })
      .then(function (result) {
        setFeaturedPublications([...result.data]);
      })
      .catch((err) => {
        console.log(err);
        return [];
      });
  };

  const handleFilter = ({ name, value }) => {
    pageNumberRef.current = 1;
    let publicationFilters = filters.publicationFilters;
    if (name in publicationFilters) {
      delete publicationFilters[name];
    } else {
      publicationFilters[name] = {
        $eq: value,
      };
    }

    setFilters({
      publicationFilters,
      searchQuery: filters.query,
      category: filters.category,
      sort: filters.sort,
    });
  };

  return (
    <div>
      <CartContext.Provider
        value={{
          list,
          handleAddItem,
          handleRemoveItem,
          canViewPricing,
        }}
      >
        <Navbar name="Press Backend" isManager={true} />

        <UnlockPricingModal
          canViewPricing={canViewPricing}
          open={openAccessPricingModal}
          setOpen={() => setOpenAccessPricingModal(false)}
        />
        <Cart
          open={openCart}
          setOpen={setOpenCart}
          list={list}
          site_id={siteData?.id}
          site_url={
            siteData?.attributes?.customDomain ||
            siteData?.attributes?.subdomain
          }
          isManager={true}
          profile_id={profile?.id}
        />
        <section
          className="flex justify-center relative pt-16 sm:pt-32 "
          id="about"
        >
          <div className="container mx-auto h-full flex-col px-6 max-w-7xl">
            <div className="flex flex-col sm:flex-row justify-between items-start">
              <h1 className="text-left text-5xl">
                Create Order For {`${profile?.name}`}
              </h1>

              {!!session && (
                <a
                  onClick={() => setOpen(!openCart)}
                  className="inline-flex justify-center rounded-full border border-gray-300 shadow-sm px-6 py-4 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500 flex-none gap-2"
                >
                  <ShoppingCartIcon className="w-6 h-6" />
                  <div className="rounded-full bg-gray-600 w-6 h-6 flex items-center justify-center">
                    <p className="text-white">{list.length}</p>
                  </div>
                </a>
              )}
            </div>

            <p className="text-left text-base mt-4">
              Add items to the {"customer's"} cart here. (Please note they must
              have enough credit to cover the order amount)
            </p>

            {featuredPublications?.length > 0 && (
              <div className="flex flex-col mt-8">
                <h2 className="text-left text-2xl">Featured Publications</h2>
                <div className="flex overflow-scroll sm:overflow-visible sm:grid grid-cols-4 gap-4 mt-4">
                  {featuredPublications.map((publication, publicationIndex) => {
                    return (
                      <div
                        key={publicationIndex}
                        onClick={() =>
                          handlePublicationDetailsOpen(publication)
                        }
                        className="bg-white rounded-[32px] px-6 py-4 flex-none max-w-[310px] cursor-pointer hover:text-indigo-500 text-gray-600 hover:border-indigo-300 border border-transparent flex items-center overflow-visible"
                      >
                        <div className="flex flex-col gap-1 items-start justify-center w-full">
                          <img
                            className="h-[32px] flex-none object-contain"
                            src={publication.wordLogo?.attributes?.url}
                          />
                          <div className="flex justify-between w-full">
                            <p className="text-base font-normal">
                              {publication?.name}
                            </p>
                            {canViewPricing && (
                              <p className="text-base font-bold">
                                {publication?.getFormattedPrice()}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </section>
        <section className="flex justify-center relative" id="about">
          <div className="container mx-auto px-6 max-w-7xl">
            <PressList
              publications={publications}
              paginationData={paginationData}
              nextPage={nextPage}
              prevPage={prevPage}
              handleSearch={handleSearch}
              handleCategory={handleCategory}
              canViewPricing={canViewPricing}
              handleSort={handleSort}
              isLoadingPublications={isLoadingPublications}
              handleRequirementsOpen={handlePublicationDetailsOpen}
              handlePublicationInquiryOpen={handlePublicationInquiryOpen}
              categories={
                siteData?.attributes?.site_publication_categories?.data
              }
              handleFilter={handleFilter}
            />
          </div>
        </section>

        {isDetailOpen && (
          <PublicationDetailModal
            setIsOpen={setDetailOpen}
            isOpen={isDetailOpen}
            publication={highlightedPublication}
            canViewPricing={!!session}
            handleAddToCart={() => handleAddItem(highlightedPublication)}
            handlePublicationInquiryOpen={handlePublicationInquiryOpen}
          />
        )}
        {isInquiryOpen && (
          <PublicationInquiryModal
            site_id={siteData?.id}
            publication={highlightedPublication}
            isOpen={isInquiryOpen}
            handleClose={() => {
              setInquiryOpen(false), setHighlightedPublication(null);
            }}
          />
        )}

        {/* <HowItWorks/>
      <FAQs/>
      <Footer/> */}
      </CartContext.Provider>
    </div>
  );
};

export const getServerSideProps = async ({ req, query, resolvedUrl }) => {
  const session = await getSession({ req });
  if (!session) {
    return {
      redirect: {
        permanent: false,
        destination: `/login?return_url=${resolvedUrl}`,
      },
    };
  }

  const profileID = query.id;

  let profile = await API.profiles
    .findOne({ id: profileID, session })
    .then((response) => {
      return new ProfileModel(response.data.data);
    })
    .catch((error) => {
      console.log("error", error);
    });

  let site = await API.sites.get({ subdomain: profile.site.subdomain });
  let publication_categories = await API.publication_categories
    .find()
    .then((result) => {
      return result.data.data;
    });

  return {
    props: {
      profile: JSON.parse(JSON.stringify(profile)),
      site,
      session,
      publication_categories,
    },
  };
};

export default IndexPage;
