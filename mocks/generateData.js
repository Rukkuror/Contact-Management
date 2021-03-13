var faker = require('faker');

var database = { contacts: []};

for (var i = 1; i<= 300; i++) {
  database.contacts.push({
    id: i,
    name: faker.commerce.name(),
    jobTitle: faker.lorem.jobTitle(),
    company: faker.commerce.company()
  });
}

console.log(JSON.stringify(database));