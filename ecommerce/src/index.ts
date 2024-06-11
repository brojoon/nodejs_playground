import { PrismaClient } from "@prisma/client";
import express from "express";
import path from "path";
import { PORT } from "./secrets";
import rootRouter from "./routes";
import { errorMiddleware } from "./middlewares/errors";

export const prisma = new PrismaClient({
  // Prisma를 이용해 데이터베이스를 접근할 때, SQL을 출력
  log: ["query", "info", "warn", "error"],

  // 에러 메시지를 평문이 아닌, 개발자가 읽기 쉬운 형태로 출력
  errorFormat: "pretty",
}).$extends({
  result: {
    address: {
      formattedAddress: {
        needs: {
          lineOne: true,
          lineTwo: true,
          city: true,
          country: true,
          pincode: true
        },
        compute: (addr) => {
          return `${addr.lineOne}, ${addr.lineTwo}, ${addr.city}, ${addr.country}-${addr.pincode}`
        }
      }
    }
  }
});





// Database connection pool

// const cors = require('cors');
// const session = require('express-session');
// const cookieParser = require('cookie-parser');
// const passport = require('passport');
// const dotenv = require('dotenv');
// const morgan = require('morgan');
// const path = require('path');
// const hpp = require('hpp');
// const helmet = require('helmet');

const app = express();
const __dirname = path.resolve();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use('/api', rootRouter);

app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log("hi");
});

// 컨트롤러 영역
// app.use("/customer", customer);
// app.use("/product", product);

// app.get("/about", (req, res) => {
//   console.log("about 요청!");
//   res.send("about에 대한 요청");
// });

// app.post("/process/login", (req, res) => {
//   const paramId = req.body.id;
//   const paramPassword = req.body.passsword;

//   console.log("로그인 요청 " + paramId + " " + paramPassword);
// });

// app.post("/process/adduser", (req, res) => {
//   console.log("/process/adduser 호출됨 " + req);

//   const paramId = req.body.id;
//   const paramName = req.body.name;
//   const paramAge = req.body.age;
//   const paramPassword = req.body.password;

//   console.log("pool.getConnection 종료");
// });

// app.get("/", async (req, res) => {
//   res.send("product router");

//   const result = await prisma.users.findFirst({
//     where: { name: "ydngjink1" },
//   });
//   prisma.$disconnect();
//   console.log("result: ", result);
// });
