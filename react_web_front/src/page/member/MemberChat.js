import { useEffect, useRef, useState } from "react";

const MemberChat = (props) => {
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const socketServer = backServer.replace("http://", "ws://");
  const memberId = props.memberId;
  console.log(memberId);
  const [ws, setWs] = useState({});
  useEffect(() => {
    const socket = new WebSocket(socketServer + "/allChat");
    setWs(socket);
    return () => {
      console.log("채팅페이지에서 나감");
      socket.close();
    };
  }, []);

  //웹소켓 연결이 완료되면 실행할 함수
  const startChat = () => {
    const data = { type: "enter", memberId: memberId };
    console.log(data);
    ws.send(JSON.stringify(data));
  };
  //서버에서 데이터를 받으면 실행되는 함수
  const receiveMsg = (receiveData) => {
    const receiveStr = receiveData.data;
    const chat = JSON.parse(receiveStr);
    console.log(receiveStr);
    console.log(chat);
    setChatList([...chatList, chat]);
  };
  //소켓연결이 종료되면 실행되는 함수
  const endChat = () => {};
  //웹소켓 객체에 각 함수를 연결
  ws.onopen = startChat;
  ws.onmessage = receiveMsg;
  ws.onclose = endChat;

  const [chatList, setChatList] = useState([]); //채팅목록
  const [chatMessage, setChatMessage] = useState(""); //입력받아서 전송할 메세지
  const [btnStatus, setBtnStatus] = useState(true);

  const inputChatMessage = (e) => {
    const checkValue = e.target.value.replaceAll("\n", "");
    if (chatMessage === "" && checkValue === "") {
      setBtnStatus(true);
      return;
    }
    setChatMessage(e.target.value);
    setBtnStatus(false);
  };

  const sendMessage = () => {
    const data = { type: "chat", memberId: memberId, message: chatMessage };
    console.log(data);
    console.log(JSON.stringify(data));
    ws.send(JSON.stringify(data));
    setChatMessage("");
    setBtnStatus(true);
  };
  const inputKeyboard = (e) => {
    if (e.keyCode === 13 && !e.shiftKey && chatMessage !== "") {
      sendMessage();
    }
  };
  const chatAreaRef = useRef(null);
  useEffect(() => {
    if (chatAreaRef.current) {
      chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
    }
  }, [chatList]);
  return (
    <div className="mypage-current-wrap">
      <div className="mypage-current-title">Websocket Chatting</div>
      <div className="chat-content-wrap">
        <div className="chat-message-area" ref={chatAreaRef}>
          {chatList.map((chat, index) => {
            return (
              <ChattingMessage
                key={"chat-message" + index}
                chat={chat}
                memberId={memberId}
              />
            );
          })}
        </div>
        <div className="chat-input-box">
          <textarea
            className="chat-message"
            placeholder="Input Message..."
            value={chatMessage}
            onChange={inputChatMessage}
            onKeyUp={inputKeyboard}
          />
          <button
            className="send-btn"
            disabled={btnStatus}
            onClick={sendMessage}
          >
            전송
          </button>
        </div>
      </div>
    </div>
  );
};

const ChattingMessage = (props) => {
  const chat = props.chat;
  const memberId = props.memberId;
  console.log(chat);
  console.log(memberId);

  return (
    <>
      {chat.type === "enter" ? (
        <p className="info">
          <span>{chat.memberId}</span>님이 입장하셨습니다.
        </p>
      ) : chat.type === "out" ? (
        <p className="info">
          <span>{chat.memberId}</span>님이 나가셨습니다.
        </p>
      ) : (
        <div
          className={chat.memberId === memberId ? "chat right" : "chat left"}
        >
          <div className="user">
            <span className="material-icons">account_circle</span>
            <span className="name">{chat.memberId}</span>
          </div>
          <div className="chatting-message">{chat.message}</div>
        </div>
      )}
    </>
  );
};
export default MemberChat;
