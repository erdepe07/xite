from pymysqlreplication import BinLogStreamReader
from pymysqlreplication.row_event import WriteRowsEvent, UpdateRowsEvent, DeleteRowsEvent
from pymysqlreplication.event import QueryEvent
import json

# Create listener event to mysql live binlog
MYSQL_SETTINGS = {
   'host': '107.172.143.121',
   'user': 'root',
   'password': 'Erfnhd123890%',
   'database': 'kotakcantik',
   'port': 8806
}

def main():
    stream = BinLogStreamReader(
        connection_settings=MYSQL_SETTINGS,
        server_id=100,                 # any unique ID
        blocking=True,
        only_events=[WriteRowsEvent, UpdateRowsEvent, DeleteRowsEvent, QueryEvent]
    )

    print("Listening to MySQL transaction log...")

    for binlogevent in stream:
        table = "{}.{}".format(binlogevent.schema, binlogevent.table) if not isinstance(binlogevent, QueryEvent) else binlogevent

        if isinstance(binlogevent, WriteRowsEvent):
            for row in binlogevent.rows:
                print("[INSERT] on", table)
                print(json.dumps(row["values"], default=str, indent=2))

        elif isinstance(binlogevent, UpdateRowsEvent):
            for row in binlogevent.rows:
                print("[UPDATE] on", table)
                print("Before:", json.dumps(row["before_values"], default=str, indent=2))
                print("After :", json.dumps(row["after_values"], default=str, indent=2))

        elif isinstance(binlogevent, DeleteRowsEvent):
            for row in binlogevent.rows:
                print("[DELETE] on", table)
                print(json.dumps(row["values"], default=str, indent=2))

        else:  # QueryEvent
            if binlogevent.query.strip().upper().startswith("SELECT"):
                print("[SELECT]")
                print(json.dumps(row["values"], default=str, indent=2))

    stream.close()

if __name__ == "__main__":
    main()