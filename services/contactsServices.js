import { contacts } from "../models/contacts.js";

// import fs from "fs/promises";
// import path from "path";
// import { v4 as uuid } from "uuid";

// const contactsPath = path.join("db", "contacts.json");

async function listContacts() {
//   const contacts = await fs.readFile(contactsPath);

//   return JSON.parse(contacts);
    return await contacts.find();
}

async function getContactById(contactId) {
//   const contacts = await listContacts();
    const contact = await contacts.findById(contactId);

//   const contact = contacts.find((contact) => contact.id === contactId);
  if (contact) {
    return contact;
  } else {
    return null;
  }
}

async function removeContact(contactId) {
//   const contacts = await listContacts();

//   const deletedIndex = contacts.findIndex(
//     (contact) => contact.id === contactId
//   );
    const deletedContact = await contacts.findByIdAndDelete(contactId);
    
//   if (deletedIndex !== -1) {
//     const newContacts = contacts.filter((contact) => contact.id !== contactId);
//     await fs.writeFile(contactsPath, JSON.stringify(newContacts));
//     return contacts[deletedIndex];
//   } else {
//     return null;
//   }
    if (deletedContact === null) {
    return null;
  }
  return deletedContact;
}

async function addContact({ name, email, phone, favorite }) {
//   const contacts = await listContacts();

//   const newContact = {
//     id: uuid(),
//     name,
//     email,
//     phone,
//   };
    const newContact = await contacts.create({ name, email, phone, favorite });
    
    return newContact;
//   contacts.push(newContact);

//   await fs.writeFile(contactsPath, JSON.stringify(contacts));
//   return newContact;
}

async function updateContact(contactId, { id, name, email, phone, favorite }) {
//   const contacts = await listContacts();

//   const updateIndex = contacts.findIndex((contact) => contact.id === contactId);
//   if (updateIndex !== -1) {
//     const updatedContact = {
//       ...contacts[updateIndex],
//       ...body,
//     };
//     contacts.splice(updateIndex, 1, updatedContact);
//     await fs.writeFile(contactsPath, JSON.stringify(contacts));
//     return updatedContact;
//   } else {
//     return null;
//   }
    const newContact = {
    id,
    name,
    email,
    phone,
    favorite,
    };
    
    const updatedContact = await contacts.findByIdAndUpdate(
    contactId,
    newContact,
    {
      new: true,
    }
  );
  if (updateContact !== null) {
    return updatedContact;
  } else {
    return null;
  }
}

async function updateStatusContact(contactId, { favorite }) {
  const newContact = {
    favorite,
  };
  const updatedContact = await contacts.findByIdAndUpdate(
    contactId,
    newContact,
    {
      new: true,
    }
  );
  if (updateContact !== null) {
    return updatedContact;
  } else {
    return null;
  }
}

export default {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
  updateStatusContact,
};