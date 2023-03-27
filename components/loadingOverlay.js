import { MoonLoader } from "react-spinners";

export default function LoadingOverlay({ title }) {
  return (
    <div className="absolute inset-0 w-full h-full bg-indigo-50/90 z-10">
      <div className="flex flex-col items-center justify-center space-y-4 h-full w-full">
        <MoonLoader size={160} color={"#7B86FE"} loading={true} />
        <h1 className="text-6xl text-indigo-900 text-center pt-10">{title}</h1>
        <p className="text-gray-700 text-center max-w-sm">
          Please wait and keep your browser window open. This should only take a
          few moments.
        </p>
      </div>
    </div>
  );
}
