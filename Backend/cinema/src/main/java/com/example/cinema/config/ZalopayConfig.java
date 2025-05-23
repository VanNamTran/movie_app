package com.example.cinema.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ZaloPayConfig {
    @Value("${zalopay.app_id}")
    public String appId;

    @Value("${zalopay.key1}")
    public String key1;

    @Value("${zalopay.key2}")
    public String key2;

    @Value("${zalopay.endpoint}")
    public String endpoint;

    @Value("${zalopay.callback_url}")
    public String callbackUrl;
}
