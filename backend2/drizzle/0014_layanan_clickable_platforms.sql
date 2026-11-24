ALTER TABLE `layanan_terpadu` ADD `is_clickable` integer DEFAULT true NOT NULL;
UPDATE `layanan_terpadu`
SET `platform` = CASE
  WHEN lower(`platform`) = 'website' THEN 'external'
  WHEN lower(`platform`) = 'mobile' AND lower(`url`) NOT LIKE 'http://%' AND lower(`url`) NOT LIKE 'https://%' THEN 'deeplink'
  ELSE 'external'
END
WHERE lower(`platform`) NOT IN ('internal', 'external', 'android', 'ios', 'deeplink', 'download');
