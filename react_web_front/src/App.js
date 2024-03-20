import { Route, Routes } from "react-router-dom";
import Footer from "./page/common/Footer";
import Header from "./page/common/Header";
import Main from "./page/common/Main";
import Join from "./page/member/Join";
import Login from "./page/member/Login";
import { useEffect, useState } from "react";
import MemberInfo from "./page/member/MemberInfo";
import axios from "axios";
import MemberMain from "./page/member/MemberMain";
import BoardMain from "./page/board/BoardMain";

function App() {
  //스토리지에 저장된 데이터를 꺼내서 객체형식으로 변환
  const obj = JSON.parse(window.localStorage.getItem("member"));
  const [isLogin, setIsLogin] = useState(obj ? true : false); //로그인상태를 체크하는 state
  const [token, setToken] = useState(obj ? obj.accessToken : ""); //토큰값
  const [expiredTime, setExpiredTime] = useState(
    obj ? new Date(obj.tokenExpired) : ""
  ); //만료시간
  if (obj) {
    axios.defaults.headers.common["Authorization"] = "Bearer " + token;
  }
  const login = (accessToken) => {
    //로그인 성공 시 받은 accessToken을 token state에 저장
    setToken(accessToken);
    //로그인 성공한 순간을 기준으로 1시간 뒤에 만료시간임 -> 그데이터를 저장
    const tokenExpired = new Date(new Date().getTime() + 60 * 60 * 1000);
    setExpiredTime(tokenExpired);
    //토큰이랑, 만료시간을 객체로 묶은 후 문자열로 변환해서 localStorage에 저장
    const obj = { accessToken, tokenExpired: tokenExpired.toISOString() };
    //localStorage에는 문자열만 저장이 가능하므로 묶은 객체도 문자열로 변환
    const member = JSON.stringify(obj);
    //로컬스토리지에 데이터 저장
    window.localStorage.setItem("member", member);
    //axios헤더에 토큰값 자동설정
    axios.defaults.headers.common["Authorization"] = "Bearer " + accessToken;
    setIsLogin(true);

    const remainingTime = tokenExpired.getTime() - new Date().getTime();
    console.log(remainingTime);
    setTimeout(logout, remainingTime);
  };
  const logout = () => {
    //로그인할때 변경한 사항을 모두 원래대로 복원
    setToken("");
    setExpiredTime("");
    window.localStorage.removeItem("member");
    axios.defaults.headers.common["Authorization"] = null;
    setIsLogin(false);
  };
  //페이지가 로드되면,새로고침되면
  useEffect(() => {
    if (isLogin) {
      //로그인이 되어있으면
      //저장해 둔 만료시간을 꺼내서 현재시간과 비교한 후 종료함수 설정
      const remainingTime = expiredTime.getTime() - new Date().getTime();
      setTimeout(logout, remainingTime);
    }
  }, []);
  return (
    <div className="wrap">
      <Header isLogin={isLogin} logout={logout} />
      <div className="content">
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/join" element={<Join />} />
          <Route path="/login" element={<Login login={login} />} />
          <Route
            path="/member/*"
            element={<MemberMain isLogin={isLogin} logout={logout} />}
          />
          <Route path="/board/*" element={<BoardMain isLogin={isLogin} />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;
