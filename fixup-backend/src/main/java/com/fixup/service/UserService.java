package com.fixup.service;

import org.springframework.stereotype.Service;

import com.fixup.model.User;
import com.fixup.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public User updateUserStatus(Long userId, User.UserStatus newStatus) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        user.setStatus(newStatus);
        return userRepository.save(user);
    }

}
