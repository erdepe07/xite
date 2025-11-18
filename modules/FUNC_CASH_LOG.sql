CREATE DEFINER=`root`@`localhost` 
FUNCTION `cashlog`(`datetime` TIMESTAMP, `flow` VARCHAR(100), `amount` INT(21), `source` VARCHAR(100)) 
RETURNS boolean

BEGIN

	IF KONDISI = 0 THEN

		RETURN (SELECT (SUM(TOTALKREDIT) - (SELECT SUM(BAYAR) - SUM(POTONGAN) FROM aciraba_kotakcantik.01_tms_piutangkredit WHERE MEMBER_ID = KODEMEMBER)) FROM aciraba_kotakcantik.01_tms_piutangkredit WHERE MEMBER_ID = KODEMEMBER AND `NOTRANSAKSI` = '0');

    END IF;

    IF flow = 0 then 
        RETURN (INSERT INTO aciraba_kotakcantik.01_tms_cashlog (datetime, flow, amount, source) VALUES (datetime, 'MASUK', amount, source));

END