from collections import defaultdict
from datetime import datetime
from decimal import Decimal

import requests
from flask import Flask, request, jsonify
from flask_cors import CORS
from psycopg2 import pool

from logic import format_db_row_to_transaction, LIVE_PRICE_URL, TransactionType

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


@app.route("/rollups")
def get_rollups_by_coin():
    portfolio = defaultdict(
        lambda: {
            "total_coins": 0,
            "total_cost": Decimal(0.0),
            "total_equity": Decimal(0.0),
            "live_price": Decimal(0.0)
        }
    )

    conn = postgreSQL_pool.getconn()
    cur = conn.cursor()
    cur.execute(
        "SELECT symbol, type, sum(amount) as total_amount, sum(no_of_coins) as total_coins "
        "FROM transaction GROUP BY symbol, type"
    )
    rows = cur.fetchall()

    for row in rows:
        coin = row[0]
        transaction_type = row[1]
        amount = row[2]
        total_coins = row[3]

        if transaction_type == TransactionType.BOUGHT.value:
            portfolio[coin]['total_cost'] += amount
            portfolio[coin]['total_coins'] += total_coins
        else:
            portfolio[coin]['total_cost'] -= amount
            portfolio[coin]['total_coins'] -= total_coins

    symbol_to_coin_id_map = {
        "BTC": "bitcoin",
        "SOL": "solana",
        "LINK": "chainlink",
        "ETH": "ethereum",
        "ADA": "cardano",
        "MANA": "decentraland"
    }
    rollup_response = []

    for symbol in portfolio:
        response = requests.get(f"{LIVE_PRICE_URL}?ids={symbol_to_coin_id_map[symbol]}&vs_currencies=usd").json()

        live_price = response[symbol_to_coin_id_map[symbol]]['usd']
        portfolio[symbol]['live_price'] = live_price
        portfolio[symbol]['total_equity'] = portfolio[symbol]['total_coins'] * live_price

        rollup_response.append({
            "symbol": symbol,
            "live_price": portfolio[symbol]['live_price'],
            "total_coins": portfolio[symbol]['total_coins'],
            "total_cost": float(portfolio[symbol]['total_cost']),
            "total_equity": portfolio[symbol]['total_equity'],
        })

    return jsonify(rollup_response)


if __name__ == '__main__':
    app.run(debug=True, port=5000)
