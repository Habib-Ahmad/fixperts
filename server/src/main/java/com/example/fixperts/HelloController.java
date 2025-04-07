package com.example.fixperts;

import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Tag(name = "Welcome", description = "Basic API welcome message")
public class HelloController {

    @GetMapping("/")
    public String hello() {
        return "Welcome to Fixperts Server!";
    }
}
