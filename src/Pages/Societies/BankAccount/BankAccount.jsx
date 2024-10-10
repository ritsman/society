import  { Link } from "react-router-dom"

const BankAccount = () => {
    return (
      <div className="flex justify-evenly ">
        <Link to="payment">
          <button className="border-2 rounded-md px-2 py-2">Payment Page</button>
        </Link>
        <Link to="payTransaction">
          <button className="border-2 rounded-md px-2 py-2">Transaction List</button>
        </Link>
      </div>
    );
}
 
export default BankAccount;