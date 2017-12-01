SELECT * FROM (SELECT
concat(concat("S", ' - '), "E") ICD_RANGES,
"CATEGORY",
d1id,
d1d,
d2id,
d2d,
counts,
ROW_NUMBER() OVER (PARTITION BY concat(concat("S", ' - '), "E") ORDER BY counts DESC) AS rn
 FROM "TUKGRP1"."ICD9_RANGES"
 INNER JOIN (
    SELECT
    DIAG1."ICD9Code" d1id,
    DIAG1."DiagnosisDescription" d1d,
    DIAG2."ICD9Code" d2id,
    DIAG2."DiagnosisDescription" d2d,
    count(DIAG2."PatientGuid") counts
     FROM "TUKGRP1"."DIAGNOSIS" AS DIAG1
     INNER JOIN "TUKGRP1"."DIAGNOSIS" AS DIAG2
     ON DIAG1."PatientGuid" = DIAG2."PatientGuid"
     AND DIAG1."StartYear" = DIAG2."StartYear"
     AND DIAG1."ICD9Code" < DIAG2."ICD9Code"
     GROUP BY DIAG1."ICD9Code",
    DIAG1."DiagnosisDescription",
    DIAG2."ICD9Code",
    DIAG2."DiagnosisDescription")
 ON d1id BETWEEN "S" AND "E"
 AND d2id BETWEEN "S" AND "E")
 WHERE rn = 1
 ORDER BY ICD_RANGES;
