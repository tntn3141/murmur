import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const NotFound = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="main p-10 bg-[#EEEEEE] dark:bg-[#2B2D31] text-[#060607] dark:text-[#F2F3F5]">
      <div className="mx-auto mt-[112px] flex flex-col text-center gap-3">
        <p className="wrap">We couldn't find what you were looking for.</p>

        {user && (
          <p>
            <Link to={"/"} className="font-bold hover:underline">
              Return to the home page
            </Link>
          </p>
        )}

        {!user && (
          <p>
            <Link to={"/login"} className="font-bold hover:underline">
              Please log in to use the site
            </Link>
          </p>
        )}
      </div>
    </div>
  );
};

export default NotFound;
