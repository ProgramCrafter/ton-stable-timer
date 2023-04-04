from rift import *

# You can import from contracts here
from contracts.bare_template import BaseContract


def test_example():
    data = Cell()
    # We create an instance of contract here with data cell
    wallet = BaseContract.instantiate(data)
    # We can call all the contract methods by passing arguments to it
    res = wallet.recv_internal(0, 0, Cell(), Cell().parse())
    # We can then check the result of test execution
    res.expect_ok()
