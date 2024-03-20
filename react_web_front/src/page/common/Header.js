import "./default.css";
import { Link } from "react-router-dom";

const Header = (props) => {
  const isLogin = props.isLogin;
  const logout = props.logout;
  return (
    <header>
      <div className="header">
        <div className="main-logo">
          <Link to="/">LEE`S WORLD</Link>
        </div>
        <Navi />
        <HeaderLink isLogin={isLogin} logout={logout} />
      </div>
    </header>
  );
};

const Navi = () => {
  return (
    <nav className="nav">
      <ul>
        <li>
          <Link to="/board/list">게시판</Link>
        </li>
        <li>
          <Link to="#">메뉴-2</Link>
        </li>
        <li>
          <Link to="#">메뉴-3</Link>
        </li>
        <li>
          <Link to="#">메뉴-4</Link>
        </li>
      </ul>
    </nav>
  );
};

const HeaderLink = (props) => {
  const isLogin = props.isLogin;
  const logout = props.logout;
  return (
    <div className="header-link">
      {isLogin ? (
        <>
          <Link to="/member" title="마이페이지">
            <span className="material-icons">face</span>
          </Link>
          <Link to="#" title="로그아웃">
            <span className="material-icons" onClick={logout}>
              logout
            </span>
          </Link>
        </>
      ) : (
        <>
          <Link to="/login" title="로그인">
            <span className="material-icons">login</span>
          </Link>
          <Link to="/join" title="회원가입">
            <span className="material-icons">assignment_ind</span>
          </Link>
        </>
      )}
    </div>
  );
};

export default Header;
