import { useState } from "react";
import { Button1, Input } from "../../component/FormFrm";
import TextEditor from "../../component/TextEditor";

const BoardFrm = (props) => {
  const boardTitle = props.boardTitle;
  const setBoardTitle = props.setBoardTitle;
  const boardContent = props.boardContent;
  const setBoardContent = props.setBoardContent;
  const thumbnail = props.thumbnail;
  const setThumbnail = props.setThumbnail;
  const boardFile = props.boardFile;
  const setBoardFile = props.setBoardFile;

  const boardImg = props.boardImg;
  const setBoardImg = props.setBoardImg;
  const fileList = props.fileList;
  const setFileList = props.setFileList;

  const buttonFunction = props.buttonFunction;

  const type = props.type;
  const delFileNo = props.delFileNo;
  const setDelFileNo = props.setDelFileNo;
  const thumbnailCheck = props.thumbnailCheck;
  const setThumbnailCheck = props.setThumbnailCheck;

  const [newFileList, setNewFileList] = useState([]); //첨부파일을 추가하면 화면에 보여줄 state

  const backServer = process.env.REACT_APP_BACK_SERVER;

  //썸네일 파일 추가시 동작할 함수
  const changeThumbnail = (e) => {
    const files = e.currentTarget.files;
    if (files.length !== 0 && files[0] != 0) {
      if (type === "modify") {
        setThumbnailCheck(1);
      }
      setThumbnail(files[0]); //전송용 state에 file객체를 세팅
      //화면에 썸네일 미리보기
      const reader = new FileReader();
      reader.readAsDataURL(files[0]);
      reader.onloadend = () => {
        setBoardImg(reader.result);
      };
    } else {
      setThumbnail(null);
      setBoardImg(null);
    }
  };
  //첨부파일 추가 시 동작할 함수
  const changeFile = (e) => {
    const files = e.currentTarget.files;
    console.log(files);
    setBoardFile(files);
    const arr = new Array();
    for (let i = 0; i < files.length; i++) {
      arr.push(files[i].name);
    }
    setNewFileList(arr);
  };
  return (
    <div className="board-frm-wrap">
      <div className="board-frm-top">
        <div className="board-thumbnail">
          {boardImg === null ? (
            <img src="/image/default.png" />
          ) : type === "modify" && thumbnailCheck == 0 ? (
            <img src={backServer + "/board/thumbnail/" + boardImg} />
          ) : (
            <img src={boardImg} />
          )}
        </div>
        <div className="board-info">
          <table className="board-info-tbl">
            <tbody>
              <tr>
                <td>
                  <label htmlFor="boardTitle">제목</label>
                </td>
                <td>
                  <Input
                    type="text"
                    data={boardTitle}
                    setData={setBoardTitle}
                    content="boardTitle"
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <label htmlFor="thumbnail">대표이미지</label>
                </td>
                <td>
                  <input
                    type="file"
                    id="thumbnail"
                    accept="image/*"
                    onChange={changeThumbnail}
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <label htmlFor="boardFile">첨부파일</label>
                </td>
                <td>
                  <input type="file" onChange={changeFile} multiple />
                </td>
              </tr>
              <tr className="file-list">
                <td>첨부파일목록</td>
                <td>
                  <div className="file-zone">
                    {type === "modify"
                      ? fileList.map((file, index) => {
                          return (
                            <FileItem
                              key={"oldFile" + index}
                              file={file}
                              fileList={fileList}
                              setFileList={setFileList}
                              delFileNo={delFileNo}
                              setDelFileNo={setDelFileNo}
                            />
                          );
                        })
                      : ""}

                    {newFileList.map((item, index) => {
                      return (
                        <p key={"newFile" + index}>
                          <span className="filename">{item}</span>
                        </p>
                      );
                    })}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className="board-frm-bottom">
        <TextEditor
          data={boardContent}
          setData={setBoardContent}
          url={backServer + "/board/editor"}
        />
      </div>
      <div className="board-frm-btn-box">
        <Button1
          text={type === "modify" ? "수정하기" : "작성하기"}
          clickEvent={buttonFunction}
        />

        {/*type === "modify" ? (
          <Button1 text="수정하기" clickEvent={buttonFunction} />
        ) : (
          <Button1 text="작성하기" clickEvent={buttonFunction} />
        )*/}
      </div>
    </div>
  );
};

const FileItem = (props) => {
  const file = props.file;
  const fileList = props.fileList;
  const setFileList = props.setFileList;
  const delFileNo = props.delFileNo;
  const setDelFileNo = props.setDelFileNo;

  const deleteFile = () => {
    //delFileNo 배열에 현재 파일번호 추가(controller로 전송해서 작업해야하니까)
    /*
    const copyDelFileNo = [...delFileNo];
    copyDelFileNo.push(file.fileNo);
    setDelFileNo(copyDelFileNo);
    */
    setDelFileNo([...delFileNo, file.boardFileNo]);
    //화면에서 파일 삭제 -> fileList에서 해당 file을 제거
    /*
    const copyFileList = new Array();
    for (let i = 0; i < fileList.length; i++) {
      if (fileList[i] !== file) {
        copyFileList.push(fileList[i]);
      }
    }
    setFileList(copyFileList);
*/
    const newFileList = fileList.filter((item) => {
      return item !== file;
    });
    setFileList(newFileList);
  };

  return (
    <p>
      <span className="filename">{file.filename}</span>
      <span className="material-icons del-file-icon" onClick={deleteFile}>
        delete
      </span>
    </p>
  );
};

export default BoardFrm;
