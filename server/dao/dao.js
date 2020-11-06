const sqlite = require('sqlite3');
const bcrypt = require('bcrypt');
const Service = require('./Service');
const Ticket = require('./Ticket');
const Counter = require('./Counter');

//Init SQLite DB
const db = new sqlite.Database('dao/db.db',
  (err) => { if (err) throw err; });

const createServiceData = function (row) {
  return new Service(
    row.SERVICE_ID,
    row.NAME,
    row.SERVICE_TIME
  );
};

const createTicketData = function (row) {
  return new Ticket(
    row.TICKET_ID,
    row.TICKET_NUMBER,
    row.SERVICE_ID,
    row.NAME, /*SERVICE DESCRIPTION */
    row.COUNTER_ID,
    row.STATUS,
    row.DATE
  );
};

const createCounterData = function (row) {
  return new Counter(
    row.COUNTER_ID
  );
};

exports.login = async function (USERNAME, plainPassword) {
  return new Promise(function (resolve, reject) {
    const sqlStatement = 'SELECT PASSWORD FROM OFFICER WHERE USERNAME = ?';
    db.get(sqlStatement, [USERNAME], function (err, row) {
      if (err)
        console.log(err);
      if (!row) {
        reject(false);
        return;
      }
      bcrypt.compare(plainPassword, row.PASSWORD, (err, res) => {
        if (err) {
          console.error(err);
        }
        if (res)
          resolve(true);
        else
          reject(false);
      });
    });
  });
};

exports.findMaxTicketNumber = async function () {
  return new Promise(function (resolve, reject) {
    const sqlStatement = 'SELECT MAX(TICKET_NUMBER) FROM TICKET';
    db.get(sqlStatement, function (err, row) {
      if (err)
        console.log(err);
      if (!row) {
        reject(false);
        return;
      }
      resolve(row['MAX(TICKET_NUMBER)']);
    });
  });
}

exports.createTicket = async function (TICKET_NUMBER, SERVICE_ID) {
  const COUNTER_ID = 0;
  const STATUS = 0;
  return new Promise(function (resolve, reject) {
    const sqlStatement = 'INSERT INTO TICKET (TICKET_NUMBER,SERVICE_ID,COUNTER_ID,STATUS,DATE) VALUES (?,?,?,?,CURRENT_TIMESTAMP)';
    db.run(sqlStatement, [TICKET_NUMBER, SERVICE_ID, COUNTER_ID, STATUS], function (err) {
      if (err) {
        console.log(err);
        reject(false);
        return;
      }
      resolve(this.lastID);
    });
  })
}

exports.calculateQueueLength = async function (SERVICE_ID) {
  return new Promise(function (resolve, reject) {
    const sqlStatement = 'SELECT COUNT(SERVICE_ID) FROM TICKET WHERE STATUS = 0 and SERVICE_ID = ?';
    db.get(sqlStatement, [SERVICE_ID], function (err, row) {
      if (err)
        console.log(err);
      if (!row) {
        reject(false);
        return;
      }
      resolve(row['COUNT(SERVICE_ID)']);
    });
  })
}

exports.getAllServices = async function () {
  return new Promise(function (resolve, reject) {
    const sqlStatement = 'SELECT * FROM SERVICE';
    db.all(sqlStatement, function (err, rows) {
      if (err) {
        console.log(err);
        reject(false);
        return;
      }
      let Services = rows.map((rows) => createServiceData(rows));
      resolve(Services)
    });
  })
}

exports.getAllTickets = async function () {
  return new Promise(function (resolve, reject) {
    const sqlStatement = 'SELECT * FROM TICKET T, SERVICE S WHERE T.SERVICE_ID = S.SERVICE_ID';
    db.all(sqlStatement, function (err, rows) {
      if (err) {
        console.log(err);
        reject(false);
        return;
      }
      let Tickets = rows.map((rows) => createTicketData(rows));
      resolve(Tickets)
    });
  })
}

exports.terminateTicket = async function (TICKET_ID) {
  return new Promise(function (resolve, reject) {
    const sqlStatement = 'UPDATE TICKET SET STATUS = 2 WHERE TICKET_ID = ?';
    db.all(sqlStatement, [TICKET_ID], function (err) {
      if (err) {
        console.log(err);
        reject(false);
        return;
      }
      resolve(true)
    });
  })
}

exports.getTicketById = async function (TICKET_ID) {
  return new Promise(function (resolve, reject) {
    const sqlStatement = 'SELECT * FROM TICKET WHERE TICKET_ID = ?';
    db.get(sqlStatement, [TICKET_ID], function (err, row) {
      if (err) {
        console.log(err);
        reject(false);
        return
      }
      if (!row) {
        resolve(false);
        return;
      }
      resolve(true)
    });
  })
}

exports.getAllCountersIds = async function () {
  return new Promise(function (resolve, reject) {
    const sqlStatement = 'SELECT DISTINCT(COUNTER_ID) FROM COUNTER';
    db.all(sqlStatement, function (err, rows) {
      if (err) {
        console.log(err);
        reject(false);
        return;
      }
      let counters = rows.map((row) => { return createCounterData(row); });
      resolve(counters);
    });
  })
}


//find queue
//update ticket status to 1 
//update counter_id
exports.findNextTicket = async function (TICKET_ID) {
  return new Promise(function (resolve, reject) {
    // const sqlStatement = 'SELECT * FROM TICKET WHERE TICKET_ID = ?';
    // db.get(sqlStatement, [TICKET_ID], function (err, row) {
    //   if (err) {
    //     console.log(err);
    //     reject(false);
    //     return
    //   }
    //   if (!row) {
    //     resolve(false);
    //     return;
    //   }
    //   resolve(true)
    // });
  })
}

