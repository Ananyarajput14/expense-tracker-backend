const express= require("express");
const { protect } = require("../middleware/auth");
const router= express.Router();
const Income = require("../models/Income");
const User = require("../models/User");
const xlsx = require('xlsx'); 

router.post("/addIncome",protect, async(req,res)=>{
const userId= req.user._id;
try{
    const {icon,source,amount,date} = req.body;
    if(!icon || !source || !amount || !date){
        return res.status(400).json({message: "All fields are required"});
    }
    const income= new Income({
        userId,
        icon,
        source,
        amount,
        date: new Date(date)
    });
    await income.save();
    res.status(200).json({message: "Income added successfully", income});
}
catch(err){
    res.status(500).json({message: "Internal server error"});
}
});

router.get("/getIncome", protect, async (req, res) => {
    const userId = req.user._id;
    try {
        const income = await Income.find({ userId }).sort({ date: -1 });
        if (income.length === 0) {
            return res.status(404).json({ message: "No income found" });
        }
        res.status(200).json({ income });
    } catch (err) {
        res.status(500).json({ message: "Internal server error" });
    }
});


router.get("/downloadExcel",protect,async(req,res)=>{
const userId= req.user._id;
try{
    const income= await Income.find({userId}).sort({date: -1});
   if (income.length === 0) {
       return res.status(404).json({ message: "No income found" });
   }
  const data = income.map((item)=>({
 Source: item.source,
 Amount: item.amount,
 Date: item.date,
  }));

const wb= xlsx.utils.book_new();
const ws= xlsx.utils.json_to_sheet(data);
xlsx.utils.book_append_sheet(wb,ws,"Income");
xlsx.writeFile(wb,'income_details.xlsx');
res.download('income_details.xlsx');

} catch (err) {
    res.status(500).json({ message: "Internal server error", error: err.message });
}
});

router.delete("/deleteIncome/:id",protect, async(req,res)=>{
try{
    const incomeId= req.params.id;
    await Income.findByIdAndDelete(incomeId);
    res.status(200).json({message: "Income deleted successfully"});
}
catch(err){
    res.status(500).json({message: "Internal server error", error: err.message});
}
});

module.exports= router;