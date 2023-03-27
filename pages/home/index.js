import React, { useEffect, useState } from "react";

const IndexPage = ({ yotpoReviews, averageRating }) => {
  return (
    <div className="bg-[#F8F7FC] h-full">
      <section className="bg-[#F8F7FC]">
        <div className="min-h-full py-12 px-4 sm:px-6 lg:px-8 h-full max-w-7xl mx-auto">
          <div className="flex flex-col items-center justify-center">
            <div className="w-full">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800">
                Welcome
              </h1>
              <p className="text-lg text-gray-600 mt-4">
                You have reached our backend!
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default IndexPage;
