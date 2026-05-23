let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

let salary = localStorage.getItem("salary") || 0;

const balance = document.getElementById("balance");

const income = document.getElementById("income");

const expense = document.getElementById("expense");

const salaryDisplay = document.getElementById("salaryDisplay");

const transactionList = document.getElementById("transactionList");

const themeBtn = document.getElementById("themeBtn");

/* LOAD THEME */

if(localStorage.getItem("theme") === "light"){

  document.body.classList.add("light-mode");

  themeBtn.innerHTML = "☀️ Light Mode";

}

salaryDisplay.innerText = `₹${salary}`;

/* SET SALARY */

function setSalary(){

  const salaryInput = document.getElementById("salaryInput").value;

  salary = salaryInput;

  localStorage.setItem("salary", salary);

  salaryDisplay.innerText = `₹${salary}`;

  updateValues();

}

/* ADD TRANSACTION */

function addTransaction(type){

  const text = document.getElementById("text").value;

  const amount = document.getElementById("amount").value;

  const date = document.getElementById("date").value;

  const category = document.getElementById("category").value;

  if(text === "" || amount === "" || date === ""){

    alert("Please fill all fields");

    return;

  }

  const transaction = {

    id: Date.now(),

    text,

    amount: Number(amount),

    date,

    category,

    type

  };

  transactions.push(transaction);

  localStorage.setItem(
    "transactions",
    JSON.stringify(transactions)
  );

  showTransactions();

  updateValues();

  updateChart();

  clearFields();

}

/* SHOW TRANSACTIONS */

function showTransactions(){

  transactionList.innerHTML = "";

  transactions.slice().reverse().forEach(transaction => {

    const li = document.createElement("li");

    li.classList.add("transaction");

    li.innerHTML = `

      <div>

        <h4>${transaction.text}</h4>

        <p>${transaction.category} | ${transaction.date}</p>

      </div>

      <div>

        <strong>

          ${transaction.type === "income" ? "+" : "-"} ₹${transaction.amount}

        </strong>

        <button onclick="deleteTransaction(${transaction.id})">
          Delete
        </button>

      </div>

    `;

    transactionList.appendChild(li);

  });

}

/* DELETE */

function deleteTransaction(id){

  transactions = transactions.filter(

    transaction => transaction.id !== id

  );

  localStorage.setItem(
    "transactions",
    JSON.stringify(transactions)
  );

  showTransactions();

  updateValues();

  updateChart();

}

/* UPDATE VALUES */

function updateValues(){

  let incomeAmount = 0;

  let expenseAmount = 0;

  transactions.forEach(transaction => {

    if(transaction.type === "income"){

      incomeAmount += transaction.amount;

    }

    else{

      expenseAmount += transaction.amount;

    }

  });

  income.innerText = `₹${incomeAmount}`;

  expense.innerText = `₹${expenseAmount}`;

  balance.innerText =
    `₹${Number(salary) + incomeAmount - expenseAmount}`;

}

/* CLEAR FIELDS */

function clearFields(){

  document.getElementById("text").value = "";

  document.getElementById("amount").value = "";

  document.getElementById("date").value = "";

}

/* CHART */

const ctx = document.getElementById("expenseChart");

const expenseChart = new Chart(ctx, {

  type: "doughnut",

  data: {

    labels: ["Income", "Expense"],

    datasets: [{

      data: [0,0],

      backgroundColor: [

        "#22c55e",

        "#ef4444"

      ],

      borderWidth: 0

    }]

  },

  options: {

    responsive: true

  }

});

/* UPDATE CHART */

function updateChart(){

  let incomeAmount = 0;

  let expenseAmount = 0;

  transactions.forEach(transaction => {

    if(transaction.type === "income"){

      incomeAmount += transaction.amount;

    }

    else{

      expenseAmount += transaction.amount;

    }

  });

  expenseChart.data.datasets[0].data = [

    incomeAmount,

    expenseAmount

  ];

  expenseChart.update();

}

/* DARK MODE / LIGHT MODE */

function toggleTheme(){

  document.body.classList.toggle("light-mode");

  if(document.body.classList.contains("light-mode")){

    localStorage.setItem("theme","light");

    themeBtn.innerHTML = "☀️ Light Mode";

  }

  else{

    localStorage.setItem("theme","dark");

    themeBtn.innerHTML = "🌙 Dark Mode";

  }

}

/* LOAD */

showTransactions();

updateValues();

updateChart();