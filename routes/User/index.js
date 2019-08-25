const express = require('express');
const Router = express.Router();
const { session, driver } = require('../../config/db/neo4j');

//Rutas
Router.post('/', (req, res) => {
  session
    .run('CREATE (u:User {name:$name, email:$email}) RETURN u;', {
      name: req.body.name,
      email: req.body.email
    })
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

Router.post('/participates', (req, res) => {
  session
    .run(
      `MATCH (u:User),(e:Event) WHERE id(u)=${req.body.user_id} AND id(e)=${req.body.event_id}  CREATE (u)-[r:PARTICIPATES]->(e) RETURN type(r);`
    )
    .then(result => {
      driver.close();
      res.json(result);
    })
    .catch(e => {
      console.log(e);
      res.status(500).end();
    });
});

Router.get('/:id', (req, res) => {
  session
    .run(`MATCH (u:User) WHERE id(u)=${req.params.id} RETURN u;`)
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

Router.post('/follows', (req, res) => {});

module.exports = Router;
