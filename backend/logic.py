from dataclasses import dataclass
from datetime import datetime
from decimal import Decimal
from enum import Enum

LIVE_PRICE_URL = 'https://api.coingecko.com/api/v3/simple/price'


class TransactionType(Enum):
    SOLD = 0
    BOUGHT = 1


@dataclass(frozen=True)
class Transaction:
    id: int
    name: str
    symbol: str
    type: int
    amount: Decimal
    time_transacted: datetime
    time_created: datetime
    price_purchased_at: Decimal
    no_of_coins: Decimal


def format_db_row_to_transaction(row):
    return Transaction(
        id=row[0],
        name=row[1],
        symbol=row[2],
        type=row[3],
        amount=Decimal(row[4]),
        time_transacted=row[5].strftime("%Y/%m/%d"),
        time_created=row[6].strftime("%Y/%m/%d"),
        price_purchased_at=Decimal(row[7]),
        no_of_coins=Decimal(row[8]),
    )
