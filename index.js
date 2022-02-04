const { Datastore } = require('@google-cloud/datastore');
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const datastore = new Datastore();

const api = express();
api.use(cors());

api.get('/', (req, res) => {
	res.redirect('https://cooperbeltra.me');
});

api.get('/stats/hackthebox', async (req, res) => {
	
	// Get auth token
	const query = await datastore.createQuery('credentials').run();
	const token = 'Bearer ' + query[0][0].bearer;

	// Get full user profile
	const { data: user_profile } = await axios({
		method: 'GET',
		url: `https://www.hackthebox.com/api/v4/user/profile/basic/200316`,
		headers: { 'Authorization': token }
	});

	// Get user country ranking
	const { data: { data: { rankings } } } = await axios({
		method: 'GET',
		url: "https://www.hackthebox.com/api/v4/rankings/country/AU/members",
		headers: { 'Authorization': token }
	});

	const user_country_ranking = rankings.filter(user => user.id == '200316');

	res.status(200).json({
		...user_profile,
		...user_country_ranking
	});
});

api.get('/stats/ctflearn', async (req, res) => {
	const { data } = await axios({
		method: 'GET',
		url: "https://ctflearn.com/user/discord/740495415769563157/json"
	});

	res.status(200).json(data);
});

api.get('/info/skills', async (req, res) =>{
	const query = await datastore.createQuery('skills').run();

	res.status(200).json(query);
});

api.get('/info/certifications', async (req, res) => {
	const query = await datastore.createQuery('certifications').run();

	res.status(200).json(query);
});

api.listen(8080);