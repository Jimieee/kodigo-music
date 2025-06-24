import { FaApple } from "react-icons/fa";

const Loading = () => {
  return (
    <div className="relative flex h-[80vh] items-center justify-center">
      <FaApple className="relative z-10 text-6xl text-main" />

      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-primary animate-ping"></div>
      </div>
    </div>
  );
};

export default Loading;