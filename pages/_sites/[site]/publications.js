import { getSession, useSession, signIn, signOut } from "next-auth/react";
import React, { useState, useRef, useEffect, useContext } from "react";
import Cart from "@/components/cart";
import PressList from "@/components/publications/pressList";
import API from "@/lib/api";
import { ShoppingCartIcon } from "@heroicons/react/outline";
import PublicationDetailModal from "@/components/publications/publication-detail-modal";
import PublicationDetailsModal from "@/components/publications/publicationDetailsModal";
import SiteWrapper from "@/components/siteWrapper";
import Tooltip from "@/components/tooltip";
import PublicationInquiryModal from "@/components/publications/publicationInquiryModal";
import * as klaviyo from "@/lib/tracking/klaviyo";
import { useRouter } from "next/router";
import HowItWorks from "@/components/howItWorks";
import FAQs from "@/components/faqs";
import PublicationModel from "@/lib/models/publication-model";
import CartContext from "@/components/CartContext";
import SmallPublicationCard from "@/components/smallPublicationCard";

const IndexPage = ({ siteData }) => {
  const [openCart, setOpenCart] = useState(false);

  const [publications, setPublications] = useState([]);
  const [featuredPublications, setFeaturedPublications] = useState([]);

  const [paginationData, setPaginationData] = useState();

  const pageNumberRef = useRef(1);
  const [isDetailOpen, setDetailOpen] = useState(false);
  const [isAddToCartModalOpen, setAddToCartModalOpen] = useState(false);
  const [highlightedPublication, setHighlightedPublication] = useState(null);
  const [isInquiryOpen, setInquiryOpen] = useState(false);
  const router = useRouter();
  const [filters, setFilters] = useState({
    publicationFilters: {},
    searchQuery: null,
    category: null,
    sort: ["publication.popularity_rank:desc"],
  });
  const [isLoadingPublications, setIsLoadingPublications] = useState(false);
  const { data: session } = useSession();
  const filtersRef = useRef();
  // const listLengthRef = useRef();

  // useEffect(() => {
  //   if (list.length > 0) {
  //     let obj = JSON.stringify(list);
  //     window.localStorage.setItem("list", obj);
  //     window.dispatchEvent(new Event("storage"));
  //   } else {
  //     checkLocalStorage();
  //   }
  // }, [list]);

  // const checkLocalStorage = () => {
  //   if (localStorage.getItem("list")) {
  //     let items = JSON.parse(localStorage.getItem("list") + "");
  //     items.forEach((element, idx, array) => {
  //       let sitePublication = new PublicationModel(element);
  //       const returnedTarget = Object.assign(sitePublication, element);
  //       items[idx] = returnedTarget;
  //       if (idx === items.length - 1) {
  //         updateList((list) => [...items]);
  //       }
  //     });
  //   }
  // };

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

  // useEffect(() => {
  //   if (list.length > 0) {
  //     if (siteData?.attributes?.klaviyo_public_key && session?.profile?.email) {
  //       if (list.length > listLengthRef.current) {
  //         klaviyo.trackAddToCart({
  //           itemName: list[list.length - 1].name,
  //           itemPrice: list[list.length - 1].price,
  //           itemQuantity: 1,
  //           items: list,
  //           email: session?.profile?.email,
  //         });
  //       }
  //     }
  //   }
  //   listLengthRef.current = list.length;
  // }, [list, session]);

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
          setPublications([...publications, ...result.data]);
        } else {
          setPublications([...result.data]);
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
    <SiteWrapper siteData={siteData}>
      <section className="flex justify-center relative pt-16" id="about">
        <div className="container mx-auto h-full flex-col px-6 max-w-7xl">
          <div className="flex flex-col sm:flex-row justify-between items-start">
            <h1 className="text-left text-5xl">Our Publications</h1>
            {/* {!!session && (
              <a
                onClick={() => setOpenCart(!openCart)}
                className="inline-flex justify-center rounded-full border border-gray-300 shadow-sm px-6 py-4 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500 flex-none gap-2"
              >
                <ShoppingCartIcon className="w-6 h-6" />
                <div className="rounded-full bg-gray-600 w-6 h-6 flex items-center justify-center">
                  <p className="text-white">{list.length}</p>
                </div>
              </a>
            )} */}
          </div>
          {/* 
          <p className="text-left text-base mt-4">
            Best price promised. We’re so confident in our pricing, if you find
            something better we’ll beat it.
          </p> */}

          {featuredPublications?.length > 0 && (
            <div className="flex flex-col mt-8">
              <h2 className="text-left text-2xl">Featured</h2>
              <div className="flex overflow-scroll sm:overflow-visible sm:grid grid-cols-4 gap-4 mt-4">
                {featuredPublications.map((publication, publicationIndex) => {
                  return (
                    <SmallPublicationCard
                      handlePublicationDetailsOpen={
                        handlePublicationDetailsOpen
                      }
                      publication={publication}
                      key={publicationIndex}
                    />
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
            handleSort={handleSort}
            isLoadingPublications={isLoadingPublications}
            handleRequirementsOpen={handlePublicationDetailsOpen}
            handlePublicationInquiryOpen={handlePublicationInquiryOpen}
            categories={siteData?.attributes?.site_publication_categories?.data}
            handleFilter={handleFilter}
            canViewDoFollowAndSponsored={
              siteData?.attributes?.show_secret_data ||
              session?.profile?.can_view_secret_data
            }
          />
        </div>
      </section>

      {/* <HowItWorks name={siteData?.attributes.name} />
      <FAQs
        email={siteData?.attributes.email}
        siteName={siteData?.attributes?.name}
      /> */}

      {isDetailOpen && (
        <PublicationDetailsModal
          setIsOpen={setDetailOpen}
          isOpen={isDetailOpen}
          publication={highlightedPublication}
          canViewDoFollowAndSponsored={session?.profile?.can_view_secret_data}
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
    </SiteWrapper>
  );
};

export async function getStaticPaths() {
  const siteData = await API.sites.find({});
  const sites = siteData?.data?.data;

  const allPaths = sites.reduce(function (result, site) {
    const subdomain = site.attributes.subdomain;
    const customDomain = site.attributes.customDomain;
    if (subdomain) {
      result.push({
        params: { site: subdomain },
      });
    }
    if (customDomain) {
      result.push({
        params: { site: customDomain },
      });
    }
    return result;
  }, []);

  return {
    paths: allPaths,
    fallback: true,
  };
}

export async function getStaticProps(context) {
  const { params } = context;
  const { site } = params;

  let siteData;
  if (site.includes(".")) {
    siteData = await API.sites.get({ customDomain: site });
  } else {
    siteData = await API.sites.get({ subdomain: site });
  }

  //   console.log("siteData", siteData);

  return {
    props: {
      siteData,
    }, // will be passed to the page component as props
  };
}

export default IndexPage;
