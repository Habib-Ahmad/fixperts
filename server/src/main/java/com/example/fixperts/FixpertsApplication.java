package com.example.fixperts;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;


@SpringBootApplication
public class FixpertsApplication {
	public static void main(String[] args) {
		var dotenv = io.github.cdimascio.dotenv.Dotenv.configure().ignoreIfMissing().load();
		var uri = dotenv.get("MONGODB_URI");

		if (uri != null && !uri.isBlank()) {
			System.setProperty("spring.data.mongodb.uri", uri);
		} else {
			System.out.println("MONGODB_URI missing in .env");
		}

		SpringApplication.run(FixpertsApplication.class, args);
	}
}
