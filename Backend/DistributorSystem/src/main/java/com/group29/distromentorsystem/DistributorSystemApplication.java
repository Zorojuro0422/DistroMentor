package com.group29.distromentorsystem;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
@ComponentScan("com.group29.distromentorsystem")
public class DistributorSystemApplication {

	public static void main(String[] args) {
		SpringApplication.run(DistributorSystemApplication.class, args);
	}

}
