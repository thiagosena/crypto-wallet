from datetime import datetime

from flask import Flask, request, jsonify
from flask_cors import CORS
from psycopg2 import pool

from logic import format_db_row_to_transaction

app = Flask(__name__)
cors = CORS(app)

postgreSQL_pool = pool.SimpleConnectionPool(
    1, 1000, database="db_crypto", user="postgres", password="admin", host="127.0.0.1"
)

app.config['postgreSQL_pool'] = postgreSQL_pool


@app.route("/")
def health_check():
    return {"status": "I am healthy"}


@app.route("/transactions", methods=["POST"])
def new_transaction():
    name = request.json["name"]
    symbol = request.json["symbol"]
    transaction_type = request.json["type"]

    time_transacted = datetime.fromtimestamp(request.json["time_transacted"])

    price_purchased_at = float(request.json["price_purchased_at"])
    no_of_coins = float(request.json["no_of_coins"])

    amount = price_purchased_at * no_of_coins

    conn = postgreSQL_pool.getconn()
    cur = conn.cursor()

    insert_statement = f"INSERT INTO transaction " \
                       f"(" \
                       f"   name, " \
                       f"   symbol, " \
                       f"   type, " \
                       f"   amount, " \
                       f"   time_transacted, " \
                       f"   time_created, " \
                       f"   price_purchased_at, " \
                       f"   no_of_coins) " \
                       f"VALUES (" \
                       f"   '{name}', " \
                       f"   '{symbol}', " \
                       f"   '{transaction_type}', " \
                       f"   {amount}, " \
                       f"   '{time_transacted}', " \
                       f"   now() at time zone " \
                       f"   'UTC', " \
                       f"   {price_purchased_at}, " \
                       f"   {no_of_coins})"
    cur.execute(insert_statement)
    conn.commit()

    return jsonify(request.json)


@app.route("/transactions")
def get_transactions():
    cur = postgreSQL_pool.getconn().cursor()
    cur.execute('SELECT * FROM transaction')
    rows = cur.fetchall()

    return jsonify(
        [
            format_db_row_to_transaction(row) for row in rows
        ]
    )


if __name__ == '__main__':
    app.run(debug=True, port=5000)
