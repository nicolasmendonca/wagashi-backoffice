import {Db, MongoClient} from 'mongodb';
import {NextApiRequest} from 'next';
import nextConnect from 'next-connect';

const client = new MongoClient(process.env.MONGODB_URI, {
  useUnifiedTopology: true,
});

async function database(req, res, next) {
  if (!client.isConnected()) await client.connect();
  req.dbClient = client;
  req.db = client.db(process.env.NODE_ENV === 'development' ? 'MCT' : 'production');
  return next();
}

const middleware = nextConnect();
middleware.use(database);
export default middleware;

export interface Request extends NextApiRequest {
  db: Db;
}
