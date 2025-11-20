from sqlalchemy import Column, BigInteger, Text, Date, Float, TIMESTAMP
from app.database import BaseAI2


class Transaction(BaseAI2):
    """Transaction model for AI2 database"""
    __tablename__ = "transactions"

    id = Column(BigInteger, primary_key=True)
    vt = Column(Text)
    ver_datum = Column(Date)
    ver_nr = Column(BigInteger)
    fakturanr = Column(Text)
    resk_nr = Column(BigInteger)
    resk_nr_t = Column(Text)
    konto = Column(BigInteger)
    f = Column(BigInteger)
    f_t = Column(Text)
    kst = Column(BigInteger)
    kst_t = Column(Text)
    projekt = Column(BigInteger)
    projekt_t = Column(Text)
    belopp = Column(Float)
    imported_at = Column(TIMESTAMP)
