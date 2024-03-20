import axios from "axios";
import { useEffect, useState } from "react";
import Pagination from "../../component/Pagination";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

const AdminMember = () => {
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const [memberList, setMemberList] = useState([]);
  const [pageInfo, setPageInfo] = useState({});
  const [reqPage, setReqPage] = useState(1);

  useEffect(() => {
    axios
      .get(backServer + "/admin/member/" + reqPage)
      .then((res) => {
        setMemberList(res.data.data.memberList);
        setPageInfo(res.data.data.pi);
      })
      .catch((res) => {
        console.log(res);
      });
  }, [reqPage]);
  return (
    <div className="mypage-current-wrap">
      <div className="mypage-current-title">회원관리</div>
      <div className="admin-member-tbl-box">
        <table>
          <thead>
            <tr>
              <td width={"20%"}>아이디</td>
              <td width={"20%"}>이름</td>
              <td width={"30%"}>전화번호</td>
              <td width={"30%"}>회원등급</td>
            </tr>
          </thead>
          <tbody>
            {memberList.map((member, index) => {
              return <MemberItem key={"member" + index} member={member} />;
            })}
          </tbody>
        </table>
      </div>
      <div className="admin-paging-wrap">
        <Pagination
          reqPage={reqPage}
          setReqPage={setReqPage}
          pageInfo={pageInfo}
        />
      </div>
    </div>
  );
};
const MemberItem = (props) => {
  const member = props.member;

  const [memberType, setMemberType] = useState(member.memberType);
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const changeType = (e) => {
    const m = { memberId: member.memberId, memberType: e.target.value };
    axios
      .patch(backServer + "/admin/memberType", m)
      .then((res) => {
        if (res.data.message === "success") {
          setMemberType(e.target.value);
        }
      })
      .catch((res) => {
        console.log(res);
      });
  };
  useEffect(() => {
    setMemberType(member.memberType);
  }, [member]);
  return (
    <tr>
      <td>{member.memberId}</td>
      <td>{member.memberName}</td>
      <td>{member.memberPhone}</td>
      <td>
        <FormControl sx={{ m: 1, width: 150 }}>
          <Select value={memberType} onChange={changeType}>
            <MenuItem value={1}>관리자</MenuItem>
            <MenuItem value={2}>일반회원</MenuItem>
          </Select>
        </FormControl>
      </td>
    </tr>
  );
};
export default AdminMember;
