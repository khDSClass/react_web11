package kr.or.iei.util;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;

import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import jakarta.servlet.ServletOutputStream;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class FileUtils {
	//저장경로,파일객체를 매개변수변수로 받아서
	//해당 저장경로에 파일명이 중복되지 않도록 업로드 하고, 업로드한 파일명을 리턴
	public String upload(String savepath, MultipartFile file) {
		//원본파일명 추출 => text.txt
		String filename = file.getOriginalFilename();
		//test.txt      ->        test                  .txt
		String onlyFilename = filename.substring(0, filename.lastIndexOf("."));//test
		String extention = filename.substring(filename.lastIndexOf("."));//.txt
		//실제업로드할 파일명
		String filepath = null;
		//중복파일명이있으면 1씩증가시키면서 뒤에 붙일 숫자
		int count = 0;
		while(true) {
			if(count == 0) {
				//첫번째의 경우는 숫자를 붙이지않고 바로 검증
				filepath = onlyFilename+extention;			//test.txt
			}else {
				//파일명에 숫자를 붙여서 생성
				filepath = onlyFilename+"_"+count+extention;//test_1.txt
			}
			//위에 if로 만든 파일명이 사용중인지 체크
			File checkFile = new File(savepath+filepath);
			if(!checkFile.exists()) {
				break;
			}
			count++;
		}
		//파일명 중복체크 끝 -> 내가 업로드할 파일명 결정 -> 파일업로드 진행
		
		try {
			//중복처리끝난 파일명으로 파일업로드
			file.transferTo(new File(savepath+filepath));
		} catch (IllegalStateException | IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return filepath;
	}

	public void downloadFile(String savepath, String filename, String filepath, HttpServletResponse response) {
		String downFile = savepath+filepath;
		
		try {
			//파일을 JAVA로 읽어오기위한 주 스트림 생성
			FileInputStream fis = new FileInputStream(downFile);
			//속도개선을위한 보조스트림 생성
			BufferedInputStream bis = new BufferedInputStream(fis);
			
			//읽어온 파일을 사용자에게 내보낼 주스트림 생성
			ServletOutputStream sos = response.getOutputStream();
			//속도개선을 위한 보조스트림 생성
			BufferedOutputStream bos = new BufferedOutputStream(sos);
			
			//다운로드할 파일이름(사용자가 받았을때 파일이름) 처리
			String resFilename = new String(filename.getBytes("UTF-8"),"ISO-8859-1");
			
			//파일다운로드를 위한 HTTP 헤더 설정
			response.setContentType("application/octet-stream");
			response.setHeader("Content-Disposition", "attachment;filename="+resFilename);
			
			//파일전송
			while(true) {
				int read = bis.read();	
				if(read != -1) {
					bos.write(read);
				}else {
					break;
				}
			}
			bos.close();
			bis.close();
		} catch (FileNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		
	}

	public void deleteFile(String savepath, String filepath) {
		File delFile = new File(savepath+filepath);
		delFile.delete();	
	}
}
















