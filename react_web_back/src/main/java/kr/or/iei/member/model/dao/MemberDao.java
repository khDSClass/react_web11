package kr.or.iei.member.model.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import kr.or.iei.member.model.dto.Member;
import kr.or.iei.util.PageInfo;

@Mapper
public interface MemberDao {

	Member selectOneMember(String memberId);

	int insertMember(Member member);

	int updateMember(Member member);

	int deleteMember(String memberId);

	int changePwMember(Member member);

	int memberTotalCount();

	List selectMemberList(PageInfo pi);

	int changeMemberType(Member member);

}
