package kr.or.iei.board.model.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import kr.or.iei.board.model.dao.BoardDao;
import kr.or.iei.board.model.dto.Board;
import kr.or.iei.board.model.dto.BoardFile;
import kr.or.iei.util.PageInfo;
import kr.or.iei.util.Pagination;

@Service
public class BoardService {
	@Autowired
	private BoardDao boardDao;
	@Autowired
	private Pagination pagination;
	
	public Map selectBoardList(int reqPage) {
		int numPerPage = 12;	//한페이지 당 게시물 수
		int pageNaviSize = 5;	//페이지 네비게이션 길이
		int totalCount = boardDao.totalCount();//전체 게시물 수(전체 페이지 수 계산을 위해서)
		//페이징처리에 필요한 값을 계산해서 객체로 리턴받음
		PageInfo pi = pagination.getPageInfo(reqPage, numPerPage, pageNaviSize, totalCount);
		List list = boardDao.selectBoardList(pi);
		HashMap<String, Object> map = new HashMap<String, Object>();
		map.put("boardList",list);
		map.put("pi",pi);
		return map;
	}
	@Transactional
	public int insertBoard(Board board, ArrayList<BoardFile> fileList) {
		int result = boardDao.insertBoard(board);
		for(BoardFile bf : fileList) {
			bf.setBoardNo(board.getBoardNo());
			result += boardDao.insertBoardFile(bf);
		}
		return result;
	}
	public Board selectOneBoard(int boardNo) {
		Board board = boardDao.selectOneBoard(boardNo);
		List list = boardDao.selectOneBoardFileList(boardNo);
		board.setFileList(list);
		return board;
	}
	public BoardFile selectOneBoardFile(int boardFileNo) {
		// TODO Auto-generated method stub
		return boardDao.selectOneBoardFile(boardFileNo);
	}
	@Transactional
	public List<BoardFile> deleteBoard(int boardNo) {
		List<BoardFile> fileList = boardDao.selectOneBoardFileList(boardNo);
		int result = boardDao.deleteBoard(boardNo);
		if(result > 0 ) {
			return fileList;
		}
		return null;
	}
	@Transactional
	public List<BoardFile> updateBoard(Board board, ArrayList<BoardFile> fileList) {
		List<BoardFile> delFileList = new ArrayList<BoardFile>();
		int result = 0;
		int delFileCount = 0;
		//삭제한 파일이 있으면 파일정보를 조회하고, DB에서 정보 삭제
		if(board.getDelFileNo() != null) {
			delFileCount = board.getDelFileNo().length;
			delFileList = boardDao.selectBoardFile(board.getDelFileNo());
			result += boardDao.deleteBoardFile(board.getDelFileNo());
		}
		//추가한 파일이 있으면 DB에 추가
		for(BoardFile bf : fileList) {
			result += boardDao.insertBoardFile(bf);
		}
		result += boardDao.updateBoard(board);
		if(result == 1+fileList.size()+delFileCount) {
			return delFileList;
		}else {
			return null;
		}		
	}
	public Map adminBoardList(int reqPage) {
		int numPerPage = 10;
		int pageNaviSize = 5;
		int totalCount = boardDao.adminTotalCount();
		PageInfo pi = pagination.getPageInfo(reqPage, numPerPage, pageNaviSize, totalCount);
		List list = boardDao.adminBoardList(pi);
		HashMap<String, Object> map = new HashMap<String, Object>();
		map.put("boardList", list);
		map.put("pi",pi);
		return map;
	}
	@Transactional
	public int changeBoardStatus(Board board) {
		// TODO Auto-generated method stub
		return boardDao.changeBoardStaus(board);
	}
}










