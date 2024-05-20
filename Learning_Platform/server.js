const express = require('express');
const PORT = 4000;
const app = express();

app.listen(PORT, () => {
  console.log(`Main server is running on port ${PORT}`);
});
