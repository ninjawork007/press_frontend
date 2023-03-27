import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import ProfileModel from "@/lib/models/profile-model";
import API from "@/lib/api";

function ProfileDropdown({ onProfileSelected }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [profiles, setProfiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchProfiles = async () => {
      setIsLoading(true);

      let findPromise;

      findPromise = API.profiles.findAllProfiles({
        searchQuery: searchTerm,
      });

      const response = await findPromise.then(function (result) {
        let profileModels = result.data.data.map((profileModel) => {
          return new ProfileModel(profileModel);
        });

        setProfiles(profileModels);
        setIsLoading(false);
      });
      setIsLoading(false);
    };

    if (searchTerm) {
      fetchProfiles();
    }
  }, [searchTerm]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleProfileSelected = (event) => {
    setSearchTerm(event.target.innerText);
    onProfileSelected(event.target.value);
  };

  useEffect(() => {
    const handleDocumentClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfiles([]);
      }
    };

    document.addEventListener("mousedown", handleDocumentClick);
    return () => {
      document.removeEventListener("mousedown", handleDocumentClick);
    };
  }, []);

  return (
    <div className="relative rounded-md shadow-sm" ref={dropdownRef}>
      <input
        type="search"
        className="form-input py-2 pl-10 pr-4 block w-full leading-5 rounded-md transition duration-150 ease-in-out sm:text-sm sm:leading-5"
        placeholder="Search for a profile"
        value={searchTerm}
        onChange={handleSearchChange}
      />
      {isLoading && (
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <svg
            className="h-5 w-5 text-gray-400"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
          </svg>
        </div>
      )}
      {error && (
        <div className="text-red-500 mt-2">
          An error occurred while fetching the profiles: {error.message}
        </div>
      )}
      {!isLoading && !error && profiles.length > 0 && (
        <div className="absolute z-50 w-full rounded-md shadow-lg py-1 bg-white">
          <ul className="max-h-60 overflow-auto text-base leading-6 rounded-md shadow-xs">
            {profiles.map((profile) => (
              <li key={profile.id}>
                <button
                  type="button"
                  className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
                  onClick={handleProfileSelected}
                  value={profile.id}
                >
                  {profile.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default ProfileDropdown;
