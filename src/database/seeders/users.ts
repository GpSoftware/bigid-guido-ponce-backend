import { encrypt } from '../../libs/encrypt';
import { User } from '../models';

const users = [
  {
    username: 'ohad',
    email: 'ohad@bigid.com',
    password: 'password123',
    organization_id: 1
  },
  {
    username: 'helen',
    email: 'helen@bigid.com',
    password: 'password123',
    organization_id: 1
  },
];

export const populateUsers = () => {
  return Promise.all(
    users.map(async user => await User.findOrCreate({
      where: {
        email: user.email
      },
      defaults: {
        ...user,
        password: await encrypt(user.password, user.password),
      }
    })),
  );
};