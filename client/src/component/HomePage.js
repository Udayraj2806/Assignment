import React, { useEffect, useState } from "react";

import axios from "axios";
import { Bar } from "react-chartjs-2";
import { CDBContainer } from "cdbreact";
import Chart from "./Chart";

function HomePage() {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoadinig] = useState(true);
  const transactionsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTransaction, setSearchTransaction] = useState("");
  const [checkCurrentMonth,setCheckCurrentMonth]=useState(false)
  const startIndex = (currentPage - 1) * transactionsPerPage;
  const endIndex = startIndex + transactionsPerPage;
  const monthList = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const [currentMonth, setCurrentMonth] = useState("March");
  const [currentMonthTransactions, setCurrentMonthTransactions] = useState([]);
  const [
    currentMonthTransactionsStatistics,
    setCurrentMonthTransactionsStatistics,
  ] = useState([]);

  async function fetchData() {
    await axios
      .get("/getAllTransactions")
      .then((res) => {
        const allTransactions = res.data;
        setTransactions(allTransactions);
      })
      .catch((error) => {
        console.log("Something went wrong");
      });
  }

  function nextPage() {
    currentPage <= 5 && setCurrentPage(currentPage + 1);
  }

  function prevPage() {
    currentPage > 1 && setCurrentPage(currentPage - 1);
  }

  async function fetchStatistics() {
    await axios
      .post("/getStatistics", { month: currentMonth })
      .then((res) => {
        const responseData = res.data;
        setCurrentMonthTransactionsStatistics(res.data)
        let totalSale = 0;
        let totalSoldItem = 0;
        let totalNotSoldItem = 0;
        let tmpcurrentMonthTransactionsStatistics = [];

        responseData.forEach((currentMonthTransaction) => {
          totalSale = totalSale + currentMonthTransaction.price;
          if (currentMonthTransaction.sold) {
            totalSoldItem = totalSoldItem + 1;
          } else {
            totalNotSoldItem = totalNotSoldItem + 1;
          }
        });
        const currentMonthTransactionObject = {
          totalSale: totalSale,
          totalSoldItem: totalSoldItem,
          totalNotSoldItem: totalNotSoldItem,
        };
        tmpcurrentMonthTransactionsStatistics.push(
          currentMonthTransactionObject
        );
        setCurrentMonthTransactionsStatistics(
          tmpcurrentMonthTransactionsStatistics
        );
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function handleChangeInCurrentMonth(event) {
    setCurrentMonth(event.target.value);
    setCheckCurrentMonth(true);
    const currentTransactions = transactions.filter((transaction) => {
      const dateString = transaction.dateOfSale;
      const dateObject = new Date(dateString);
      const month = dateObject.getMonth();
      return currentMonth == monthList[month];
    });
    setCurrentMonthTransactions(currentTransactions);
    setCurrentPage(1);
  }
  function handleSearchTransaction(event) {
    setSearchTransaction(event.target.value.toLowerCase());
    setCheckCurrentMonth(false);
    const currentTransactions = transactions.slice(startIndex, endIndex);
    setCurrentMonthTransactions(currentTransactions);
  }
  useEffect(() => {
    fetchData();
    fetchStatistics();
    // setCurrentPage(1)
  }, [currentMonth]);

  return (
    <div
      className="container"
      style={{ paddingLeft: "10rem", paddingRight: "10rem" }}
    >
      <h1
        className="d-flex justify-content-center"
        style={{ paddingBottom: "5rem" }}
      >
        Transaction Board
      </h1>
      <div className="d-flex justify-content-between ">
        <div class="mb-3">
          <input
            type="text"
            class="form-control"
            id="exampleInputEmail1"
            aria-describedby="emailHelp"
            placeholder="Search transaction"
            onChange={handleSearchTransaction}
          />
        </div>
        <div className="dropdown ">
        
          <select
            className="dropdown-men"
            value={currentMonth}
            onChange={handleChangeInCurrentMonth}
          >
            {monthList.map((month) => {
              return <option class="dropdown-item">{month}</option>;
            })}
          </select>
          {/* {currentMonth} */}
        </div>
      </div>

      <table class="table">
        <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Title</th>
            <th scope="col">Description</th>
            <th scope="col">Price</th>
            <th scope="col">Category</th>
            <th scope="col">Sold</th>
            <th scope="col">Image</th>
          </tr>
        </thead>
        <tbody>
          {checkCurrentMonth?(currentMonthTransactions
            .filter((transaction) => {
              return searchTransaction.toLowerCase() == ""
                ? transaction
                : transaction.price
                    .toString()
                    .toLowerCase()
                    .includes(searchTransaction) ||
                    transaction.description
                      .toLowerCase()
                      .includes(searchTransaction) ||
                    transaction.title.toLowerCase().includes(searchTransaction);
            })
            .slice(startIndex, endIndex)
            .map((transaction) => {
              return (
                <tr>
                  <th scope="row">{transaction.id}</th>
                  {/* <td>{transaction.id}</td> */}
                  <td>{transaction.title}</td>
                  <td>{transaction.description}</td>
                  <td>{transaction.price}</td>
                  <td>{transaction.category}</td>
                  <td>{transaction.sold ? "YES" : "NO"}</td>
                  <td>
                    <img src={transaction.image} class="img-thumbnail"></img>
                  </td>
                </tr>
              );
            })):(transactions
            .filter((transaction) => {
              return searchTransaction.toLowerCase() == ""
                ? transaction
                : transaction.price
                    .toString()
                    .toLowerCase()
                    .includes(searchTransaction) ||
                    transaction.description
                      .toLowerCase()
                      .includes(searchTransaction) ||
                    transaction.title.toLowerCase().includes(searchTransaction);
            })
            .slice(startIndex, endIndex)
            .map((transaction) => {
              return (
                <tr>
                  <th scope="row">{transaction.id}</th>
                  {/* <td>{transaction.id}</td> */}
                  <td>{transaction.title}</td>
                  <td>{transaction.description}</td>
                  <td>{transaction.price}</td>
                  <td>{transaction.category}</td>
                  <td>{transaction.sold ? "YES" : "NO"}</td>
                  <td>
                    <img src={transaction.image} class="img-thumbnail"></img>
                  </td>
                </tr>
              );
            }))}
        </tbody>
      </table>

      <div className="d-flex justify-content-between">
        <p>Page No : {currentPage}</p>

        <button className="btn btn-warning" onClick={prevPage}>
          Previous
        </button>
        <span>-</span>
        <button className="btn btn-warning" onClick={nextPage}>
          Next
        </button>
        <p>Per Page : 10</p>
        <br></br>
        <br></br>
        <br></br>
      </div>

      <div>
        <h1
          className=" mt-5 container d-flex justify-content-center"
          style={{ paddingTop: "5rem" }}
        >
          Statistics - {currentMonth}
        </h1>
        <div className="container d-flex justify-content-center">
          {currentMonthTransactionsStatistics.map((currentMonthTransaction) => {
            return (
              <div className="">
                <div className="col">
                  <p className="row">
                    {" "}
                    Total sale: {currentMonthTransaction.totalSale}
                  </p>
                  <p className="row">
                    {" "}
                    Total sole item: {currentMonthTransaction.totalSoldItem}
                  </p>
                  <p className="row">
                    Total not sole item:{" "}
                    {currentMonthTransaction.totalNotSoldItem}
                  </p>
                </div>

                {/* Total sale:<p>{currentMonthTransaction.totalSale}</p>
                    Total sole item<p>{currentMonthTransaction.totalSoldItem}</p> */}

                {/* Total not sole item<p>{currentMonthTransaction.totalNotSoldItem}</p> */}
              </div>
            );
          })}
        </div>
      </div>

      <Chart month={currentMonth}></Chart>
    </div>
  );
}

export default HomePage;
