const express = require('express');
const app = express();
const port = 8080;

const people = [{
    "first_name": "Olly",
    "last_name": "Brewood"
  }, {
    "first_name": "Chrotoem",
    "last_name": "Espinosa"
  }, {
    "first_name": "Dayna",
    "last_name": "Corro"
  }, {
    "first_name": "Dion",
    "last_name": "Novak"
  }, {
    "first_name": "Buck",
    "last_name": "Astupenas"
  }, {
    "first_name": "Giffie",
    "last_name": "Sainte Paul"
  }, {
    "first_name": "Charmane",
    "last_name": "Gheorghie"
  }, {
    "first_name": "Patrice",
    "last_name": "Itskovitz"
  }, {
    "first_name": "Kym",
    "last_name": "Growden"
  }, {
    "first_name": "Jerrilee",
    "last_name": "Tattershaw"
  }, {
    "first_name": "Mareah",
    "last_name": "Casemore"
  }, {
    "first_name": "Belvia",
    "last_name": "Gantzer"
  }, {
    "first_name": "Nev",
    "last_name": "McElory"
  }, {
    "first_name": "Saw",
    "last_name": "Menico"
  }, {
    "first_name": "Garold",
    "last_name": "Gilham"
  }, {
    "first_name": "Dinah",
    "last_name": "Hunton"
  }, {
    "first_name": "Rolf",
    "last_name": "Farish"
  }, {
    "first_name": "Quinton",
    "last_name": "Mendoza"
  }, {
    "first_name": "Kylynn",
    "last_name": "Vurley"
  }, {
    "first_name": "Chickie",
    "last_name": "Hearsum"
  }]

const getNextLine = async (index) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(people[index]);
        }, 250)
    })
}

app.use(express.static('public'))

app.get('/api/regular', async (req, res) => { // returns regular JSON a stream
    res.write('[');

    for (let i=0;i<people.length;i++) {
        const line = await getNextLine(i); // this takes 250ms for each item
        if (i === people.length - 1) {
            res.write(`${JSON.stringify(line)}`);
        } else {
            res.write(`${JSON.stringify(line)},`);
        }
    }

    res.write(']');
    res.end();
})

app.get('/api/stream', async (req, res) => { // returns NDJSON (newline-delimited JSON) in a stream
    for (let i=0;i<people.length;i++) {
        const line = await getNextLine(i);
        res.write(`${JSON.stringify(line)}\n`); // incrementally write the json object to the stream over time
    }
    res.end(); // eventually, close the stream
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))