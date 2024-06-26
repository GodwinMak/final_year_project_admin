import React, { useContext, useState, useEffect } from "react";
import { Context } from "../../context";
import { Link } from "react-router-dom";
import { Data } from "../../data/jummy";
import { useNavigate, useParams } from "react-router-dom";
import RealTimeSidebar from "./RealTimeSidebar";
import { useAuthContext } from "../../hooks/useAuthContext";
import HistorySidebar from "./HistorySidebar";

const Sidebar = () => {

  const user = useAuthContext()
  const page = useParams()


  const filteredData = Data.filter(icon => {
    if (user.user.user.user.role === 'admin' && (icon.previllage === 'admin' || icon.previllage === 'all')) {
      return true;
    } else if (user.user.user.user.role === 'user' && (icon.previllage === 'user' || icon.previllage === 'all')) {
      return true;
    } else {
      return false;
    }
  });



  const navigate = useNavigate();
  const { state, dispatch } = useContext(Context);
  const [activeIcon, setActiveIcon] = useState(localStorage.getItem("activeIcon") || filteredData[0].icon);
  const [activeCat, setActiveCat] = useState(localStorage.getItem("activeCat") || filteredData[0].inside[0].text);
  const [category, setCategory] = useState(Data[0].inside);
  const [specialInsideSidebar, setSpecialInsideSidebar] = useState(localStorage.getItem("specialInsideSidebar") === "true")
  const [insideSidebar, setInsideSidebar] = useState(localStorage.getItem("insideSidebar") === "true")


  let ClickedIcon = (iconName) => {
    if (iconName.insideSidebar) {   
      setInsideSidebar(true)
      localStorage.setItem("insideSidebar", true)
      if (!iconName.specialInsideSidebar) {
        setSpecialInsideSidebar(false)
        localStorage.setItem("specialInsideSidebar", false)
        if (iconName.icon === activeIcon) {
          dispatch({ type: "SET_TOGGLE", payload: !state.toggle });

        } else {
          dispatch({ type: "SET_TOGGLE", payload: true });
          navigate(`/admin-dashboard/${iconName.inside[0].url}`)
          setActiveIcon(iconName.icon);
          setActiveCat(iconName.inside[0].text); // Assuming first item is default active
          setCategory(iconName.inside);
          // Update localStorage
          localStorage.setItem("activeIcon", iconName.icon);
          localStorage.setItem("activeCat", iconName.inside[0].text);
        }
      } else {
        setSpecialInsideSidebar(true);
        localStorage.setItem("specialInsideSidebar", true)
        if (iconName.icon === activeIcon) {
          dispatch({ type: "SET_TOGGLE", payload: !state.toggle });
        } else {
          dispatch({ type: "SET_TOGGLE", payload: true });
          navigate(`/admin-dashboard/${iconName.inside[0].url}`)
          setActiveIcon(iconName.icon);
          setActiveCat(iconName.inside[0].text); // Assuming first item is default active
          localStorage.setItem("activeIcon", iconName.icon);
          localStorage.setItem("activeCat", iconName.inside[0].text);

        }
      }
    } else {
      setInsideSidebar(false);
      localStorage.setItem("insideSidebar", false);
      dispatch({ type: "SET_TOGGLE", payload: false });
      if (iconName.icon === activeIcon){
        return
      }else{
        navigate(`/admin-dashboard/${iconName.inside[0].url}`)
        setActiveIcon(iconName.icon);
        localStorage.setItem("activeIcon", iconName.icon);
      }
    }


  };
  useEffect(() => {
    // Ensure that the category is updated on page load if localStorage has values
    const storedIcon = localStorage.getItem("activeIcon");
    if (storedIcon) {
      const foundIcon = Data.find(icon => icon.icon === storedIcon);
      if (foundIcon) {
        setCategory(foundIcon.inside);
      }
    }
  }, []);
  return (
    <div className={`${state.toggleNavbar ? "block" : "hidden"} relative top-[76px]`}>
      <div
        onClick={() => {
          dispatch({ type: "SET_TOOGLE_NAVBAR", payload: false });
        }}
        className="fixed md:hidden z-40 left-0 top-0 right-0 bottom-0 bg-slate-700 backdrop-blur-3xl opacity-60"
      ></div>
      <div className="h-full z-50 fixed drop-shadow-2xl md:drop-shadow flex">
        <div className="flex-col overflow-hidden md:overflow-auto justify-start items-start gap-4 flex bg-zinc-900 px-4 py-6 min-h-full">
          {filteredData.map((icon, index) => {
            return (
              <div
                key={index}
                onClick={() => {
                  ClickedIcon(icon);
                }}
                className={`p-3.5 cursor-pointer ${activeIcon === icon.icon
                  ? " text-white bg-gradient-to-bl from-amber-500 to-pink-500"
                  : "text-neutral-400"
                  }  rounded-lg flex-col hover:text-white duration-300 justify-start items-center gap-2 flex`}
              >
                <i className={`${icon.icon} text-xl w-6 h-6 text-center `}></i>
              </div>
            );
          })}

        </div>
        {insideSidebar && ( !specialInsideSidebar ? (
          <div
            className={`w-56 ${state.toggle ? "block" : "hidden"
              } h-full overflow-hidden md:overflow-auto py-6 bg-white border-r border-neutral-200 flex-col justify-start items-start gap-4 inline-flex`}
          >
            {category && category.map(({ text, icon, url }, index) => {
              return (
                <Link
                  to={`/admin-dashboard/${url}`}
                  onClick={() => {
                    setActiveCat(text);
                    localStorage.setItem("activeCat", text);
                  }}
                  key={index}
                  className={`self-stretch duration-300 cursor-pointer px-[18px] ${activeCat === text
                    ? " bg-orange-50 bg-opacity-80 border-r-2 border-orange-600 "
                    : "text-zinc-500 hover:bg-neutral-200"
                    } py-3.5 justify-start items-center gap-3 inline-flex`}
                >
                  <div
                    className={`w-6 relative ${activeCat === text ? "text-orange-600" : "text-zinc-500"
                      } text-xl`}
                  >
                    <i className={`${icon}`}></i>
                  </div>
                  <div
                    className={`grow shrink basis-0 ${activeCat === text
                      ? "text-orange-600 font-semibold"
                      : "text-zinc-500  font-normal"
                      } text-sm leading-tight`}
                  >
                    {text}
                  </div>
                </Link>
              );
            })}
          </div>) : ((page.category === "real_time" && <RealTimeSidebar /> )|| (page.category === "history" && <HistorySidebar/>)))}
      </div>
    </div>
  );
};

export default Sidebar;
