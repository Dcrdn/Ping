const express = require('express');
const Router = express.Router();
const { session, driver } = require('../../config/db/neo4j');

//Rutas
Router.post('/', (req, res) => {
  console.log(req.body.ngo_id);
  session
    .run(
      `MATCH (o:NGO) WHERE id(o)=${req.body.ngo_id} CREATE (o)-[r:ORGANIZES]->(e:Event {name:$name, capacity:$capacity, description:$description, image:$imageUrl}) RETURN e;`,
      {
        name: req.body.name,
        capacity: req.body.capacity,
        description: req.body.description,
        imageUrl: req.body.imageUrl
      }
    )
    .then(result => {
      driver.close();
      res.json(result.records[0].get(0));
    })
    .catch(e => {
      console.log(e);
      res
        .status(500)
        .json(e)
        .end();
    });
});

Router.get('/', (req, res) => {
  session
    .run('MATCH (e:Event) RETURN e LIMIT 30')
    .then(result => {
      driver.close();
      payload = [];
      console.log(result.records);
      result.records.forEach(r => {
        console.log(r);
        payload.push(r.get(0));
      });
      res.json({ payload });
    })
    .catch(e => {
      console.log(e);
      res
        .status(500)
        .json(e)
        .end();
    });
});

Router.get('/:id', (req, res) => {
  session
    .run(`MATCH (e:Event),(o:NGO) WHERE id(e)=${req.params.id} RETURN e;`)
    .then(result => {
      driver.close();
      res.json(result.records[0].get(0));
    })
    .catch(e => {
      console.log(e);
      res
        .status(500)
        .json(e)
        .end();
    });
});

module.exports = Router;
