package kr.or.iei.member.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import kr.or.iei.ResponseDTO;
import kr.or.iei.member.model.dto.Member;
import kr.or.iei.member.model.service.MemberService;

@CrossOrigin("*")
@RestController
@RequestMapping(value="/member")
@Tag(name="MEMBER", description = "MEMBER API")
public class MemberController {
	@Autowired
	private MemberService memberService;
	
	@Operation(summary = "아이디 중복체크", description = "매개변수로 전달한 아이디 사용여부 조회")
	@ApiResponses({
		@ApiResponse(responseCode = "200", description = "message 값 확인"),
		@ApiResponse(responseCode = "500", description = "서버에러")
	})
	@GetMapping(value="/id/{memberId}")
	public ResponseEntity<ResponseDTO> selectOneMember(@PathVariable String memberId){
		Member member = memberService.selectOneMember(memberId);
		if(member == null) {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "not duplication", null);
			return new ResponseEntity<ResponseDTO>(response,response.getHttpStatus());
		}else {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "duplication", null);
			return new ResponseEntity<ResponseDTO>(response,response.getHttpStatus());
		}
	}
	
	@PostMapping(value="/join")
	public ResponseEntity<ResponseDTO> join(@RequestBody Member member){
		int result = memberService.insertMember(member);
		if(result>0) {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", null);
			return new ResponseEntity<ResponseDTO>(response,response.getHttpStatus());
		}else {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "fail", null);
			return new ResponseEntity<ResponseDTO>(response,response.getHttpStatus());
		}
	}
	
	@PostMapping(value="/login")
	public ResponseEntity<ResponseDTO> login(@RequestBody Member member){
		Member m = memberService.login(member);
		if(m != null) {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "success", null);
			return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
		}else {
			ResponseDTO response = new ResponseDTO(200, HttpStatus.OK, "fail", null);
			return new ResponseEntity<ResponseDTO>(response, response.getHttpStatus());
		}
	}
}











