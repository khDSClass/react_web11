import axios from "axios";
import { useEffect, useState } from "react";
import { Link, Route, Routes, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import SideMenu from "../../component/SideMenu";
import MemberInfo from "./MemberInfo";
import MemberPw from "./MemberPw";

const MemberMain = (props) => {
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const isLogin = props.isLogin;
  const logout = props.logout;
  const navigate = useNavigate();
  if (!isLogin) {
    Swal.fire("로그인 후 이용 가능합니다.").then(() => {
      navigate("/");
    });
  }
  const [member, setMember] = useState({});
  useEffect(() => {
    axios
      .get(backServer + "/member")
      .then((res) => {
        console.log(res.data);
        setMember(res.data.data);
      })
      .catch((res) => {
        console.log(res);
      });
  }, []);
  const [menus, setMenus] = useState([
    { url: "info", text: "내 정보", active: false },
    { url: "pw", text: "비밀번호 변경", active: false },
    { url: "board", text: "작성 글 보기", active: false },
  ]);
  return (
    <div className="mypage-wrap">
      <div className="mypage-title">
        <span>MYPAGE</span>
        {member && member.memberType === 1 ? (
          <Link to="/admin/main">
            <span className="material-icons admin-icon">manage_accounts</span>
          </Link>
        ) : (
          ""
        )}
      </div>
      <div className="mypage-content">
        <SideMenu menus={menus} setMenus={setMenus} />
        <div className="mypage-current-content">
          <Routes>
            <Route
              path="/info"
              element={<MemberInfo member={member} logout={logout} />}
            />
            <Route path="/pw" element={<MemberPw />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default MemberMain;
