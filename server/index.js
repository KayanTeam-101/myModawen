import express from 'express';
import cors from 'cors'
import os from 'os'

const app = express();
const PORT =3000;

app.use(cors)

let CreatePrimaryNumber = () =>{
        const getCPUsLength = os.cpus().length;
    const getTotalMEM = os.totalmem();
return String(getCPUsLength) + String(getTotalMEM) * 123;
}

app.get('/',(req,res) =>{
    res.send(CreatePrimaryNumber());
})

app.listen(PORT)