## Ticket APIs

`app.get('/tickets', async (req, res))` ==> To list all tickets  
`app.post('/tickets', async (req, res))` ==> To calculate the queue lenght and generate a ticket number

Update ticket  
`app.put('/tickets/:id', async (req, res))`

Possible situations, when the officer push the button to call the next customer

- 1- For the customer at the counter, The field status of the ticket should be set to 2
- 2- The system should find the next ticket and update the field status to 1

## Servcie APIs

`app.get('/services', async (req, res))` ==> To list all services
