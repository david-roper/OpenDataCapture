const axios = require('axios');
const readline = require('readline-sync');

const url = readline.question('Enter base URL of ODC instance');
const username = readline.question('Enter the ID of the item to delete: ');
const password = readline.question('Enter the ID of the item to delete: ');

// Prompt user for the ID
const itemId = readline.question('Enter the ID of the item to delete: ');

// Replace with your actual API endpoint

const handleDeletion = async ({ apiBaseUrl, itemId, password, username }) => {
  const loginPath = `${apiBaseUrl}/v1/auth/login`;
  const endpoint = `${apiBaseUrl}/v1/delete/${itemId}`;

  let loginResponse;
  try {
    loginResponse = await axios.post(
      loginPath,
      { password, username },
      {
        headers: {
          Accept: 'application/json'
        },
        validateStatus: (status) => status === 200
      }
    );
  } catch (err) {
    console.error(err);
    return;
  }

  const accessToken = loginResponse.data.accessToken;

  try {
    await axios.delete(
      endpoint,
      { itemId },
      {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${accessToken}`
        },
        validateStatus: (status) => status === 201
      }
    );
  } catch (err) {
    console.error(err);
    return;
  }
};

handleDeletion({ apiBaseUrl: url, itemId: itemId, password, username });
