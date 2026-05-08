import Loading from "@/components/Loading";

const PageLoadingShell = () => {
  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden">
      <div className="w-full h-20 min-h-[80px] flex flex-row items-center justify-between px-8 bg-[#1a1a1a] border-b border-gray-800">
        <div className="flex items-center">
          <div className="flex items-center justify-center w-10 h-10 bg-gray-800 rounded-lg animate-pulse">
            <div className="w-6 h-6 bg-gray-600 rounded"></div>
          </div>
        </div>
        <div className="flex justify-center flex-grow">
          <div className="w-[348px] h-12 bg-gray-800 rounded-lg animate-pulse"></div>
        </div>
        <div className="flex items-center">
          <div className="flex items-center justify-center w-10 h-10 bg-gray-800 rounded-lg animate-pulse">
            <div className="w-6 h-6 bg-gray-600 rounded"></div>
          </div>
        </div>
      </div>
      <div className="flex-1 pt-8 px-8 pb-4">
        <Loading />
      </div>
    </div>
  );
};

export default PageLoadingShell;
