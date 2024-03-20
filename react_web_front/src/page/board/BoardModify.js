import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BoardFrm from "./BoardFrm";

const BoardModify = () => {
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const params = useParams();
  const boardNo = params.boardNo;
  //제목,썸네일,내용,첨부파일 -> 데이터 담을 state생성 -> 데이터 전송용
  const [boardTitle, setBoardTitle] = useState("");
  const [boardContent, setBoardContent] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [boardFile, setBoardFile] = useState([]);
  //화면 출력용 state
  const [boardImg, setBoardImg] = useState(null);
  const [fileList, setFileList] = useState([]);

  //삭제파일번호를 저장할 배열
  const [delFileNo, setDelFileNo] = useState([]); //기존첨부파일을 삭제하면 파일번호를 저장해서 전달할 state

  //썸네일 수정 체크용
  const [thumbnailCheck, setThumbnailCheck] = useState(0);
  const [oldThumbnail, setOldThumbnail] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    axios
      .get(backServer + "/board/one/" + boardNo)
      .then((res) => {
        const board = res.data.data;
        setBoardTitle(board.boardTitle);
        setBoardContent(res.data.data.boardContent);
        setBoardImg(board.boardImg);
        setFileList(board.fileList);
        setOldThumbnail(board.boardImg);
      })
      .catch((res) => {
        console.log(res);
      });
  }, []);
  const modify = () => {
    /*
    console.log("boardTitle : " + boardTitle);
    console.log("boardContent : " + boardContent);
    console.log("thumbnail : " + thumbnail);
    console.log("boardFile : " + boardFile);
    console.log("oldThumbnail : " + oldThumbnail);
    console.log("thumbnailCheck : " + thumbnailCheck);
    console.log("delFileNo : " + delFileNo);
    */
    const form = new FormData();
    form.append("boardNo", boardNo);
    form.append("boardTitle", boardTitle);
    form.append("boardContent", boardContent);
    form.append("thumbnailCheck", thumbnailCheck);
    form.append("boardImg", oldThumbnail); //기존썸네일을 boardImg변수에 저장 -> 썸네일이 변경되지않으면 기존값으로 업데이트
    //썸네일 수정하면 추가
    if (thumbnail !== null) {
      form.append("thumbnail", thumbnail);
    }
    //첨부파일이 추가되면 전송
    for (let i = 0; i < boardFile.length; i++) {
      form.append("boardFile", boardFile[i]);
    }
    //삭제한 파일번호 배열 전송
    for (let i = 0; i < delFileNo.length; i++) {
      form.append("delFileNo", delFileNo[i]);
    }
    axios
      .patch(backServer + "/board", form, {
        headers: {
          contentType: "multipart/form-data",
          processData: false,
        },
      })
      .then((res) => {
        if (res.data.message === "success") {
          navigate("/board/view/" + boardNo);
        }
      })
      .catch((res) => {
        console.log(res);
      });
  };
  return (
    <div className="board-modify-wrap">
      <div className="board-frm-title">게시글 수정</div>
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
        buttonFunction={modify}
        type="modify"
        delFileNo={delFileNo}
        setDelFileNo={setDelFileNo}
        thumbnailCheck={thumbnailCheck}
        setThumbnailCheck={setThumbnailCheck}
      />
    </div>
  );
};

export default BoardModify;
