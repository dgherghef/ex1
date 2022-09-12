let users = [];
let u1 = [];
let cards = [];
let users1 = [];
const addUser = ({ id, room }) => {
  const user = { id, room };
  users.push(user);

  return { user };
};
const removeUser = (id) => {
  const index = users.findIndex((user) => user.id === id);
  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};
const getUsers = (id) => {
  users.map((user) => {
    if (user.id === id) users1.push(user.id);
  });
  return users1;
};
// const getCards = (room, user) => {
//   users.map((el) => {
//     if (el.room == room && el.id === user) cards.push(el.card);
//   });
//   return cards;
// };
const getUsersInRoom = (room) => {
  users.map((el) => {
    if (el.room === room && !u1.includes(el.id)) u1.push(el.id);
  });
  return u1;
  // users.filter((user) => user.room === room);
};
module.exports = { addUser, removeUser, getUsers, getUsersInRoom };
