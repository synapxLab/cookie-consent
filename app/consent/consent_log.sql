CREATE TABLE IF NOT EXISTS consent_log (
  id            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  consent_id    VARCHAR(64)     NOT NULL,         -- UUID client pour tracer un événement unique
  ts            DATETIME        NOT NULL,         -- date/heure du consentement
  site_host     VARCHAR(255)    NOT NULL,
  locale        VARCHAR(32)     NOT NULL,
  banner_version VARCHAR(32)    DEFAULT NULL,
  policy_version VARCHAR(32)    NOT NULL,         -- version de la politique au moment du consentement
  policy_url    VARCHAR(512)    DEFAULT NULL,     -- URL de la politique
  policy_hash   VARCHAR(128)    DEFAULT NULL,     -- SHA-256 de la politique (texte ou URL), optionnel
  device_id     VARCHAR(64)     NOT NULL,         -- identifiant anonyme côté client
  referrer      VARCHAR(512)    DEFAULT NULL,
  user_agent    VARCHAR(512)    DEFAULT NULL,
  ip_addr       VARBINARY(16)   DEFAULT NULL,     -- si tu veux minimiser: stocke en INET6_ATON, ou hash
  categories    JSON            NOT NULL,         -- {cookies:true, statistics:false, ...}
  created_at    TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_consent_id (consent_id),
  KEY idx_ts (ts),
  KEY idx_device_ts (device_id, ts),
  KEY idx_host_ts (site_host, ts)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;
