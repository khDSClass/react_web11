package kr.or.iei;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

import kr.or.iei.member.model.service.AllMemberChatHandler;

@Configuration
@EnableWebSocket
public class WebsocketConfig implements WebSocketConfigurer{
	@Autowired
	private AllMemberChatHandler allMemberChatHandler;
	
	@Override
	public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
		registry.addHandler(allMemberChatHandler, "/allChat").setAllowedOrigins("*");
		
	}

}
