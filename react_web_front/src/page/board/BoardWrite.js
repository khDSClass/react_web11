import { useState } from "react";
import BoardFrm from "./BoardFrm";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const BoardWrite = () => {
  const backServer = process.env.REACT_APP_BACK_SERVER;
  //제목,썸네일,내용,첨부파일 -> 글 작성을 위해서 사용자에게 받아야하는 정보 -> state생성(데이터 전송용)
  const [boardTitle, setBoardTitle] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [boardContent, setBoardContent] = useState("");
  const [boardFile, setBoardFile] = useState([]);
  //사용자 화면 출력용 state(화면 전송시 사용하지 않음)
  const [boardImg, setBoardImg] = useState(null); //썸네일 미리보기용
  const [fileList, setFileList] = useState([]); //첨부파일 미리보기용
  const navigate = useNavigate();
  const write = () => {
    console.log(boardTitle);
    console.log(boardContent);
    console.log(thumbnail);
    console.log(boardFile);
    if (boardTitle !== "" && boardContent !== "") {
      //전송용 form객체 생성
      const form = new FormData();
      form.append("boardTitle", boardTitle);
      form.append("boardContent", boardContent);
      //썸네일은 첨부한 경우에만 추가
      if (thumbnail !== null) {
        form.append("thumbnail", thumbnail);
      }
      //첨부파일도 첨부한 갯수만큼 반복해서 추가
      for (let i = 0; i < boardFile.length; i++) {
        form.append("boardFile", boardFile[i]);
      }

      axios
        .post(backServer + "/board", form, {
          headers: {
            contentType: "multipart/form-data",
            prcessData: false,
          },
        })
        .then((res) => {
          if (res.data.message === "success") {
            navigate("/board/list");
          } else {
            Swal.fire("작성 중 문제가 발생했습니다.");
          }
        })
        .catch((res) => {
          console.log(res);
        });
    }
  };

  return (
    <div className="board-write-wrap">
      <div className="board-frm-title">게시글 작성</div>
      <BoardFrm
        boardTitle={boardTitle}
        setBoardTitle={setBoardTitle}
        boardContent={boardContent}
        setBoardContent={setBoardContent}
        thumbnail={thumbnail}
        setThumbnail={setThumbnail}
        boardFile={boardFile}
        setBoardFile={setBoardFile}
        boardImg={boardImg}
        setBoardImg={setBoardImg}
        fileList={fileList}
        setFileList={setFileList}
        buttonFunction={write}
      />
    </div>
  );
};

export default BoardWrite;
