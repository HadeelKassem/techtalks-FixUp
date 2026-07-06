package com.example.myproject2.Controller;


import com.example.myproject2.Entity.Provider;
import com.example.myproject2.Service.ProviderService;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/providers")
public class ProviderController {


    private final ProviderService providerService;


    public ProviderController(ProviderService providerService) {
        this.providerService = providerService;
    }


    @GetMapping("/category/{categoryId}")
    public List<Provider> getProvidersByCategory(
            @PathVariable Long categoryId
    ){

        return providerService.getProvidersByCategory(categoryId);

    }

}