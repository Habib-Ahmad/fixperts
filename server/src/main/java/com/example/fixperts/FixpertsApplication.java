package com.example.fixperts;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class FixpertsApplication {

	public static void main(String[] args) {
		Dotenv dotenv = Dotenv.configure().load();
		System.setProperty("MONGODB_URI", dotenv.get("MONGODB_URI"));

		SpringApplication.run(FixpertsApplication.class, args);
	}

}
