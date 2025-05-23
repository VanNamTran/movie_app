import org.apache.http.NameValuePair;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.CloseableHttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClients;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.util.EntityUtils;

import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.*;

@RestController
@RequestMapping("/api/payment")
public class ZaloPayController {

    @Autowired
    private ZaloPayConfig zaloPayConfig;

    @PostMapping("/zalopay")
    public Map<String, Object> createZaloPayOrder(@RequestBody Map<String, Object> payload) {
        try (CloseableHttpClient httpClient = HttpClients.createDefault()) {
            Random rnd = new Random();
            String app_trans_id = new SimpleDateFormat("yyMMdd").format(new Date()) + "_" + (rnd.nextInt(1000000));
            long app_time = System.currentTimeMillis();

            // Lấy dữ liệu từ payload
            String app_user = (String) payload.get("userId");
            Integer amountObj = (Integer) payload.get("amount");
            String description = (String) payload.get("description");

            if (app_user == null || amountObj == null || description == null) {
                return Map.of("status", "error", "message", "Missing required fields: userId, amount, description");
            }

            long amount = amountObj;

            String embed_data = "{\"preferred_payment_method\":[\"international_card\"],\"redirecturl\":\"http://localhost:5173/payment-result?paymentMethod=zalopay\"}";
            String item = "[]";

            // Tạo chuỗi dữ liệu cho MAC theo đúng thứ tự
            String data = String.join("|",
                    zaloPayConfig.appId,
                    app_trans_id,
                    app_user,
                    String.valueOf(amount),
                    String.valueOf(app_time),
                    embed_data,
                    item
            );

            // Tính mac bằng HMAC SHA256
            String mac = HMACUtil.HMacHexStringEncode(HMACUtil.HMACSHA256, zaloPayConfig.key1, data);

            // Tạo danh sách params gửi theo form-urlencoded
            List<NameValuePair> params = new ArrayList<>();
            params.add(new BasicNameValuePair("app_id", zaloPayConfig.appId));
            params.add(new BasicNameValuePair("app_trans_id", app_trans_id));
            params.add(new BasicNameValuePair("app_user", app_user));
            params.add(new BasicNameValuePair("app_time", String.valueOf(app_time)));
            params.add(new BasicNameValuePair("amount", String.valueOf(amount)));
            params.add(new BasicNameValuePair("embed_data", embed_data));
            params.add(new BasicNameValuePair("item", item));
            params.add(new BasicNameValuePair("description", description));
            params.add(new BasicNameValuePair("bank_code", ""));
            params.add(new BasicNameValuePair("callback_url", zaloPayConfig.callbackUrl));
            params.add(new BasicNameValuePair("mac", mac));

            HttpPost post = new HttpPost(zaloPayConfig.endpoint);
            post.setEntity(new UrlEncodedFormEntity(params, StandardCharsets.UTF_8));
            post.setHeader("Content-Type", "application/x-www-form-urlencoded");
            post.setHeader("User-Agent", "Mozilla/5.0");

            try (CloseableHttpResponse response = httpClient.execute(post)) {
                String responseBody = EntityUtils.toString(response.getEntity(), StandardCharsets.UTF_8);
                return Map.of("status", "success", "data", responseBody);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return Map.of("status", "error", "message", e.getMessage());
        }
    }

     @GetMapping("/test")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("Test API is working!");
    }
}
