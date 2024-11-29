import { client } from './../utils/fetchClient';

export const getUser = async email => {
  const response = await client.get(`/users`, {
    params: {
      email,
    },
  });

  return response.data;
};
