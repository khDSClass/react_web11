import { useState } from "react";
import { Button1, Input } from "../../component/FormFrm";
import axios from "axios";
import Swal from "sweetalert2";

const MemberPw = () => {
  const [isAuth, setIsAuth] = useState(false); //현재비밀번호를 입력해서 인증여부
  const [currPw, setCurrPw] = useState("");
  const [memberPw, setMemberPw] = useState("");
  const [memberPwRe, setMemberPwRe] = useState("");
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const checkPw = () => {
    const member = { memberPw: currPw };
    axios
      .post(backServer + "/member/pw", member)
      .then((res) => {
        if (res.data.message === "valid") {
          setIsAuth(true);
          setCurrPw("");
        } else {
          Swal.fire({
            icon: "question",
            title: "비밀번호를 확인하세요",
          });
        }
      })
      .catch((res) => {
        console.log(res);
      });
  };
  return (
    <div className="mypage-current-wrap">
      <div className="mypage-current-title">비밀번호 수정</div>
      <div className="pw-change-wrap">
        {isAuth ? (
          ""
        ) : (
          <>
            <div className="pw-input-wrap">
              <div>
                <label htmlFor="currPw">현재 비밀번호</label>
                <Input
                  type="password"
                  data={currPw}
                  setData={setCurrPw}
                  content="currPw"
                />
                <Button1 text="입력" clickEvent={checkPw} />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MemberPw;
