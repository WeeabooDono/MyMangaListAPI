const config = {
	production: {
		DATABASE: process.env.DB_CONNECTION,
	},
	default: {
		DATABASE: 'mongodb://localhost:27017/MyMangaList',
	},
};

exports.get = function get(env) {
	return config[env] || config.default;
};
