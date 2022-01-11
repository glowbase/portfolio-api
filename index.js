const axios = require('axios');
const cors = require('cors');
const express = require('express');
const parse = require('node-html-parser').parse;

const app = express();
app.use(cors());

app.get('/', (req, res) => {
	res.redirect('https://cooperbeltra.me');
});

app.get('/google_certs', async (req, res) => {
	const public_profile = 'https://www.cloudskillsboost.google/public_profiles/c80b69c8-25d1-4077-8ff8-778e05e8c56a';

	const { data } = await axios.get(public_profile);
	const root = parse(data);

	const profile_badges_html = root.querySelectorAll('.profile-badge');
	const badges = [];

	profile_badges_html.forEach(profile_badge => {
		const badge_name = profile_badge.querySelector('.ql-subhead-1').innerText;
		const badge_url = profile_badge.querySelector('.badge-image').getAttribute('href');
		const badge_earned = profile_badge.querySelector('.ql-body-2').innerText;

		const months = {
			'Jan': 'January',
			'Feb': 'February',
			'Mar': 'March',
			'Apr': 'April',
			'May': 'May',
			'Jun': 'June',
			'Jul': 'July',
			'Aug': 'August',
			'Sep': 'September',
			'Oct': 'October',
			'Nov': 'November',
			'Dec': 'December'
		};

		const _temp_formatted = badge_earned.replace('  ', ' ').split(' ');

		badges.push({
			url: badge_url,
			name: badge_name,
			earned: `${months[_temp_formatted[1]]} ${_temp_formatted[3]}`
		});
	});

	res.status(200).send(JSON.stringify(badges));
});

app.get('/htb_stats', async (req, res) => {
	const profile_url = 'https://www.hackthebox.com/badge/200316';

	const { data } = await axios.get(profile_url);

	const root = parse(
		Buffer.from(data.split('"')[1], 'base64').toString('binary')
	);

	const results = {
		ranking: parseInt(root.querySelector('.htb_ranking').innerText.replace('Rank: ', '')),
		rank: root.querySelector('.htb_rank').innerText,
		points: root.querySelector('.htb_points').innerText,
		respect: root.querySelector('.htb_respect').innerText,
		avatar: root.querySelector('img').getAttribute('src').replace('_thumb', '')
	};

	res.status(200).json(results);
});

app.get('/ctflearn_stats', async (req, res) => {
	const profile_url = 'https://ctflearn.com/user/Glowbase';

	const { data } = await axios.get(profile_url);
	const root = parse(data);

	const results = {
		rank: parseInt(root.querySelector('.card').querySelector('.mt-2').innerText.split('&')[0].trim())
	};

	res.status(200).json(results);
});

app.listen(8080);