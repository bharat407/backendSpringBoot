package com.task.task1;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotEmpty;

public record RegisterRequest(
        @NotEmpty String name,
        @NotEmpty @Email String email,
        @NotEmpty String phone,
        @NotEmpty String password
) {}