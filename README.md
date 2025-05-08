# DecoVal

**DecoVal** is a decorator-driven validation pattern that allows you to add validation rules directly to the properties of TypeScript classes, simplifying data control and increasing code readability and reusability.

**Author:** Kaike Bartolomeu  
**NPM Package:** [`decoval`](https://www.npmjs.com/package/decoval)

---

## 🚀 How to Install

```bash
npm install decoval
yarn add decoval
pnpm add decoval
```

## Required Configuration

Enable decorators in TypeScript by adding the below options to tsconfig.json:

```json
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
}
```

## Usage Examples

This example uses Decoval decorators to validate a User model with strict input rules: username requires a number and no spaces, password needs a special character and no spaces, and status must be a boolean. Ideal for secure login or account creation flows.

```ts
import "reflect-metadata";
import { DvText, DvBoolean, decoValidation } from "decoval";

class User {
  @DvText({ noSpaces: true, number: true })
  username!: string;

  @DvText({ emailProviders: ["gmail.com", "yandex.com"] })
  email!: string;

  @DvText({ specialChar: true })
  password!: string;

  @DvBoolean()
  status!: boolean;
}
```

## Use with Express

This example shows how to use the decoval library with Express.js to validate data from a POST request. The User class uses @DvText decorators to define validation rules for name, email, and password. The decoValidation function automatically validates the data based on these annotations. If the data is valid, the server returns validated JSON; otherwise, it issues a 400 error. This approach keeps validation separate from routing logic, making it easier to reuse and organize code in modern REST APIs.

```ts
import express, { Request, Response } from "express";
import cors from "cors";
import morgan from "morgan";
import { DvText } from "./dv/dv.text";
import { decoValidation } from "decoval";

const app = express();
app.use(express.json()).use(cors()).use(morgan("dev"));

class User {
  @DvText()
  name!: string;

  @DvText({ specialChar: true })
  password!: string;

  @DvText({ emailProviders: "gmail.com" })
  email!: string;
}

type TUser<T> = {
  [K in keyof T]: T[K];
};

app.post("/", async (req: Request<{}, {}, TUser<User>>, res: Response) => {
  try {
    const { email, name, password } = req.body;
    const user = new User();
    user.email = email;
    user.name = name;
    user.password = password;

    const data = await decoValidation(user);
    res.status(201).json(data);
  } catch (error) {
    res.status(400).json(error);
  }
});

const port: number = 4000;

app.listen(port, () => console.log(port));
```

## Decorators Available

- @DvText()
- @DvNumber()
- @DvId()
- @DvIP()
- @DvURL()
- @DvBooelean()
- @DvEnum()
- @DvArray()
- @DvDate()
- @DvCustom()

## Conclusion

DecoVal is a robust and simple solution for data validation in TypeScript applications. With an elegant decorator-based syntax, it offers rich validations that are adaptable to the real business context.

📬 Contributions and suggestions are welcome!
🔗 Official repository: github.com/kaikebartolomeu/decoval
