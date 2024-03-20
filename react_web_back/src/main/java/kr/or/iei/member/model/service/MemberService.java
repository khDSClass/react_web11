package kr.or.iei.member.model.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import kr.or.iei.member.model.dao.MemberDao;
import kr.or.iei.member.model.dto.Member;
import kr.or.iei.util.JwtUtil;
import kr.or.iei.util.PageInfo;
import kr.or.iei.util.Pagination;

@Service
public class MemberService {
	@Autowired
	private MemberDao memberDao;
	@Autowired
	private BCryptPasswordEncoder bCryptPasswordEncoder;
	@Autowired
	private JwtUtil jwtUtil;
	@Autowired
	private Pagination pagination;

	public Member selectOneMember(String memberId) {
		// TODO Auto-generated method stub
		return memberDao.selectOneMember(memberId);
	}
	@Transactional
	public int insertMember(Member member) {
		// TODO Auto-generated method stub
		return memberDao.insertMember(member);
	}
	public String login(Member member) {
		Member m = memberDao.selectOneMember(member.getMemberId());
		if(m != null && bCryptPasswordEncoder.matches(member.getMemberPw(), m.getMemberPw())) {
			long expiredDateMs = 60*60*1000l;
			String accessToken = jwtUtil.createToken(member.getMemberId(), expiredDateMs);			
			return accessToken;
		}else {			
			return null;
		}
	}
	@Transactional
	public int updatePhone(Member member) {
		// TODO Auto-generated method stub
		return memberDao.updateMember(member);
	}
	@Transactional
	public int deleteMember(String memberId) {
		// TODO Auto-generated method stub
		return memberDao.deleteMember(memberId);
	}
	public int checkPw(Member member) {
		Member m = memberDao.selectOneMember(member.getMemberId());
		if(m != null && bCryptPasswordEncoder.matches(member.getMemberPw(), m.getMemberPw())) {
			return 1;
		}else {			
			return 0;
		}
	}
	@Transactional
	public int changePwMember(Member member) {
		// TODO Auto-generated method stub
		return memberDao.changePwMember(member);
	}
	public Map selectMemberList(int reqPage) {
		int numPerPage = 2;
		int pageNaviSize = 5;
		int totalCount = memberDao.memberTotalCount();
		PageInfo pi = pagination.getPageInfo(reqPage, numPerPage, pageNaviSize, totalCount);
		List memberList = memberDao.selectMemberList(pi);
		HashMap<String, Object> map = new HashMap<String, Object>();
		map.put("memberList",memberList);
		map.put("pi",pi);
		return map;
	}
	@Transactional
	public int changeMemberType(Member member) {
		// TODO Auto-generated method stub
		return memberDao.changeMemberType(member);
	}
}








