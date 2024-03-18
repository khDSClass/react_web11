import { useEffect, useState } from "react";
import { Button1, Button3, Input } from "../../component/FormFrm";
import axios from "axios";
import Swal from "sweetalert2";

const MemberInfo = (props) => {
  const member = props.member;
  const logout = props.logout;
  const [phone, setPhone] = useState("");
  const backServer = process.env.REACT_APP_BACK_SERVER;
  useEffect(() => {
    setPhone(member.memberPhone);
  }, [member]);
  const updateMemberPhone = () => {
    const m = { memberId: member.memberId, memberPhone: phone };
    axios
      .patch(backServer + "/member/phone", m)
      .then((res) => {
        console.log(res.data);
        if (res.data.message === "success") {
          Swal.fire({
            icon: "success",
            title: "전화번호가 수정되었습니다.",
          });
        } else {
          Swal.fire({
            icon: "info",
            title: "잠시 후 다시 시도해주세요.",
          });
        }
      })
      .catch((res) => {
        console.log(res);
      });
  };
  const deleteMember = () => {
    Swal.fire({
      icon: "warning",
      title: "회원탈퇴",
      text: "회원을 탈퇴하시겠습니까?",
      showCancelButton: true,
      confirmButtonText: "탈퇴하기",
      cancelButtonText: "취소",
    }).then((res) => {
      if (res.isConfirmed) {
        axios
          .delete(backServer + "/member")
          .then((res) => {
            if (res.data.message === "success") {
              Swal.fire("잘가라임마").then(() => {
                logout();
              });
            }
          })
          .catch((res) => {
            console.log(res);
          });
      }
    });
  };
  return (
    <div className="mypage-current-wrap">
      <div className="mypage-current-title">내정보</div>
      <table className="member-info-tbl">
        <tbody>
          <tr>
            <td>회원아이디</td>
            <td>{member.memberId}</td>
          </tr>
          <tr>
            <td>이름</td>
            <td>{member.memberName}</td>
          </tr>
          <tr>
            <td>전화번호</td>
            <td id="member-phone">
              <div>
                <Input
                  data={phone}
                  setData={setPhone}
                  type="text"
                  content="phone"
                />
                <Button3 text="수정하기" clickEvent={updateMemberPhone} />
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <div className="delete-btn-box">
        <Button1 text="회원탈퇴" clickEvent={deleteMember} />
      </div>
    </div>
  );
};

export default MemberInfo;
