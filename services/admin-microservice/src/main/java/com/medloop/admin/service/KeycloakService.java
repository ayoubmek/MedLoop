package com.medloop.admin.service;

import com.medloop.admin.dto.KeycloakUserRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
@RequiredArgsConstructor
public class KeycloakService {

    private final RestTemplate restTemplate;

    @Value("${keycloak.base-url:http://keycloak:8080}")
    private String keycloakBaseUrl;

    @Value("${keycloak.realm:medloop}")
    private String realm;

    @Value("${keycloak.admin.username:admin}")
    private String adminUsername;

    @Value("${keycloak.admin.password:admin123}")
    private String adminPassword;

    @Value("${keycloak.admin.realm:master}")
    private String adminRealm;

    private String getAdminAccessToken() {
        String tokenUrl = String.format("%s/realms/%s/protocol/openid-connect/token", keycloakBaseUrl, adminRealm);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        String body = "grant_type=password&client_id=admin-cli&username=" + adminUsername + "&password=" + adminPassword;

        HttpEntity<String> request = new HttpEntity<>(body, headers);
        try {
            ResponseEntity<Map> resp = restTemplate.postForEntity(tokenUrl, request, Map.class);
            if (resp.getStatusCode().is2xxSuccessful() && resp.getBody() != null) {
                return (String) resp.getBody().get("access_token");
            }
        } catch (HttpClientErrorException e) {
            throw new RuntimeException("Failed to obtain Keycloak token: " + e.getResponseBodyAsString(), e);
        }
        throw new RuntimeException("Failed to obtain Keycloak token");
    }

    public String createUser(KeycloakUserRequest req) {
        String token = getAdminAccessToken();
        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(token);
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, Object> payload = new HashMap<>();
        payload.put("username", req.getUsername());
        payload.put("email", req.getEmail());
        payload.put("enabled", true);

        Map<String, Object> cred = new HashMap<>();
        cred.put("type", "password");
        cred.put("value", req.getPassword());
        cred.put("temporary", false);
        payload.put("credentials", Collections.singletonList(cred));

        String createUrl = String.format("%s/admin/realms/%s/users", keycloakBaseUrl, realm);
        HttpEntity<Map<String, Object>> createReq = new HttpEntity<>(payload, headers);

        ResponseEntity<Void> createResp = restTemplate.postForEntity(createUrl, createReq, Void.class);
        if (createResp.getStatusCode() == HttpStatus.CREATED) {
            // Location header contains path with new user id
            String location = createResp.getHeaders().getLocation().toString();
            String id = location.substring(location.lastIndexOf('/') + 1);

            // assign roles if provided
            if (req.getRoles() != null && !req.getRoles().isEmpty()) {
                assignRealmRoles(id, req.getRoles(), headers);
            }
            return id;
        } else if (createResp.getStatusCode().is2xxSuccessful()) {
            return "";
        } else {
            throw new RuntimeException("Failed to create Keycloak user: " + createResp.getStatusCode());
        }
    }

    private void assignRealmRoles(String userId, List<String> roles, HttpHeaders baseHeaders) {
        for (String roleName : roles) {
            try {
                String roleUrl = String.format("%s/admin/realms/%s/roles/%s", keycloakBaseUrl, realm, roleName);
                HttpEntity<Void> req = new HttpEntity<>(baseHeaders);
                ResponseEntity<Map> roleResp = restTemplate.exchange(roleUrl, HttpMethod.GET, req, Map.class);
                Map role = roleResp.getBody();

                if (role != null) {
                    List<Map<String, Object>> rolesToAdd = new ArrayList<>();
                    Map<String, Object> rep = new HashMap<>();
                    rep.put("id", role.get("id"));
                    rep.put("name", role.get("name"));
                    rolesToAdd.add(rep);

                    String assignUrl = String.format("%s/admin/realms/%s/users/%s/role-mappings/realm", keycloakBaseUrl, realm, userId);
                    HttpEntity<List<Map<String, Object>>> assignReq = new HttpEntity<>(rolesToAdd, baseHeaders);
                    restTemplate.postForEntity(assignUrl, assignReq, Void.class);
                }
            } catch (Exception e) {
                // log and continue
                // In this simplified implementation we rethrow to surface errors
                throw new RuntimeException("Failed to assign role " + roleName + ": " + e.getMessage(), e);
            }
        }
    }
}
