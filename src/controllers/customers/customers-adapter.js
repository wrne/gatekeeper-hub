const mappingFieldsCustomers = {
  economicGroup: "A1_GRPVEN",
  state: "A1_EST",
  name: "A1_NOME",
  id: "A1_COD",
  store: "A1_LOJA",
  nationalRegister: "A1_CGC",
  stateRegistration: "A1_INSCR",
};

const mappingDBFieldsCustomers = {
  A1_COD: "id",
  A1_LOJA: "store",
  A1_NOME: "name",
  A1_PESSOA: "type",
  A1_CGC: "nationalRegister",
  A1_INSCR: "stateRegistration",
  A1_EST: "state",
  A1_MUN: "city",
  A1_GRPVEN: "economicGroup",
  A1_COMPLEM: "farm",
  A1_EMAIL: "email",
};

export { mappingFieldsCustomers, mappingDBFieldsCustomers };
