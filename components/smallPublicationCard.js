import CartContext from "@/components/CartContext";
import { useContext } from "react";

export default function SmallPublicationCard({
  publication,
  handlePublicationDetailsOpen,
}) {
  const { canViewPricing } = useContext(CartContext);
  return (
    <div
      onClick={() => handlePublicationDetailsOpen(publication)}
      className="bg-white rounded-[32px] px-6 py-4 flex-none max-w-[310px] cursor-pointer hover:text-indigo-500 text-gray-600 hover:border-indigo-300 border border-transparent flex items-center overflow-visible"
    >
      <div className="flex flex-col gap-1 items-start justify-center w-full">
        <img
          className="h-[32px] flex-none object-contain"
          src={publication.wordLogo?.attributes?.url}
        />
        <div className="flex justify-between w-full">
          <p className="text-base font-normal">{publication?.name}</p>
          {canViewPricing && (
            <p className="text-base font-bold">
              {publication?.getFormattedPrice()}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
