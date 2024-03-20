package kr.or.iei.board.model.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import kr.or.iei.board.model.dto.Board;
import kr.or.iei.board.model.dto.BoardFile;
import kr.or.iei.util.PageInfo;

@Mapper
public interface BoardDao {

	int totalCount();

	List selectBoardList(PageInfo pi);

	int insertBoard(Board board);

	int insertBoardFile(BoardFile bf);

	Board selectOneBoard(int boardNo);

	List selectOneBoardFileList(int boardNo);

	BoardFile selectOneBoardFile(int boardFileNo);

	int deleteBoard(int boardNo);

	List<BoardFile> selectBoardFile(int[] delFileNo);

	int deleteBoardFile(int[] delFileNo);

	int updateBoard(Board board);

	int adminTotalCount();

	List adminBoardList(PageInfo pi);

	int changeBoardStaus(Board board);

}
