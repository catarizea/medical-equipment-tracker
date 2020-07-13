module.exports = ({ host, invitationId, toName }) => `
Hi, ${toName},

Please use the link from bellow to create your account on our Hospital medical.equipment platform.
${host}/signup/${invitationId}

Thank you!
Have a nice day,

Systems Administrator
`;
