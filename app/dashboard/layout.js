const layout = ({ children }) => {
  return (
    <div className="flex ">
      {/* navbar */}
      <div className="w-[25%] bg-gray-300 text-black">
        <h1>Navbar</h1>
      </div>
      {/* pages */}
      <div className="w-[75%]">{children}</div>
    </div>
  );
};

export default layout;
