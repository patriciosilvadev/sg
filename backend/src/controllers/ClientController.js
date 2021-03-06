const connection = require('../database/connection');
const CompanieHelper = require('../helpers/CompanieHelper');
const UserHelper = require('../helpers/UserHelper');

const moment = require('moment');

const getAll = async (request, response) => {
  try {
    if (! await UserHelper.validUser(request.headers.hash))
      return response.json({ error: 'Access denied' });


    const res = await connection('clients').select('*');
    clients = [];
    for (client of res) {
      const companie = await CompanieHelper.getById(client.companie);
      const lastUser = await UserHelper.getById(client.last_user);
      clients.push({ 
        ...client, 
        last_user_name: lastUser ? lastUser.name : '',
        companie_name: companie ? companie.name : '' 
      })
    }
    return response.json(clients);
  } catch (error) {
    return response.json({ error: error.message });
  }
}

const newRegister = async (request, response) => {
  try {
    if (! await UserHelper.validUser(request.headers.hash))
      return response.json({ error: 'Access denied' });

    const register = {
      last_user: request.headers.user_id,
      created_at: moment().format('L LT'),
      code: request.body.code,
      name: request.body.name,
      companie: request.body.companie,
      phone: request.body.phone,
      phone_additional: request.body.phone_additional,
      cellphone: request.body.cellphone,
      edress: request.body.edress,
      edress_additional: request.body.edress_additional,
      email: request.body.email,
      email_additional: request.body.email_additional,
      document_type: request.body.document_type,
      document: request.body.document,
      obs: request.body.obs,
    };

    const res = await connection('clients').insert(register);
    return response.json(res);
  } catch (error) {
    return response.json(error);
  }
}

const update = async (request, response) => {
  try {
    if (! await UserHelper.validUser(request.headers.hash))
      return response.json({ error: 'Access denied' });

    const register = {
      last_user: request.headers.user_id,
      updated_at: moment().format('L LT'),
      code: request.body.code,
      name: request.body.name,
      companie: request.body.companie,
      phone: request.body.phone,
      phone_additional: request.body.phone_additional,
      cellphone: request.body.cellphone,
      edress: request.body.edress,
      edress_additional: request.body.edress_additional,
      email: request.body.email,
      email_additional: request.body.email_additional,
      document_type: request.body.document_type,
      document: request.body.document,
      obs: request.body.obs,
    };
    const res = await connection('clients').where('id', '=', request.params.id).update(register)
    return response.json(res);
  } catch (error) {
    return response.json(error);
  }
}


const deleteRegister = async (request, response) => {
  try {
    if (! await UserHelper.validUser(request.headers.hash))
      return response.json({ error: 'Access denied' });

    const res = await connection('clients').where('id', '=', request.params.id).del();
    return response.json(res);
  } catch (error) {
    return response.json(error);
  }
}

const getById = async (request, response) => {
  try {
    if (! await UserHelper.validUser(request.headers.hash))
      return response.json({ error: 'Access denied' });

    const res = await connection('clients')
      .where('id', '=', request.params.id)
      .select('*')
      .first();
    const companie = await CompanieHelper.getById(res.companie);
    const client = {
      ...res,
      companie_name: companie ? companie.name : ''
    }
    return response.json(client);
  } catch (error) {
    console.log(error)
    return response.json(error);
  }
}


const findByName = async (request, response) => {
  try {
    if (! await UserHelper.validUser(request.headers.hash))
      return response.json({ error: 'Access denied' });

    const res = await connection('clients')
      .where('name', 'like', '%' + request.params.name + '%')
      .select('*');
    clients = [];
    for (client of res) {
      const companie = await CompanieHelper.getById(client.companie);
      clients.push({ ...client, companie_name: companie ? companie.name : '' })
    }
    return response.json(clients);
  } catch (error) {
    return response.json(error);
  }
}

const findClient = async (request, response) => {
  try {
    if (! await UserHelper.validUser(request.headers.hash))
      return response.json({ error: 'Access denied' });

    const res = await connection('clients')
      .select('*', connection.raw('name || cellphone || document as "to_find"'))
      .where('to_find', 'LIKE', '%' + request.params.find + '%')
    clients = [];
    for (client of res) {
      const companie = await CompanieHelper.getById(client.companie);
      clients.push({ ...client, companie_name: companie ? companie.name : '' })
    }
    return response.json(clients);
  } catch (error) {
    console.log(error)
    return response.json(error);
  }
}



module.exports = {
  getAll,
  newRegister,
  getById,
  findByName,
  update,
  findClient,
  deleteRegister
}