package com.group29.distromentorsystem.services.login;

import java.util.Map;

public interface SignInService {
    Map<String, Object> findEntityInfoById(String userId);

    Map<String, Object> findEntityInfoById(Map<String, String> loginData);

}

