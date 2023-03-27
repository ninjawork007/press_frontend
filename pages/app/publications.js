import { getSession, useSession, signIn, signOut } from "next-auth/react";
import React, { useState, useRef, useEffect } from "react";
import Cart from "@/components/cart";
import PressList from "@/components/publications/pressList";
import API from "@/lib/api";
import UnlockPricingModal from "@/components/publications/unlockPricingModal";
import { ShoppingCartIcon } from "@heroicons/react/outline";
import PublicationDetailModal from "@/components/publications/publication-detail-modal";
import Navbar from "@/components/navbar";
import Tooltip from "@/components/tooltip";
import MoonLoader from "react-spinners/MoonLoader";
import Modal from "@/components/modal";
import { CSVLink } from "react-csv";
const IndexPage = ({ site, publication_categories }) => {
  const [siteData, setSiteData] = useState(site);

  const [open, setOpen] = useState(false);

  const [publications, setPublications] = useState([]);

  const [paginationData, setPaginationData] = useState();

  const pageNumberRef = useRef(1);
  const [isDetailOpen, setDetailOpen] = useState(false);
  const [highlightedPublication, setHighlightedPublication] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditingPrice, setIsEditingPrice] = useState(false);
  const [selectedPublication, setSelectedPublication] = useState(null);
  const [csvData, setCsvData] = useState({ data: [], headers: [] });

  const priceInputRef = useRef(null);

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

  const handlePriceEdit = (item) => {
    setSelectedPublication(item);
    setIsEditingPrice(true);
  };

  const handlePriceSubmit = (e) => {
    e.preventDefault();
    if (priceInputRef.current.value < selectedPublication?.resellerPrice) {
      alert("Price cannot be less than your reseller price");
      return;
    }
    setIsSaving(true);
    const price = priceInputRef.current.value;
    const updatePublicationsWithItem = publications.map((publication) => {
      if (publication.id === selectedPublication.id) {
        publication.price = price;
      }
      return publication;
    });

    setPublications(updatePublicationsWithItem);
    setIsEditingPrice(false);
    setSelectedPublication(null);

    API.site_publications
      .update({
        session,
        data: {
          price: price,
        },
        id: selectedPublication.id,
      })
      .then((res) => {
        setIsSaving(false);
        console.log(res);
      })
      .catch((err) => {
        setIsSaving(false);
        console.log(err);
      });
  };

  const handleToggleCategory = ({ is_removing = true, category_id }) => {
    let site_publication_categories =
      siteData.site_publication_categories?.data;

    let site_categories_updates = site_publication_categories.map(
      (site_publication_category) => {
        return site_publication_category.id;
      }
    );

    if (is_removing) {
      site_categories_updates = site_categories_updates.filter(
        (site_category) => {
          site_category !== category_id;
        }
      );
    } else {
      site_categories_updates = [...site_categories_updates, category_id];
    }

    API.sites
      .update({
        session,
        data: {
          site_publication_categories: site_categories_updates,
        },
        id: siteData.id,
      })
      .then((res) => {
        API.sites
          .get({ session, profile_id: session.profile.id })
          .then((res) => {
            setSiteData(res);
          });
      });
  };

  const handleItem = (selectedItem, field) => {
    let databaseFieldToUpdate = null;
    if (field === "isFeatured") {
      databaseFieldToUpdate = "is_featured";
    } else if (field === "isHidden") {
      databaseFieldToUpdate = "is_hidden";
    } else {
      return;
    }
    setIsSaving(true);

    const updatePublicationsWithItem = publications.map((publication) => {
      if (publication.id === selectedItem.id) {
        const updatedPublication = publication;
        updatedPublication[field] = !publication[field];

        return updatedPublication;
      }
      return publication;
    });

    setPublications(updatePublicationsWithItem);

    API.site_publications
      .update({
        session,
        data: {
          [databaseFieldToUpdate]: selectedItem[field],
        },
        id: selectedItem.id,
      })
      .then((res) => {
        setIsSaving(false);
        console.log(res);
      })
      .catch((err) => {
        setIsSaving(false);
        console.log(err);
      });
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
    setDetailOpen(true);
    setHighlightedPublication(publication);
  };

  const handleCSVExport = () => {
    // const csvRows = publications.reduce((result, publication) => {
    //   let row = publication.getCSVData();
    //   if (row) {
    //     return result.push(row);
    //   }
    //   return result;
    // }, []);
    const filterHiddenPublications = publications.filter((publication) => {
      return !publication.isHidden;
    });

    const csvRows = filterHiddenPublications.map((publication) => {
      return publication.getCSVData();
    });
    const headers = csvRows[0]
      ? Object.keys(csvRows[0]).map((key) => {
          return { label: key, key: key };
        })
      : [];
    const csvData = {
      data: csvRows,
      headers: headers,
    };
    setCsvData(csvData);
  };

  useEffect(() => {
    if (filtersRef.current == filters) {
      return;
    }
    if (!siteData) return;
    setPublications([]);
    fetchPublications();
    filtersRef.current = filters;
  }, [filters]);

  const fetchPublications = async () => {
    console.log("fetching publications");

    let { searchQuery, category, sort, publicationFilters } = filters;
    setIsLoadingPublications(true);

    const response = await API.site_publications
      .find({
        pageNumber: pageNumberRef.current,
        searchQuery,
        publicationFilters,
        category,
        sort,
        site_id: siteData.id,
        pageSize: 100,
        session,
        is_whitelabel_owner: true,
        showHidden: true,
      })
      .then(function (result) {
        const pagination = result.pagination;
        // if (pagination.page !== pagination.pageCount) {
        //   API.publications.find({
        //     pageNumber: pageNumberRef.current,
        //     searchQuery,
        //     category,
        //     sort,
        //     pageSize: 100,
        //   });
        // } else {
        // }
        if (pageNumberRef.current > 1) {
          setPublications([...publications, ...result.data]);
        } else {
          setPublications([...result.data]);
        }
        setPaginationData(pagination);
        setIsLoadingPublications(false);
      });
  };

  const canViewPricing = !!session;

  return (
    <>
      <UnlockPricingModal
        open={openAccessPricingModal}
        setOpen={() => setOpenAccessPricingModal(false)}
      />
      <Navbar name="Press Backend" isManager={true} />
      <section
        className="flex justify-center relative pt-16 sm:pt-32 "
        id="about"
      >
        <div className="container mx-auto h-full flex-col px-6 max-w-7xl">
          <div className="flex flex-col sm:flex-row justify-between items-start">
            <h1 className="text-left text-5xl">Manage Publications</h1>
          </div>

          <p className="text-left text-base mt-4">
            Add or remove publications on your site
          </p>
        </div>
      </section>
      {isSaving && (
        <div className="fixed bottom-0 p-4 r-0">
          <span className="flex items-center float-right shadow-xl font-bold  justify-center gap-1 text-green-500 bg-white rounded-full w-[100px]">
            Saving <MoonLoader size={16} loading={isSaving} color={"green"} />{" "}
          </span>
        </div>
      )}
      <section className="flex justify-center relative" id="about">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="mt-2">
            {csvData.data.length > 0 ? (
              <CSVLink
                data={csvData.data}
                headers={csvData.headers}
                className="button"
              >
                Download CSV
              </CSVLink>
            ) : (
              <button
                className="items-center flex gap-2 text-lg text-indigo-500"
                onClick={() => handleCSVExport()}
              >
                Export{" "}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                  />
                </svg>
              </button>
            )}
          </div>

          <PressList
            publications={publications}
            paginationData={paginationData}
            handleAddItem={handleItem}
            handleRemoveItem={handleItem}
            nextPage={nextPage}
            prevPage={prevPage}
            handleSearch={handleSearch}
            handleCategory={handleCategory}
            canViewPricing={canViewPricing}
            handleSort={handleSort}
            isLoadingPublications={isLoadingPublications}
            handleRequirementsOpen={handlePublicationDetailsOpen}
            isWhitelabelOwner={true}
            handlePriceEdit={handlePriceEdit}
            handleFeaturedUpdate={handleItem}
            categories={publication_categories}
            handleFilter={handleFilter}
            site_categories={
              siteData?.attributes?.site_publication_categories?.data
            }
            handleToggleCategory={handleToggleCategory}
          />
        </div>
      </section>

      <Modal isOpen={isEditingPrice} onClose={setIsEditingPrice}>
        <div className="flex flex-col items-center justify-center p-5 w-96">
          <h1 className="text-2xl font-bold">{selectedPublication?.name}</h1>
          <form>
            <div className="flex flex-col gap-2 my-4">
              <label htmlFor="name">Publication Price</label>
              <input
                type="number"
                defaultValue={selectedPublication?.price || 0}
                ref={priceInputRef}
              />
              <p>
                Your cost is $
                <span className="font-bold">
                  {selectedPublication?.resellerPrice}
                </span>
              </p>
              <button
                className="button"
                disabled={isSaving}
                onClick={handlePriceSubmit}
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </Modal>

      {/* <HowItWorks/>
      <FAQs/>
      <Footer/> */}
    </>
  );
};

export const getServerSideProps = async ({ req }) => {
  const session = await getSession({ req });
  if (!session) {
    return {
      redirect: {
        permanent: false,
        destination: "/login",
      },
    };
  }

  let site = await API.sites.get({ profile_id: session.profile.id });
  let publication_categories = await API.publication_categories
    .find()
    .then((result) => {
      return result.data.data;
    });

  return {
    props: {
      site,
      session,
      publication_categories,
    },
  };
};

export default IndexPage;
