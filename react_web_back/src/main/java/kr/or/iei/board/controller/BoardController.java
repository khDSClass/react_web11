package kr.or.iei.board.controller;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import kr.or.iei.ResponseDTO;
import kr.or.iei.board.model.dto.Board;
import kr.or.iei.board.model.dto.BoardFile;
import kr.or.iei.board.model.service.BoardService;
import kr.or.iei.util.FileUtils;

@CrossOrigin("*")
@RestController
@RequestMapping(value="/board")
public class BoardController {
	@Autowired
	private BoardService boardService;
	@Autowired
	private FileUtils fileUtils;
	@Value("${file.root}")
	private String root;
	
	@GetMapping(value="/list/{reqPage}")
	public ResponseEntity<ResponseDTO> boardList(@PathVariable int reqPage){
		Map map = boardService.selectBoardList(reqPage);
		ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", map);
		return new ResponseEntity<ResponseDTO>(response,response.getHttpStatus());
	}
	
	@PostMapping(value="/editor")
	public ResponseEntity<ResponseDTO> editorUpload(@ModelAttribute MultipartFile image){
		String savepath = root +"/boardEditor/";
		String filepath = fileUtils.upload(savepath, image);
		String returnPath = "/board/editor/"+filepath;
		ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", returnPath);
		return new ResponseEntity<ResponseDTO>(response,response.getHttpStatus());
	}
	
	@PostMapping
	public ResponseEntity<ResponseDTO> insertBoard(@ModelAttribute Board board, @ModelAttribute MultipartFile thumbnail, @ModelAttribute MultipartFile[] boardFile, @RequestAttribute String memberId){
		board.setBoardWriter(memberId);//로그인회원 아이디를 작성자로 세팅
		String savepath = root+"/board/";
		if(thumbnail != null) {
			String filepath = fileUtils.upload(savepath, thumbnail);
			board.setBoardImg(filepath);
		}
		ArrayList<BoardFile> fileList = new ArrayList<BoardFile>();
		if(boardFile != null) {
			for(MultipartFile file : boardFile) {
				String filename = file.getOriginalFilename();
				String filepath = fileUtils.upload(savepath, file);
				BoardFile bf = new BoardFile();
				bf.setFilename(filename);
				bf.setFilepath(filepath);
				fileList.add(bf);
			}
		}
		int result = boardService.insertBoard(board,fileList);
		if(result == 1+fileList.size()) {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", null);
			return new ResponseEntity<ResponseDTO>(response,response.getHttpStatus());
		}else {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "fail", null);
			return new ResponseEntity<ResponseDTO>(response,response.getHttpStatus());
		}
	}
	
	@GetMapping(value="/one/{boardNo}")
	public ResponseEntity<ResponseDTO> selectOneBoard(@PathVariable int boardNo){
		Board board = boardService.selectOneBoard(boardNo);
		ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", board);
		return new ResponseEntity<ResponseDTO>(response,response.getHttpStatus());
	}
	
	@GetMapping(value="/file/{boardFileNo}")
	public ResponseEntity<Resource> fileDown(@PathVariable int boardFileNo) throws FileNotFoundException{
		BoardFile boardFile = boardService.selectOneBoardFile(boardFileNo);
		String savepath = root+"/board/";
		File file = new File(savepath+boardFile.getFilepath());
		Resource resource = new InputStreamResource(new FileInputStream(file));
		//파일 다운로드 헤더 설정
		HttpHeaders header = new HttpHeaders();
		header.add("Content-Disposition", "attachment; filename=\""+boardFile.getFilename()+"\"");
		header.add("Cache-Control", "no-cache, no-store, must-revalidate");
		header.add("Pragma", "no-cache");
		header.add("Expires", "0");
		
		return ResponseEntity
				.status(HttpStatus.OK)
				.headers(header)
				.contentLength(file.length())
				.contentType(MediaType.APPLICATION_OCTET_STREAM)
				.body(resource);
		
	}
	
	@DeleteMapping(value="{boardNo}")
	public ResponseEntity<ResponseDTO> deleteBoard(@PathVariable int boardNo){
		List<BoardFile> fileList = boardService.deleteBoard(boardNo);
		if(fileList != null) {
			String savepath = root+"/board/";
			for(BoardFile boardFile : fileList) {
				File file = new File(savepath+boardFile.getFilepath());
				file.delete();
			}
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", null);
			return new ResponseEntity<ResponseDTO>(response,response.getHttpStatus());
		}else {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "fail", null);
			return new ResponseEntity<ResponseDTO>(response,response.getHttpStatus());
		}
	}
	
	
	@PatchMapping
	public ResponseEntity<ResponseDTO> modifyBoard(@ModelAttribute Board board, @ModelAttribute MultipartFile thumbnail, @ModelAttribute MultipartFile[] boardFile){
		String savepath = root+"/board/";
		if(board.getThumbnailCheck() == 1) {//썸네일이 변경된 경우에만
			if(thumbnail != null) {	//새로첨부한 경우
				String filepath = fileUtils.upload(savepath, thumbnail);
				board.setBoardImg(filepath);
			}else {		//기존파일을 지우기만 한경우
				board.setBoardImg(null);
			}
		}
		//추가 첨부파일 작업
		ArrayList<BoardFile> fileList = new ArrayList<BoardFile>();
		if(boardFile != null) {
			for(MultipartFile file : boardFile) {
				String filename = file.getOriginalFilename();
				String filepath = fileUtils.upload(savepath, file);
				BoardFile bf = new BoardFile();
				bf.setFilename(filename);
				bf.setFilepath(filepath);
				bf.setBoardNo(board.getBoardNo());
				fileList.add(bf);
			}
		}
		List<BoardFile> delFileList = boardService.updateBoard(board,fileList);
		if(delFileList != null) {
			for(BoardFile bf : delFileList) {
				File file = new File(savepath+bf.getFilepath());
				file.delete();
			}
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", null);
			return new ResponseEntity<ResponseDTO>(response,response.getHttpStatus());
		}else {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "fail", null);
			return new ResponseEntity<ResponseDTO>(response,response.getHttpStatus());
		}
	}
}












