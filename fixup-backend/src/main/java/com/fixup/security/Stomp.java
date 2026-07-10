package com.fixup.security;

import java.security.Principal;

public class Stomp implements Principal {

    private final String name;

    public Stomp(String name) {
        this.name = name;
    }

    @Override
    public String getName() {
        return name;
    }
}