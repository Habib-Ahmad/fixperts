const Loader = ({ size = 48 }: { size?: number }) => {
  return (
    <div className="h-screen w-screen fixed top-0 left-0 flex items-center justify-center bg-[#ffffff66] z-50">
      <div
        className={`inline-block animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] text-primary motion-reduce:animate-[spin_1.5s_linear_infinite]`}
        style={{ width: `${size}px`, height: `${size}px` }}
        role="status"
      >
        <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
          Loading...
        </span>
      </div>
    </div>
  );
};

export default Loader;
