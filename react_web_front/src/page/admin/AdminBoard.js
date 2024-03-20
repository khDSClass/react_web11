import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Pagination from "../../component/Pagination";
import Switch from "@mui/material/Switch";

const AdminBoard = () => {
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const [boardList, setBoardList] = useState([]);
  const [pageInfo, setPageInfo] = useState({});
  const [reqPage, setReqPage] = useState(1);
  useEffect(() => {
    axios
      .get(backServer + "/admin/board/" + reqPage)
      .then((res) => {
        console.log(res.data);
        setBoardList(res.data.data.boardList);
        setPageInfo(res.data.data.pi);
      })
      .catch((res) => {
        console.log(res);
      });
  }, [reqPage]);
  return (
    <div className="mypage-current-wrap">
      <div className="mypage-current-title">게시글 관리</div>
      <div className="admin-board-tbl">
        <table>
          <thead>
            <tr>
              <td width={"10%"}>글번호</td>
              <td width={"45%"} className="title-td">
                제목
              </td>
              <td width={"15%"}>작성자</td>
              <td width={"15%"}>작성일</td>
              <td width={"15%"}>공개여부</td>
            </tr>
          </thead>
          <tbody>
            {boardList.map((board, index) => {
              return <BoardItem key={"board" + index} board={board} />;
            })}
          </tbody>
        </table>
        <div className="admin-paging-wrap">
          <Pagination
            reqPage={reqPage}
            setReqPage={setReqPage}
            pageInfo={pageInfo}
          />
        </div>
      </div>
    </div>
  );
};
const BoardItem = (props) => {
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const board = props.board;
  const [boardStatus, setBoardStatus] = useState(board.boardStatus === 1);
  useEffect(() => {
    setBoardStatus(board.boardStatus === 1);
  }, [board]);
  const changeStatus = (e) => {
    const boardNo = board.boardNo;
    const checkStatus = e.target.checked;
    const boardStatus = checkStatus ? 1 : 2;
    const b = { boardNo, boardStatus };
    axios
      .patch(backServer + "/admin/boardStatus", b)
      .then((res) => {
        console.log(res.data);
        if (res.data.message === "success") {
          setBoardStatus(checkStatus);
        }
      })
      .catch((res) => {
        console.log(res);
      });
  };
  return (
    <tr>
      <td>{board.boardNo}</td>
      <td className="title-td">
        <div>
          <Link to={"/board/view/" + board.boardNo}>{board.boardTitle}</Link>
        </div>
      </td>
      <td>{board.boardWriter}</td>
      <td>{board.boardDate}</td>
      <td className="status-td">
        <Switch checked={boardStatus} onChange={changeStatus} />
      </td>
    </tr>
  );
};
export default AdminBoard;
