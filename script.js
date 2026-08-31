const expensename = document.querySelector("#expense-name");
const amount = document.querySelector("#amount");
const category = document.querySelector("#category");
const date = document.getElementById("date");

const expense_btn = document.querySelector("#add-expense");
const expenseList = document.querySelector("#expense-list");
const filterCategory = document.querySelector("#categoryy");
const totalExpense = document.querySelector("#total-expense");

let editing = null;
let total = 0;
let expenses = [];


// =========================
// LOAD SAVED EXPENSES
// =========================

const savedExpenses=localStorage.getItem('expenses')

if (savedExpenses) {
    expenses = JSON.parse(savedExpenses);
}


// =========================
// CALCULATE TOTAL
// =========================

expenses.forEach((expense) => {
    total = total + Number(expense.amount);
});

totalExpense.textContent = total;


// =========================
// ADD / UPDATE BUTTON
// =========================

expense_btn.addEventListener("click", () => {

    const namee = expensename.value.trim();
    const amountis = amount.value;
    const catg = category.value;
    const datee = date.value;


   
    if (
        namee === "" ||  amountis === "" || catg === "" || datee === "" || isNaN(Number(amountis))) {
        return;
    }


    const newAmount = Number(amountis);


    // =================================================
    // UPDATE EXISTING EXPENSE
    // =================================================

    if (editing !== null) {

        // Change total:
        // remove old amount and add new amount

        total = total - editing.oldAmount + newAmount;

        totalExpense.textContent = total;


        // Update object

        editing.expense.name = namee;
        editing.expense.amount = newAmount;
        editing.expense.category = catg;
        editing.expense.date = datee;


        // Update table

        editing.row.children[0].textContent = namee;
        editing.row.children[1].textContent = newAmount;
        editing.row.children[2].textContent = catg;
        editing.row.children[3].textContent = datee;


        // Save updated expenses

        localStorage.setItem( "expenses", JSON.stringify(expenses));


        // Reset editing

        editing = null;


        // Clear inputs

        expensename.value = "";
        amount.value = "";
        category.value = "";
        date.value = "";


        expense_btn.textContent = "Add Expense";


        return;
    }


    // =================================================
    // ADD NEW EXPENSE
    // =================================================

    const expense = {

        name: namee,
        amount: newAmount,
        category: catg,
        date: datee

    };


    // Add to array

    expenses.push(expense);


    // Add to total

    total = total + newAmount;

    totalExpense.textContent = total;


    // Save

    localStorage.setItem(
        "expenses",
        JSON.stringify(expenses)
    );


    // Create table row

    createRow(expense);
    


    // Clear inputs

    expensename.value = "";
    amount.value = "";
    category.value = "";
    date.value = "";

});


// =========================
// CREATE ROW
// =========================

function createRow(expense) {

    const element = document.createElement("tr");

    const td1 = document.createElement("td");
    const td2 = document.createElement("td");
    const td3 = document.createElement("td");
    const td4 = document.createElement("td");
    const td5 = document.createElement("td");

    const edit_btn = document.createElement("button");
    const del_btn = document.createElement("button");


    // Put values inside cells

    td1.textContent = expense.name;
    td2.textContent = expense.amount;
    td3.textContent = expense.category;
    td4.textContent = expense.date;


    // Buttons

    edit_btn.textContent = "Edit";
    del_btn.textContent = "Delete";


    // Put buttons inside td5

    td5.appendChild(edit_btn);
    td5.appendChild(del_btn);


    // Put cells inside row

    element.appendChild(td1);
    element.appendChild(td2);
    element.appendChild(td3);
    element.appendChild(td4);
    element.appendChild(td5);


    // Put row inside table

    expenseList.appendChild(element);


    // =========================
    // DELETE
    // =========================

    del_btn.addEventListener("click", () => {

        const deleteAmount = Number(expense.amount);

        total = total - deleteAmount;

        totalExpense.textContent = total;


        // Remove row

        element.remove();


        // Remove object from array

        expenses = expenses.filter((item) => {
            return item !== expense;
        });


        // Save

        localStorage.setItem(
            "expenses",
            JSON.stringify(expenses)
        );

    });


    // =========================
    // EDIT
    // =========================

    edit_btn.addEventListener("click", () => {

        // Remember OLD amount

        const oldAmount = Number(expense.amount);


        // Put old data into inputs

        expensename.value = expense.name;
        amount.value = expense.amount;
        category.value = expense.category;
        date.value = expense.date;


        // Remember which expense and row we are editing

        editing = {
            expense: expense,
            row: element,
            oldAmount: oldAmount
        };


        expense_btn.textContent = "Update Expense";

    });

}


// =========================
// DISPLAY SAVED EXPENSES
// =========================

function displayExpenses() {

    expenses.forEach((expense) => {

        createRow(expense);

    });

}

displayExpenses();


// =========================
// FILTER
// =========================

filterCategory.addEventListener("change", () => {

    const selectedCategory = filterCategory.value;

    const rows = expenseList.querySelectorAll("tr");


    rows.forEach((row) => {

        const rowcategory =
            row.children[2].textContent;


        if (
            selectedCategory === "" ||
            rowcategory === selectedCategory
        ) {

            row.style.display = "";

        }

        else {

            row.style.display = "none";

        }

    });

});