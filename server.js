const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static("public"));
app.use(express.json());

const expenseSchema = new mongoose.Schema({
    name: String,
    amount: Number,
    category: String,
    date: String
});

const expense = mongoose.model("expense", expenseSchema);

app.post("/api/expenses", async (req, res) => {
    try {
        console.log(req.body);
        const newExpense = await expense.create(req.body);

        res.status(201).json(newExpense);
    } catch (error) {
        res.status(400).json({
            message: "Could not save expense"
        });
    }
});

app.get("/api/expenses", async (req, res) => {
    try {
        const allExpenses = await expense.find();

        res.json(allExpenses);
    } catch (error) {
        res.status(500).json({
            message: "Could not get expenses"
        });
    }
});

app.delete("/api/expenses/:id", async (req, res) => {
    try {
        const deletedExpense = await expense.findByIdAndDelete(req.params.id);

        if (deletedExpense === null) {
            return res.status(404).json({
                message: "Expense not found"
            });
        }

        res.json(deletedExpense);
    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Could not delete expense"
        });
    }
});

app.put("/api/expenses/:id", async (req, res) => {
    try {
        const updatedExpense = await expense.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (updatedExpense === null) {
            return res.status(404).json({
                message: "Expense not found"
            });
        }

        res.json(updatedExpense);
    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Could not update expense"
        });
    }
});

mongoose
    .connect(process.env.MONGO_URI)

    .then(() => {
        
        console.log("MongoDB is connected");

        app.listen(PORT, () => {
            console.log(`Example app listening on port ${PORT}`);
        });
    })

    .catch((error) => {
        console.log("MongoDB connection failed:", error);
    });