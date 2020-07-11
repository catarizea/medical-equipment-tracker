module.exports = ({ host, token, toName }) => `
Hi, ${toName},

Please use the link from bellow to reset your password at medical.equipment.
${host}/reset-password/${token}

Thank you!
Have a nice day,

Systems Administrator
`;
