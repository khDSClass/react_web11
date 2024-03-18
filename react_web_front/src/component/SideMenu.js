import { Link } from "react-router-dom";
import "./sidemenu.css";
const SideMenu = (props) => {
  const menus = props.menus;
  const setMenus = props.setMenus;
  const changeMenu = (index) => {
    const copyMenus = [...menus];
    copyMenus.forEach((item) => {
      item.active = false;
    });
    copyMenus[index].active = true;
    setMenus(copyMenus);
  };
  return (
    <div className="side-menu">
      <ul>
        {menus.map((menu, index) => {
          return (
            <li key={"menu" + index}>
              <Link
                to={menu.url}
                className={menu.active ? "active-side" : ""}
                onClick={() => {
                  changeMenu(index);
                }}
              >
                {menu.text}
                <span className="material-icons">chevron_right</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default SideMenu;
