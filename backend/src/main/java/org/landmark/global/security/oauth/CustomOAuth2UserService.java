package org.landmark.global.security.oauth;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.landmark.domain.user.domain.AuthProvider;
import org.landmark.domain.user.domain.User;
import org.landmark.domain.user.repository.UserRepository;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(userRequest);
        Map<String, Object> attributes = oAuth2User.getAttributes();

        String providerId = (String) attributes.get("sub");
        String email = (String) attributes.get("email");
        String name = (String) attributes.get("name");
        String profileImageUrl = (String) attributes.get("picture");

        User user = userRepository.findByProviderAndProviderId(AuthProvider.GOOGLE, providerId)
                .map(existingUser -> {
                    existingUser.updateGoogleInfo(name, profileImageUrl);
                    return userRepository.save(existingUser);
                })
                .orElseGet(() -> {
                    log.info("새로운 Google 사용자 등록: {}", email);
                    User newUser = User.createGoogleUser(email, name, profileImageUrl, providerId);
                    return userRepository.save(newUser);
                });

        return new CustomOAuth2User(user, attributes);
    }
}
