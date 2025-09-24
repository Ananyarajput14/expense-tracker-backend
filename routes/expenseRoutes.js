const express = require("express");
const {protect} = require("../middleware/auth");
const xlsx= require('xlsx');
const Expense= require("../models/Expense");

const router= express.Router();

router.post("/addExpense",protect,async(req,res)=>{
const userId= req.user._id;
try{
    const {icon,category,amount,date} = req.body;
    if(!category || !amount || !date){
        return res.status(400).json({message: "All fields are required"});
    }
    const expense= new Expense({
        userId,
        icon,
        category,
        amount,
        date: new Date(date)
    });
    await expense.save();
    res.status(200).json({message: "Expense added successfully", expense});
}
catch(err){
    res.status(500).json({message: "Internal server error"});
}
});

router.get("/getExpense",protect,async(req,res)=>{
const userId = req.user._id;
    try {
        const expenses = await Expense.find({ userId }).sort({ date: -1 });
        if (expenses.length === 0) {
            return res.status(404).json({ message: "No expenses found" });
        }
        res.status(200).json({ expenses });
    } catch (err) {
        res.status(500).json({ message: "Internal server error" });
    }
});

router.delete("/deleteExpense/:id", protect, async (req, res) => {
  try {
    const expenseId = req.params.id;
    if (!expenseId) {
      return res.status(400).json({ message: "Expense ID is required" });
    }

    const deletedExpense = await Expense.findByIdAndDelete(expenseId);

    if (!deletedExpense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    res.status(200).json({ message: "Expense deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
});


router.get("/download",protect,async(req,res)=>{
const userId= req.user._id;
try{
    const expenses= await Expense.find({userId}).sort({date: -1});
   if (expenses.length === 0) {
       return res.status(404).json({ message: "No expenses found" });
   }
  const data = expenses.map((item)=>({
 Category: item.category,
 Amount: item.amount,
 Date: item.date,
  }));

const wb= xlsx.utils.book_new();
const ws= xlsx.utils.json_to_sheet(data);
xlsx.utils.book_append_sheet(wb,ws,"Expenses");
xlsx.writeFile(wb,'expense_details.xlsx');
res.download('expense_details.xlsx');

} catch (err) {
    res.status(500).json({ message: "Internal server error", error: err.message });
}
});

module.exports= router;