// get all services a counter can provide
const getCounterServices = (counterID) => {

  return new Promise((resolve, reject) => {
    const sql = `SELECT SERVICE_ID
                 FROM COUNTER
                 WHERE COUNTER_ID = ?`;

    db.all(sql, [counterID], function (err, rows) {
      if (err) {
        console.log(err);
        reject(err);
      }
      else {
        resolve(rows.map(row => row.SERVICE_ID));
      }
    });
  });
}

// get all tickets queuing for a service the counter can provide
const getQueues = (services) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT SERVICE_ID, COUNT(*) AS QUEUE_LENGTH
                 FROM TICKET
                 WHERE STATUS = 0
                 GROUP BY SERVICE_ID`;

    db.all(sql, [], function (err, rows) {
      if (err) {
        console.log(err);
        reject(err);
      }
      else {

        const waitingTickets = rows.filter((row) => {
          return services.includes(row.SERVICE_ID);
        });
        resolve(waitingTickets);
      }
    });
  });
}

// gets all tickets of the choosen queue
const getChosenQueue = (serviceID) => {

  return new Promise((resolve, reject) => {
    const sql = `SELECT TICKET_ID, TICKET_NUMBER, SERVICE_ID
                 FROM TICKET
                 WHERE SERVICE_ID = ? AND STATUS = 0`;

    db.all(sql, [serviceID], function (err, rows) {
      if (err) {
        console.log(err);
        reject(err);
      }
      else {
        resolve(rows);
      }
    });
  });
}

const chooseTicket = (queue) => {

  const numbers = queue.map(ticket => ticket.TICKET_NUMBER);
  const min = Math.min(...numbers);

  const selectedTicket = queue.find((ticket) => {
    return ticket.TICKET_NUMBER === min;
  });
  return selectedTicket;

}

// Sets to 1 (that means currently served) the status of the selected next customer,
// to COUNTER_ID the counter attribute of the selected next ticket

const updateStatusNewCustomer = (ticketID, counterID) => {

  return new Promise((resolve, reject) => {
    const sql = `UPDATE TICKET
                 SET STATUS = 1, COUNTER_ID = ?
                 WHERE TICKET_ID = ?`;
    db.run(sql, [counterID, ticketID], (err) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      else {
        resolve(this.changes);
      }
    });
  })
}

const updateStatusOldCustomer = (counterID) => {
  return new Promise((resolve, reject) => {
    const sql = `UPDATE TICKET
                 SET STATUS = 2
                 WHERE COUNTER_ID = ? AND STATUS = 1`;
    db.run(sql, [counterID], (err) => {
      if (err) {
        console.log(err);
        reject(err);
      }
      else {
        resolve(this.changes);
      }
    });
  })
}
// gets the duration of the specified services
const getServiceLessDuration = (queues) => {

  return new Promise((resolve, reject) => {
    const sql = `SELECT SERVICE_ID, SERVICE_TIME
                 FROM SERVICE`;

    db.all(sql, [], function (err, rows) {
      if (err) {
        console.log(err);
        reject(err);
      }
      else {

        const selectedServices = rows.filter((row) => {
          return queues.map(row => row.SERVICE_ID).includes(row.SERVICE_ID);
        });

        const durations = selectedServices.map(service => service.SERVICE_TIME);
        const maxDuration = Math.max(...durations);
        const selectedService = selectedServices.find((service) => {
          return service.SERVICE_TIME === maxDuration;
        });
        resolve(selectedService.SERVICE_ID);
      }
    });
  });
}

// computes the ticket number of the next customer that can be served by the counter
// updates the status in the db
const computeNextServed = (queues, counterID) => {
  return new Promise((resolve, reject) => {
    const lengths = queues.map(item => item.QUEUE_LENGTH);
    const max = Math.max(...lengths);
    const selectableQueues = queues.filter(queue => queue.QUEUE_LENGTH === max);

    // Only one queue is more crowded than the others
    if (selectableQueues.length === 1) {
      const chosenQueue = selectableQueues[0].SERVICE_ID;
      getChosenQueue(chosenQueue)
        .then((queue) => {

          const selected = chooseTicket(queue);

          updateStatusOldCustomer(counterID)
            .then(() => {
              updateStatusNewCustomer(selected.TICKET_ID, counterID)
                .then(() => resolve(selected.TICKET_NUMBER));

            })
        })

        .catch((err) => reject(err));
    }
    else {
      getServiceLessDuration(selectableQueues)
        .then((chosenService) => {
          const chosenQueue = selectableQueues.find((queue) => {
            return queue.SERVICE_ID === chosenService;
          });

          getChosenQueue(chosenQueue.SERVICE_ID)
            .then((queue) => {
              const selected = chooseTicket(queue);
              updateStatusOldCustomer(counterID)
                .then(() => {
                  updateStatusNewCustomer(selected.TICKET_ID, counterID)
                    .then(() => resolve(selected.TICKET_NUMBER));
                })
            });

        })
        .catch((err) => reject(err));
    }
  })

}

exports.getNextCustomer = async (counterID) => {

  return new Promise((resolve, reject) => {

    getCounterServices(counterID)
      .then((services) => {
        getQueues(services)
          .then((tickets) => {
            if (tickets.length === 0) {//there is not any ticket in the queue
              resolve(false);
              return;
            }
            computeNextServed(tickets, counterID)
              .then(selectedTicket => resolve({ ticketNumber: selectedTicket }))
          });
      })
      .catch((err) => {
        reject(err);
      })
  });
}