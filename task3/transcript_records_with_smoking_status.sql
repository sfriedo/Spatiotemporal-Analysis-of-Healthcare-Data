/* Select transcript records along with latest smoking status for each */
SELECT *
FROM (
   SELECT
    /*t."TranscriptGuid", p."PatientGuid",*/
    p."Gender", p."State",
    (t."VisitYear" - p."YearOfBirth") AS "PatientAge",
    t."RespiratoryRate",
    ROUND(CAST(t."Height" AS FLOAT), 3) AS "Height",
    ROUND(CAST(t."Weight" AS FLOAT), 3) AS "Weight",
    ROUND(CAST(t."BMI" AS FLOAT), 3) AS "BMI",
    ROUND(CAST(t."Temperature" AS FLOAT), 2) "Temperature",
    t2."SmokingStatusGuid" as "LastSmokingStatus",
    t."SystolicBP", t."DiastolicBP",
     ROW_NUMBER() OVER (
       PARTITION BY t."TranscriptGuid"
       ORDER BY (t."VisitYear" - t2."EffectiveYear") ASC
     ) AS "RowId"
   FROM TRANSCRIPT t
   JOIN PATIENT p
     ON p."PatientGuid" = t."PatientGuid"
    CROSS JOIN
     (
       SELECT
         pss."PatientGuid",
         pss."EffectiveYear",
         ss."SmokingStatusGuid"
       FROM PATIENTSMOKINGSTATUS pss
         JOIN SMOKINGSTATUS ss
           ON ss."SmokingStatusGuid" = pss."SmokingStatusGuid"
       WHERE
         /* Only retrieve smoking status that is not unknown */
         ss."NISTcode" NOT IN (5, 9)
     ) t2
   WHERE
     t2."PatientGuid" = t."PatientGuid"
    AND
      /* Make sure not to select future smoking status records */
      /* Note that zero values in t."VisitYear" are eliminated too */
     (t."VisitYear" - t2."EffectiveYear") >= 0
    AND
      t."SystolicBP" >= 60 AND t."SystolicBP" <= 230
    AND
      t."DiastolicBP" >= 30 AND t."DiastolicBP" <= 140
    AND
      t."BMI" >= 9 AND t."BMI" <= 62
    AND
      t."Temperature" >= 55 AND t."Temperature" <= 120
    AND
      t."RespiratoryRate" >= 5 AND t."RespiratoryRate" <= 50
 )
WHERE "RowId" = 1;