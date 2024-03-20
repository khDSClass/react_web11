import { useEffect, useState } from "react";
import { Button1 } from "../../component/FormFrm";
import axios from "axios";
import Pagination from "../../component/Pagination";
import { useNavigate } from "react-router-dom";

const BoardList = (props) => {
  const isLogin = props.isLogin;
  const [boardList, setBoardList] = useState([]);
  //페이징을 구현하는 화면도 react로 작성 -> 페이징 구현에 필요한 데이터들을 객체로 받음
  const [pageInfo, setPageInfo] = useState({});
  const [reqPage, setReqPage] = useState(1);
  const backServer = process.env.REACT_APP_BACK_SERVER;
  useEffect(() => {
    axios
      .get(backServer + "/board/list/" + reqPage)
      .then((res) => {
        console.log(res.data);
        setBoardList(res.data.data.boardList);
        setPageInfo(res.data.data.pi);
      })
      .catch((res) => {
        console.log(res);
      });
  }, [reqPage]);
  const navigate = useNavigate();
  const writeBtn = () => {
    navigate("/board/write");
  };
  return (
    <>
      {isLogin ? (
        <div className="board-write-btn">
          <Button1 text="글쓰기" clickEvent={writeBtn} />
        </div>
      ) : (
        ""
      )}
      <div className="board-list-wrap">
        {boardList.map((board, index) => {
          return <BoardItem key={"board" + index} board={board} />;
        })}
      </div>
      <div className="board-page">
        <Pagination
          pageInfo={pageInfo}
          reqPage={reqPage}
          setReqPage={setReqPage}
        />
      </div>
    </>
  );
};

const BoardItem = (props) => {
  const board = props.board;
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const navigate = useNavigate();
  const boardView = () => {
    navigate("/board/view/" + board.boardNo);
  };
  return (
    <div className="board-item" onClick={boardView}>
      <div className="board-item-img">
        {board.boardImg === null ? (
          <img src="/image/default.png" />
        ) : (
          <img src={backServer + "/board/thumbnail/" + board.boardImg} />
        )}
      </div>
      <div className="board-item-info">
        <div className="board-item-title">{board.boardTitle}</div>
        <div className="board-item-writer">{board.boardWriter}</div>
        <div className="board-item-date">{board.boardDate}</div>
      </div>
    </div>
  );
};

export default BoardList;
