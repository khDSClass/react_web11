package kr.or.iei.util;

import java.util.Date;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtUtil {
	@Value("${jwt.secret}")
	private String secret;
	//access token을 생성하는 메소드(첫번째 매개변수는 토큰에다가 저장할 정보 -> 식별자, 두번째 매개변수 토큰만료시간 long)
	public String createToken(String memberId, long expiredDateMs) {
		Claims claims = Jwts.claims();//생성하는 토큰을 통해서 얻을수있는 값을 저장하는 객체
		claims.put("memberId",memberId);//회원 아이디값을 저장
		SecretKey key = Keys.hmacShaKeyFor(secret.getBytes());//우리가 지정한 문자열을 이용해서 암호화코드 생성
		return Jwts.builder()				//JWT토큰 생성시작
				.setClaims(claims)			//아이디정보 세팅
				.setIssuedAt(new Date(System.currentTimeMillis()))//인증시작시간은 현재 시스템시간
				.setExpiration(new Date(System.currentTimeMillis()+expiredDateMs))//인증만료시간
				.signWith(key,SignatureAlgorithm.HS256)//암호화할 때 사용할 키값 및 알고리즘
				.compact();//위 내용들 종합해서 JWT 토큰 생성
	}
	//매개변수로 토큰을 받아서 토큰시간이 만료되었는지 체크하는 메소드
	public boolean isExpired(String token) {
		SecretKey key = Keys.hmacShaKeyFor(secret.getBytes());
		//JWT 객체에 시크릿키(인증정보 정상인지 체크하는용도), 토큰(사용자가 보내온값), 현재시간이랑 비교해서 만료되었는지
		return Jwts.parserBuilder()
					.setSigningKey(key).build()
					.parseClaimsJws(token)
					.getBody().getExpiration().before(new Date());
	}
	//매개변수로 토큰을 받아서 회원 아이디값을 추출하는 메소드
	public String getMemberId(String token) {
		SecretKey key = Keys.hmacShaKeyFor(secret.getBytes());
		return Jwts.parserBuilder()
				.setSigningKey(key).build()
				.parseClaimsJws(token)
				.getBody().get("memberId",String.class);
	}
}








