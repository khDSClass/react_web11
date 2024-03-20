import { Route, Routes } from "react-router-dom";
import "./board.css";
import BoardList from "./BoardList";
import BoardWrite from "./BoardWrite";
import BoardView from "./BoardView";
import BoardModify from "./BoardModify";

const BoardMain = (props) => {
  const isLogin = props.isLogin;
  return (
    <div className="board-all-wrap">
      <div className="board-title">게시판</div>
      <Routes>
        <Route path="/list" element={<BoardList isLogin={isLogin} />} />
        <Route path="/write" element={<BoardWrite />} />
        <Route
          path="/view/:boardNo"
          element={<BoardView isLogin={isLogin} />}
        />
        <Route path="/modify/:boardNo" element={<BoardModify />} />
      </Routes>
    </div>
  );
};

export default BoardMain;
