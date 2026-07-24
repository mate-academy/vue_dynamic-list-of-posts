import { client } from "@/utils/http"; 

export const getUserFromEmail = async email => {
  const response = await client.get(`/users?email=${email}`);

  return response.data;
};
