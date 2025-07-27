package com.teamsync.backend;// JwtKeyGenerator.java (一時的に実行するためのクラス)
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.io.Encoders; // Base64エンコード用
import java.security.Key;

public class JwtKeyGenerator {
    public static void main(String[] args) {
        // HS256 (HMAC-SHA256) アルゴリズム用の安全な鍵を生成
        // HS256は256ビット (32バイト) 以上のキーを要求します
        Key key = Keys.secretKeyFor(SignatureAlgorithm.HS256);

        // 生成された鍵のバイト配列をBase64エンコードして文字列として取得
        String base64EncodedKey = Encoders.BASE64.encode(key.getEncoded());
        System.out.println("Generated Base64 Encoded Key for HS256: " + base64EncodedKey);
    }
}