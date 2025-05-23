package com.example.cinema.controller;

import com.example.cinema.config.ZaloPayConfig;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.net.HttpURLConnection;
import java.net.URL;
import java.io.OutputStream;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.*;

@RestController
@RequestMapping("/api/payment")
public class PaymentController {

    @Autowired
    private ZaloPayConfig zaloPayConfig;

    @PostMapping("/create-order")
    public ResponseEntity<?> createOrder(@RequestParam long amount) {
        try {
            String app_id = zaloPayConfig.getAppId();
            String key1 = zaloPayConfig.getKey1();
            String endpoint = zaloPayConfig.getEndpoint();

            String app_trans_id = new java.text.SimpleDateFormat("yyMMddHHmmss").format(new Date()) + "_" + new Random().nextInt(1000000);
            String app_user = "demo_user";
            long app_time = System.currentTimeMillis();
            String embed_data = "{}";
            String item = "[]";
            String description = "Thanh toán đơn hàng #" + app_trans_id;

            // Tạo chuỗi data theo định dạng ZaloPay yêu cầu
            String data = app_id + "|" + app_trans_id + "|" + app_user + "|" + amount + "|" + app_time + "|" + embed_data + "|" + item;
            String mac = hmacSHA256(key1, data);

            // Log để debug nếu cần
            System.out.println("Data: " + data);
            System.out.println("MAC: " + mac);

            // Tạo JSON request
            JSONObject json = new JSONObject();
            json.put("app_id", app_id);
            json.put("app_trans_id", app_trans_id);
            json.put("app_user", app_user);
            json.put("app_time", app_time);
            json.put("amount", amount);
            json.put("item", item);
            json.put("description", description);
            json.put("embed_data", embed_data);
            json.put("mac", mac);

            // Gửi HTTP POST đến ZaloPay
            URL url = new URL(endpoint);
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setDoOutput(true);
            conn.setRequestMethod("POST");
            conn.setRequestProperty("Content-Type", "application/x-www-form-urlencoded");

            String postData = "data=" + json.toString();
            System.out.println("Post Data: " + postData);

            OutputStream os = conn.getOutputStream();
            os.write(postData.getBytes(StandardCharsets.UTF_8));
            os.flush();

            // Đọc phản hồi
            InputStream is = conn.getInputStream();
            Scanner scanner = new Scanner(is, "UTF-8").useDelimiter("\\A");
            String response = scanner.hasNext() ? scanner.next() : "";

            System.out.println("ZaloPay Response: " + response);

            JSONObject responseObject = new JSONObject(response);
            return ResponseEntity.ok(responseObject.toMap());

        } catch (Exception e) {
            e.printStackTrace();

            return ResponseEntity.status(500).body(Collections.singletonMap("error", e.getMessage()));
        }
    }

    private String hmacSHA256(String key, String data) throws Exception {
        SecretKeySpec secretKeySpec = new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
        Mac mac = Mac.getInstance("HmacSHA256");
        mac.init(secretKeySpec);
        byte[] bytes = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
        StringBuilder hash = new StringBuilder();
        for (byte b : bytes) {
            hash.append(String.format("%02x", b));
        }
        return hash.toString();
    }
}
