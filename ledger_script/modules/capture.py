import mysql.connector
connection = mysql.connector.connect(
   host='107.172.143.121',
   user='root',
   password='Erfnhd123890%',
   database='kotakcantik',
   port=8806
)

import struct

cursor = connection.cursor()
cursor.execute("SHOW BINARY LOGS")
transaction_logs = cursor.fetchall()

for log in transaction_logs:
   print(log)
cursor.close()
connection.close()

log_files = [
   'binlog.000001',
   'binlog.000002',
   'binlog.000003',
   'binlog.000004',
   'binlog.000005',
   'binlog.000006',
   'binlog.000007',
   'binlog.000008'
]

raw_command = """
mysqlbinlog binlog.000002 --read-from-remote-server --host=107.172.143.121 --port=8806 --user root --password --database kotakcantik --raw --result-file=binlog.000002
"""

remote_decoded_command = """
mysqlbinlog binlog.000002 --read-from-remote-server --host=107.172.143.121 --port=8806 --user root --password --database kotakcantik --base64-output=DECODE-ROWS --verbose > binlog.000002.decoded.txt
"""

local_decoded_command = """
mysqlbinlog binlog.000002 --base64-output=DECODE-ROWS --verbose > binlog.000002.decoded.txt
"""