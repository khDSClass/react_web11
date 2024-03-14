package kr.or.iei;

import org.springframework.http.HttpStatus;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@AllArgsConstructor//모든매개변수가있는 생성자
@Getter	//getter
@Schema(description = "응답데이터 형식")
public class ResponseDTO {
	@Schema(description = "응답 코드", type="number")
	private int code;
	@Schema(description = "응답 객체", type="HttpStatus")
	private HttpStatus httpStatus;
	@Schema(description = "응답 메세지", type="string")
	private String message;
	@Schema(description = "응답 데이터", type="object")
	private Object data;
}
