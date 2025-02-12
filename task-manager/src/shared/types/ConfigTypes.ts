export type MongoConfig = {
  user: string;
  pwd: string;
  port: string;
  dbName: string;
  containerName: string;
  collections: {
    users: string;
    tasks: string;
    seasons: string;
    userTasks: string;
    referrals: string;
    dailyCheckIn: string;
  };
  uri?: string;
};
