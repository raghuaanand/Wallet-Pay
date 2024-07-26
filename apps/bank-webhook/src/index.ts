import express from "express";
import db from "@repo/db/client"
const app = express();


app.post("/hdfcwebhook", async (req, res) => {
  //TODO: implement zod validation here
  //TODO: hdfc bank should ideally send a token, user_identifier, amount
  const paymentInformation = {
    token: req.body.token,
    userId: req.body.user_identifier,
    amount: req.body.amount,
  };

  //transactions
  try{
      await db.$transaction([
        db.balance.updateMany({
            where: {
                userId: Number(paymentInformation.userId)
            },
            data: {
                amount: {
                    // You can also get this from your DB
                    increment: Number(paymentInformation.amount)
                }
            }
        }),
        db.onRampTransaction.updateMany({
            where: {
                token: paymentInformation.token
            }, 
            data: {
                status: "completed",
            }
        })
    ]);
    // we have to be very careful here, we should not send 411 status code otherwise bank will refund the money to the user
    res.json({
        message: "Captured"
    })
  }catch(e){
        console.error(e);
        res.status(411).json({
            message: "Error while processing webhook"
        })
  }
 
});
