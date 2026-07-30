const expenseName = document.querySelector("#expenseName");
const expenseAmount = document.querySelector("#expenseAmount");
const category = document.querySelector("#category");
const expenseDate = document.querySelector("#expenseDate");
const addExpense = document.querySelector("#addExpense");
const filterCategory = document.querySelector("#filterCategory");
const expenseTable = document.querySelector("#expenseTable");
const totalExpense = document.querySelector("#totalExpense");
const editModal = document.querySelector("#editModal");
const editName = document.querySelector("#editName");
const editAmount = document.querySelector("#editAmount");
const editCategory = document.querySelector("#editCategory");
const editDate = document.querySelector("#editDate");
const saveEdit = document.querySelector("#saveEdit");
const cancelEdit = document.querySelector("#cancelEdit");
const filterDate = document.querySelector("#filterdate");
let total = 0;
let expenses = [];
let editingExpense = null;

loadExpenses();

// function formatDate(dateString) {
//     const [year, month, day] = dateString.split("-");

//     return `${day}-${month}-${year}`;
// }

function addExpenseTable(expense) {
    const row = document.createElement("tr");

    const td1 = document.createElement("td");
    const td2 = document.createElement("td");
    const td3 = document.createElement("td");
    const td4 = document.createElement("td");
    const td5 = document.createElement("td");

    const editBtn = document.createElement("button");
    const deleteBtn = document.createElement("button");

    td1.textContent = expense.name;
    td2.textContent = `₹${expense.amount}`;
    td3.textContent = expense.category;
    td4.textContent = (expense.date);
    editBtn.textContent = "Edit";
    deleteBtn.textContent = "Delete";

    editBtn.classList.add("action-btn", "edit");
    deleteBtn.classList.add("action-btn", "delete");

    //DELETE ROW
    deleteBtn.addEventListener("click", async () => {

        await fetch(`/api/expenses/${expense._id}`, {
            method: "DELETE"
        })

        expenses = expenses.filter((item) => {
            return item._id !== expense._id;
        });

        displayExpenses(expenses);
        addTotal(expenses);

    });
    td5.append(editBtn, deleteBtn);

    editBtn.addEventListener("click", () => {
        editingExpense = expense;

        editModal.style.display = "flex";

        editName.value = expense.name;
        editAmount.value = expense.amount;
        editCategory.value = expense.category;
        editDate.value = expense.date;
    })

    row.append(td1, td2, td3, td4, td5);
    expenseTable.append(row);
}

saveEdit.addEventListener("click", async () => {
    const updatedData = {
        name: editName.value,
        amount: Number(editAmount.value),
        category: editCategory.value,
        date: editDate.value
    };

    const response = await fetch(`/api/expenses/${editingExpense._id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(updatedData)
    });

    const updatedExpense = await response.json();

    expenses = expenses.map((item) => {
        if (item._id === updatedExpense._id) {
            return updatedExpense;
        }
        return item;
    });

    displayExpenses(expenses);
    addTotal(expenses);

    editingExpense = null;
    editModal.style.display = "none";
});

cancelEdit.addEventListener("click", () => {

    editModal.style.display = "none";
    editingExpense = null;

});

function displayExpenses(list) {

    expenseTable.innerHTML = "";

    list.forEach((expense) => {

        addExpenseTable(expense);

    });

}

function addTotal(list) {
    total = 0;
    list.forEach(expense => {

        total = total + expense.amount;
    });
    totalExpense.textContent = `₹${total}`;
}

async function loadExpenses() {
    const response = await fetch("api/expenses");
    expenses = await response.json();

    displayExpenses(expenses);
    addTotal(expenses);
}

function filterSelection() {
    const selectedDate = filterDate.value;
    const selectedCategory = filterCategory.value;

    const filteredExpenses = expenses.filter(expense => {

        const categoryMatch =
            selectedCategory === "All" ||
            expense.category === selectedCategory;

        const dateMatch =
            selectedDate === "" ||
            expense.date === selectedDate;

        return categoryMatch && dateMatch;

    });

    displayExpenses(filteredExpenses);
    addTotal(filteredExpenses);
}


filterCategory.addEventListener("change", () => {
    
    filterSelection();

});

filterDate.addEventListener("change", () => {

    filterSelection();

});

function clearValues() {
    expenseName.value = "";
    expenseAmount.value = "";
    category.value = "";
    expenseDate.value = "";
}

addExpense.addEventListener("click", async () => {

    if (expenseName.value === "" || expenseAmount.value === "" || category.value === "" || expenseDate.value === "") {
        alert("Please fill all fields");
        return;
    }

    const expense = {
        name: expenseName.value,
        amount: Number(expenseAmount.value),
        category: category.value,
        date: expenseDate.value
    };

    const response = await fetch("/api/expenses", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(expense)
    });

    const savedExpense = await response.json();

    expenses.push(savedExpense);

    displayExpenses(expenses);
    addTotal(expenses);

    clearValues();
});